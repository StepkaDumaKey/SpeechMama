exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return sendJson(405, { error: "Method not allowed" });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  if (!groqApiKey) {
    return sendJson(503, { error: "Groq key is not configured" });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const context = sanitizeContext(body.context || {});
    const options = Array.isArray(body.options)
      ? body.options.slice(0, 40).map((item) => ({
          id: sanitizeText(item.id || "", 80),
          label: sanitizeText(item.label || "", 120),
          text: sanitizeText(item.text || "", 500)
        }))
      : [];

    const groqResponse = await fetch("https://api.groq.com/openai/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: groqModel,
        input: buildSummaryPrompt(context, options),
        temperature: 0.1,
        max_output_tokens: 220,
        reasoning: { effort: "low" }
      })
    });

    const result = await groqResponse.json().catch(() => ({}));
    if (!groqResponse.ok) {
      console.error("Groq summary error:", result);
      return sendJson(502, { error: "Groq error" });
    }

    const text = extractResponseText(result);
    return sendJson(200, parseSummaryResponse(text, options));
  } catch (error) {
    console.error(error);
    return sendJson(500, { error: "Function error" });
  }
};

function buildSummaryPrompt(context, options) {
  return [
    "Ты помогаешь логопеду-дефектологу выбрать итоговое логопедическое заключение.",
    "Выбери только один вариант из списка. Не ставь новый диагноз вне списка.",
    "Ответь строго JSON без markdown: {\"id\":\"...\",\"reason\":\"короткое объяснение\"}",
    "",
    "Варианты:",
    JSON.stringify(options, null, 2),
    "",
    "Заполненные поля:",
    JSON.stringify(context, null, 2)
  ].join("\n");
}

function parseSummaryResponse(text, options) {
  let parsed = {};
  try {
    parsed = JSON.parse(String(text || "").replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
  } catch {
    parsed = {};
  }

  const selected =
    options.find((item) => item.id === parsed.id) ||
    options.find((item) => normalizeForCompare(text).includes(normalizeForCompare(item.label))) ||
    options.find((item) => normalizeForCompare(text).includes(normalizeForCompare(item.text))) ||
    options[0];

  return {
    id: selected?.id || "",
    conclusion: selected?.text || "",
    reason: sanitizeText(parsed.reason || selected?.label || "", 240)
  };
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
