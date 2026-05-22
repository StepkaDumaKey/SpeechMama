exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return sendJson(405, { error: "Method not allowed" });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  const transcriptionModel = process.env.GROQ_TRANSCRIPTION_MODEL || "whisper-large-v3-turbo";
  if (!groqApiKey) {
    return sendJson(503, { error: "Groq key is not configured" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const scope = body.scope === "report" ? "report" : "field";
    const field = sanitizeText(body.field || "", 80);
    const label = sanitizeText(body.label || field, 120);
    const value = sanitizeText(body.value || "", 2400);
    const context = sanitizeContext(body.context || {});
    const transcription = await transcribeDictation({
      audioBase64: body.audioBase64,
      mimeType: body.mimeType,
      groqApiKey,
      transcriptionModel
    });

    if (!transcription) {
      return sendJson(422, { error: "Не удалось распознать речь" });
    }

    if (scope === "report") {
      const fields = await summarizeReportDictation({ transcription, context, groqApiKey, groqModel });
      return sendJson(200, { fields, transcript: transcription });
    }

    const text = await summarizeFieldDictation({
      transcription,
      field,
      label,
      value,
      context,
      groqApiKey,
      groqModel
    });
    return sendJson(200, { text, transcript: transcription });
  } catch (error) {
    console.error(error);
    return sendJson(500, { error: "Dictation failed" });
  }
};

async function transcribeDictation({ audioBase64, mimeType, groqApiKey, transcriptionModel }) {
  const safeMimeType = sanitizeAudioMimeType(mimeType);
  const form = new FormData();
  form.append("file", new Blob([decodeAudio(audioBase64)], { type: safeMimeType }), `dictation.${audioExtension(safeMimeType)}`);
  form.append("model", transcriptionModel);
  form.append("language", "ru");
  form.append("response_format", "json");
  form.append("temperature", "0");
  form.append(
    "prompt",
    "Диктовка логопеда для логопедического заключения на русском языке. Сохраняй медицинские и логопедические термины."
  );

  const groqResponse = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${groqApiKey}` },
    body: form
  });
  const result = await groqResponse.json().catch(() => ({}));
  if (!groqResponse.ok) {
    console.error("Groq transcription error:", result);
    throw new Error("Groq transcription error");
  }
  return sanitizeText(result.text || "", 12_000);
}

async function summarizeFieldDictation({ transcription, field, label, value, context, groqApiKey, groqModel }) {
  const prompt = [
    "Сделай редактируемое резюме диктовки для одного поля логопедического заключения.",
    `Поле: ${label} (${field})`,
    `Уже есть в поле: ${value || "(пусто)"}`,
    "Диктовка:",
    transcription,
    "",
    "Контекст других полей:",
    JSON.stringify(context, null, 2),
    "",
    "Верни только текст, который нужно добавить в это поле после уже введенного текста.",
    "Не повторяй уже введенный текст. Не выдумывай факты и диагнозы.",
    "Сохрани официальный стиль логопедического заключения.",
    "Если диктовка не относится к этому полю, верни пустую строку."
  ].join("\n");
  return sanitizeSummaryText(await requestGroqText({ prompt, groqApiKey, groqModel, maxOutputTokens: 420 }), field === "reason" ? 1200 : 3200);
}

async function summarizeReportDictation({ transcription, context, groqApiKey, groqModel }) {
  const prompt = [
    "Разложи диктовку логопеда по полям логопедического заключения.",
    "Верни строго JSON без markdown:",
    '{"reason":"","anamnesis":"","sections":{"behavior":"","motor":"","play":"","cognition":"","comprehension":"","articulation":"","breathing":"","sound":"","phonemics":"","syllables":"","vocabulary":"","grammar":"","connectedSpeech":""},"conclusion":"","recommendations":[]}',
    "",
    "Правила:",
    "1. Вставляй только факты из диктовки, не выдумывай новые сведения.",
    "2. Не ставь диагноз, если он не был продиктован явно.",
    "3. Формулируй текст как редактируемые абзацы для заключения, а не как стенограмму.",
    "4. Пустые поля оставляй пустыми строками.",
    "",
    "Текущий контекст:",
    JSON.stringify(context, null, 2),
    "",
    "Диктовка:",
    transcription
  ].join("\n");
  return parseReportDictation(await requestGroqText({ prompt, groqApiKey, groqModel, maxOutputTokens: 1500 }));
}

async function requestGroqText({ prompt, groqApiKey, groqModel, maxOutputTokens }) {
  const groqResponse = await fetch("https://api.groq.com/openai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: groqModel,
      input: [
        "Ты помогаешь логопеду-дефектологу превращать голосовые заметки в профессиональные формулировки на русском языке.",
        "Не придумывай данные, которых нет в диктовке.",
        "",
        prompt
      ].join("\n"),
      temperature: 0.1,
      max_output_tokens: maxOutputTokens,
      reasoning: { effort: "low" }
    })
  });
  const result = await groqResponse.json().catch(() => ({}));
  if (!groqResponse.ok) {
    console.error("Groq dictation summary error:", result);
    throw new Error("Groq dictation summary error");
  }
  return extractResponseText(result);
}

function decodeAudio(audioBase64) {
  const clean = String(audioBase64 || "").replace(/^data:[^,]+,/, "");
  if (!clean || clean.length > 13_000_000) {
    throw new Error("Audio payload is missing or too large");
  }
  return Buffer.from(clean, "base64");
}

function sanitizeAudioMimeType(mimeType) {
  const value = String(mimeType || "").split(";")[0].toLowerCase();
  return ["audio/webm", "audio/ogg", "audio/wav", "audio/mpeg", "audio/mp4"].includes(value)
    ? value
    : "audio/webm";
}

function audioExtension(mimeType) {
  const extensions = {
    "audio/ogg": "ogg",
    "audio/wav": "wav",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/webm": "webm"
  };
  return extensions[mimeType] || "webm";
}

function extractResponseText(result) {
  if (result?.output_text) return result.output_text;
  const parts = [];
  for (const item of result?.output || []) {
    if (item?.type !== "message") continue;
    for (const content of item.content || []) {
      if (content?.type === "output_text" && content.text) parts.push(content.text);
    }
  }
  return parts.join("\n").trim();
}

function parseReportDictation(text) {
  let parsed = {};
  try {
    parsed = JSON.parse(String(text || "").replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
  } catch {
    parsed = {};
  }
  const sectionIds = [
    "behavior",
    "motor",
    "play",
    "cognition",
    "comprehension",
    "articulation",
    "breathing",
    "sound",
    "phonemics",
    "syllables",
    "vocabulary",
    "grammar",
    "connectedSpeech"
  ];
  const sections = {};
  sectionIds.forEach((id) => {
    sections[id] = sanitizeSummaryText(parsed.sections?.[id], 2400);
  });
  return {
    reason: sanitizeSummaryText(parsed.reason, 1200),
    anamnesis: sanitizeSummaryText(parsed.anamnesis, 3200),
    sections,
    conclusion: sanitizeSummaryText(parsed.conclusion, 1800),
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.slice(0, 12).map((item) => sanitizeSummaryText(item, 280)).filter(Boolean)
      : []
  };
}

function sanitizeSummaryText(text, maxLength) {
  return sanitizeText(
    String(text || "")
      .replace(/^```[\s\S]*?\n?/, "")
      .replace(/```$/g, "")
      .replace(/^["'«]|["'»]$/g, "")
      .replace(/^(ответ|резюме|текст)\s*:\s*/i, ""),
    maxLength
  );
}

function sanitizeContext(context) {
  const result = {
    profile: sanitizeText(context.profile || "", 120),
    reason: sanitizeText(context.reason || "", 600),
    anamnesis: sanitizeText(context.anamnesis || "", 900),
    conclusion: sanitizeText(context.conclusion || "", 500),
    recommendations: Array.isArray(context.recommendations)
      ? context.recommendations.slice(0, 10).map((item) => sanitizeText(item, 180))
      : [],
    sections: {}
  };
  const sections = context.sections && typeof context.sections === "object" ? context.sections : {};
  Object.entries(sections).slice(0, 16).forEach(([key, value]) => {
    result.sections[sanitizeText(key, 60)] = sanitizeText(value, 700);
  });
  return result;
}

function sanitizeText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function sendJson(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}
