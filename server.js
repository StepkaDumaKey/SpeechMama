const http = require("http");
const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const staticDir = path.join(rootDir, "public");
const env = loadEnv(path.join(rootDir, ".env"));
const port = Number(env.PORT || 8026);
const groqApiKey = env.GROQ_API_KEY;
const groqModel = env.GROQ_MODEL || "openai/gpt-oss-20b";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "POST" && request.url === "/api/suggest") {
      await handleSuggest(request, response);
      return;
    }

    if (request.method === "GET") {
      serveStatic(request, response);
      return;
    }

    sendJson(response, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Internal server error" });
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Speech report builder: http://127.0.0.1:${port}/`);
});

async function handleSuggest(request, response) {
  if (!groqApiKey) {
    sendJson(response, 503, { suggestion: "", source: "Groq key is not configured" });
    return;
  }

  const body = await readJson(request, 120_000);
  const field = sanitizeText(body.field || "", 80);
  const label = sanitizeText(body.label || field, 120);
  const value = sanitizeText(body.value || "", 2400);
  const localSuggestion = sanitizeText(body.localSuggestion || "", 2400);
  const context = sanitizeContext(body.context || {});

  const prompt = buildSuggestionPrompt({ field, label, value, localSuggestion, context });
  const groqResponse = await fetch("https://api.groq.com/openai/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${groqApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: groqModel,
      input: [
        "Ты помогаешь логопеду-дефектологу составлять профессиональные заключения на русском языке.",
        "Не ставь диагноз самостоятельно, не выдумывай факты, не добавляй персональные данные.",
        "Отвечай только текстом подсказки без markdown.",
        "",
        prompt
      ].join("\n"),
      temperature: 0.2,
      max_output_tokens: 180,
      reasoning: { effort: "low" }
    })
  });

  const result = await groqResponse.json().catch(() => ({}));
  if (!groqResponse.ok) {
    console.error("Groq error:", result);
    sendJson(response, 502, { suggestion: "", source: "Groq error" });
    return;
  }

  const raw = extractResponseText(result);
  const suggestion = normalizeSuggestion(raw, value, field);
  sendJson(response, 200, {
    suggestion,
    source: suggestion ? `Groq: ${groqModel}` : ""
  });
}

function extractResponseText(result) {
  if (result?.output_text) return result.output_text;

  const parts = [];
  for (const item of result?.output || []) {
    if (item?.type !== "message") continue;
    for (const content of item.content || []) {
      if (content?.type === "output_text" && content.text) {
        parts.push(content.text);
      }
    }
  }
  return parts.join("\n").trim();
}

function buildSuggestionPrompt({ field, label, value, localSuggestion, context }) {
  return [
    "Нужно предложить автодополнение для одного поля логопедического заключения.",
    "",
    `Поле: ${label} (${field})`,
    `Уже введено в поле: ${value || "(пусто)"}`,
    `Локальная подсказка из прошлых заключений: ${localSuggestion || "(нет)"}`,
    "",
    "Контекст заключения без ФИО и дат:",
    JSON.stringify(context, null, 2),
    "",
    "Правила:",
    "1. Верни один лучший вариант заполнения поля.",
    "2. Если в поле уже есть текст, вариант должен начинаться ровно с уже введенного текста и продолжать его.",
    "3. Не добавляй диагноз, если он не выбран в контексте.",
    "4. Не упоминай интернет, источники, модель, вероятности и свои рассуждения.",
    "5. Стиль: официальный, похожий на логопедическое заключение.",
    "6. Если хорошей подсказки нет, верни пустую строку.",
    "7. Ответ должен быть не длиннее 2 предложений для коротких полей и 1 абзаца для текстовых разделов."
  ].join("\n");
}

function normalizeSuggestion(raw, currentValue, field) {
  let text = String(raw || "")
    .replace(/^```[\s\S]*?\n?/, "")
    .replace(/```$/g, "")
    .replace(/^["'«]|["'»]$/g, "")
    .replace(/\s+/g, " ")
    .trim();

  text = text.replace(/^(подсказка|вариант|ответ)\s*:\s*/i, "").trim();
  if (!text || /^пустая строка$/i.test(text)) return "";
  if (field === "reason") text = text.replace(/[.!?]+$/g, "").trim();

  const current = String(currentValue || "").trim();
  if (!current) return text;

  const normalizedText = normalizeForCompare(text);
  const normalizedCurrent = normalizeForCompare(current);
  if (normalizedText.startsWith(normalizedCurrent)) return field === "reason" ? text.replace(/[.!?]+$/g, "").trim() : text;

  if (/^[,.;:!?)]/.test(text)) return `${current}${text}`;
  const completed = `${current} ${lowercaseFirst(text)}`.replace(/\s+/g, " ").trim();
  return field === "reason" ? completed.replace(/[.!?]+$/g, "").trim() : completed;
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
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalizeForCompare(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[.,;:!?()[\]«»"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lowercaseFirst(text) {
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

function serveStatic(request, response) {
  const requestPath = decodeURIComponent(new URL(request.url, `http://127.0.0.1:${port}`).pathname);
  const filePath = requestPath === "/" ? path.join(staticDir, "index.html") : path.join(staticDir, requestPath);
  const normalized = path.normalize(filePath);

  if (!normalized.startsWith(staticDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(normalized, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(normalized)] || "application/octet-stream"
    });
    response.end(data);
  });
}

function readJson(request, maxBytes) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBytes) {
        reject(new Error("Request body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        if (index === -1) return [line, ""];
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );
}
