const sessionId = new URLSearchParams(window.location.search).get("session") || "";
const recordButton = document.querySelector("#mobileRecordBtn");
const recordText = document.querySelector("#mobileRecordText");
const status = document.querySelector("#mobileStatus");
let session = null;
let recorder = null;
let stream = null;
let chunks = [];

init();

async function init() {
  if (!sessionId) {
    setError("Ссылка на диктовку неполная.");
    return;
  }
  try {
    const response = await fetch(`/api/mobile-session?id=${encodeURIComponent(sessionId)}`, {
      headers: { "Cache-Control": "no-store" }
    });
    const payload = await response.json().catch(() => ({}));
    if (response.status === 410) {
      setError("Ссылка уже истекла. Создайте новую на компьютере.");
      return;
    }
    if (!response.ok) throw new Error(payload.error || "Session failed");
    session = payload;
    document.querySelector("#mobileTitle").textContent =
      session.scope === "field" ? session.label || "Наговорить поле" : "Наговорить заключение";
    document.querySelector("#mobileHint").textContent =
      session.scope === "field"
        ? "Нажмите, наговорите заметку для этого поля и нажмите еще раз."
        : "Нажмите, наговорите заметки по ребенку и остановите запись.";
    status.textContent = "Телефон готов к записи.";
    recordButton.disabled = false;
    recordButton.addEventListener("click", toggleRecording);
  } catch (error) {
    console.warn(error);
    setError("Не удалось открыть диктовку.");
  }
}

async function toggleRecording() {
  if (recorder) {
    stopRecording();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
    setError("Этот браузер не поддерживает запись голоса.");
    return;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = preferredMimeType();
    recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    chunks = [];
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data?.size) chunks.push(event.data);
    });
    recorder.addEventListener("stop", finishRecording);
    recorder.start();
    recordButton.classList.add("is-recording");
    recordText.textContent = "Остановить";
    status.textContent = "Идет запись.";
  } catch (error) {
    console.warn(error);
    setError("Не удалось получить доступ к микрофону.");
  }
}

function stopRecording() {
  if (recorder?.state !== "inactive") recorder.stop();
}

async function finishRecording() {
  const currentRecorder = recorder;
  recorder = null;
  stream?.getTracks().forEach((track) => track.stop());
  recordButton.classList.remove("is-recording");
  recordButton.disabled = true;
  recordText.textContent = "Обрабатываю";
  status.textContent = "Отправляю диктовку в бланк.";

  try {
    const audio = new Blob(chunks, { type: currentRecorder.mimeType || "audio/webm" });
    const dictation = await summarizeAudio(audio);
    await saveResult(dictation);
    recordText.textContent = "Готово";
    status.textContent = "Диктовка отправлена. Вернитесь к компьютеру.";
  } catch (error) {
    console.warn(error);
    recordButton.disabled = false;
    recordText.textContent = "Повторить";
    status.textContent = "Не получилось обработать диктовку. Можно записать еще раз.";
  }
}

async function summarizeAudio(audio) {
  const response = await fetch("/api/dictate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      audioBase64: await blobToBase64(audio),
      mimeType: audio.type || "audio/webm",
      scope: session.scope,
      field: session.field || "",
      label: session.label || "",
      value: session.value || "",
      context: session.context || {}
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Dictation failed");
  return payload;
}

async function saveResult(result) {
  const response = await fetch("/api/mobile-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "result",
      id: session.id,
      result
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Session save failed");
}

function preferredMimeType() {
  return ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"].find((mimeType) => {
    return MediaRecorder.isTypeSupported(mimeType);
  });
}

async function blobToBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let index = 0; index < bytes.length; index += 16_384) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 16_384));
  }
  return btoa(binary);
}

function setError(text) {
  document.querySelector("#mobileTitle").textContent = "Диктовка недоступна";
  document.querySelector("#mobileHint").textContent = "";
  status.textContent = text;
  recordButton.disabled = true;
}
