import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";
import QRCode from "qrcode";

const STORE_NAME = "speech-mobile-dictation";
const SESSION_MS = 20 * 60 * 1000;

export default async function mobileSession(request) {
  try {
    const url = new URL(request.url);
    if (request.method === "GET" && url.searchParams.get("action") === "qr") {
      return qrResponse(url.searchParams.get("url"));
    }

    const store = getStore(STORE_NAME);
    if (request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      if (body.action === "result") return saveResult(store, body);
      return createSession(store, body);
    }

    if (request.method === "GET") {
      return readSession(store, Object.fromEntries(url.searchParams));
    }

    return sendJson(405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return sendJson(500, { error: "Mobile dictation session failed" });
  }
}

async function createSession(store, body) {
  const id = makeSessionId();
  const now = Date.now();
  const session = {
    id,
    status: "waiting",
    createdAt: now,
    expiresAt: now + SESSION_MS,
    scope: body.scope === "report" ? "report" : "field",
    field: sanitizeText(body.field || "", 80),
    label: sanitizeText(body.label || "", 120),
    value: sanitizeText(body.value || "", 2400),
    context: sanitizeContext(body.context || {}),
    result: null
  };
  await store.setJSON(sessionKey(id), session, { metadata: { expiration: session.expiresAt } });
  return sendJson(200, { id, expiresAt: session.expiresAt });
}

async function readSession(store, params) {
  const id = sanitizeSessionId(params.id);
  if (!id) return sendJson(400, { error: "Session id is missing" });
  const session = await getFreshSession(store, id);
  if (!session) return sendJson(404, { error: "Session not found" });
  if (session.expired) return sendJson(410, { error: "Session expired" });

  if (params.role === "desktop") {
    return sendJson(200, {
      id: session.id,
      status: session.status,
      result: session.status === "ready" ? session.result : null
    });
  }

  return sendJson(200, {
    id: session.id,
    status: session.status,
    scope: session.scope,
    field: session.field,
    label: session.label,
    value: session.value,
    context: session.context,
    expiresAt: session.expiresAt
  });
}

async function saveResult(store, body) {
  const id = sanitizeSessionId(body.id);
  if (!id) return sendJson(400, { error: "Session id is missing" });
  const session = await getFreshSession(store, id);
  if (!session) return sendJson(404, { error: "Session not found" });
  if (session.expired) return sendJson(410, { error: "Session expired" });

  const result = sanitizeResult(body.result || {}, session.scope);
  await store.setJSON(
    sessionKey(id),
    {
      ...session,
      status: "ready",
      updatedAt: Date.now(),
      result
    },
    { metadata: { expiration: session.expiresAt } }
  );
  return sendJson(200, { ok: true });
}

async function getFreshSession(store, id) {
  const session = await store.get(sessionKey(id), { type: "json", consistency: "strong" });
  if (!session) return null;
  if (Number(session.expiresAt || 0) < Date.now()) {
    await store.delete(sessionKey(id));
    return { expired: true };
  }
  return session;
}

async function qrResponse(value) {
  const safeUrl = String(value || "").slice(0, 1200);
  if (!/^https?:\/\//.test(safeUrl)) return sendJson(400, { error: "QR URL is invalid" });
  const svg = await QRCode.toString(safeUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 280,
    color: {
      dark: "#232725",
      light: "#ffffff"
    }
  });
  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "no-store"
    }
  });
}

function sanitizeResult(result, scope) {
  if (scope === "field") {
    return { text: sanitizeText(result.text || "", 4000) };
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
    sections[id] = sanitizeText(result.fields?.sections?.[id] || "", 3200);
  });
  return {
    fields: {
      reason: sanitizeText(result.fields?.reason || "", 1600),
      anamnesis: sanitizeText(result.fields?.anamnesis || "", 4000),
      conclusion: sanitizeText(result.fields?.conclusion || "", 2400),
      sections,
      recommendations: Array.isArray(result.fields?.recommendations)
        ? result.fields.recommendations.slice(0, 12).map((item) => sanitizeText(item, 300)).filter(Boolean)
        : []
    }
  };
}

function makeSessionId() {
  return crypto.randomBytes(18).toString("base64url");
}

function sanitizeSessionId(id) {
  const value = String(id || "");
  return /^[A-Za-z0-9_-]{16,80}$/.test(value) ? value : "";
}

function sessionKey(id) {
  return `sessions/${id}`;
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

function sendJson(status, payload) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
