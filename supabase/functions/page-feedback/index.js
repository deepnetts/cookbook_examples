import { createClient } from "npm:@supabase/supabase-js@2";
import {
  PayloadValidationError,
  validateFeedbackPayload,
} from "./validation.js";

const MAX_REQUEST_BYTES = 8_192;
const ALLOWED_ORIGINS_VARIABLE = "FEEDBACK_ALLOWED_ORIGINS";

function jsonResponse(body, status, origin, extraHeaders = {}) {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  return new Response(JSON.stringify(body), { status, headers });
}

function configuredOrigins() {
  const configured = Deno.env.get(ALLOWED_ORIGINS_VARIABLE) ?? "";
  const origins = new Set();

  for (const item of configured.split(",")) {
    const candidate = item.trim();
    if (candidate === "") continue;
    try {
      const url = new URL(candidate);
      if (url.protocol !== "https:" && url.protocol !== "http:") continue;
      origins.add(url.origin);
    } catch {
      console.error(`Ignoring invalid origin in ${ALLOWED_ORIGINS_VARIABLE}.`);
    }
  }

  return origins;
}

function requestOrigin(request, allowedOrigins) {
  const origin = request.headers.get("Origin");
  if (origin && allowedOrigins.has(origin)) return origin;

  const allowMissing = Deno.env.get("FEEDBACK_ALLOW_MISSING_ORIGIN") === "true";
  if (!origin && allowMissing) return null;

  throw new PayloadValidationError("Origin is not allowed.");
}

function getSupabaseSecretKey() {
  const hostedKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (hostedKeys) {
    try {
      const parsed = JSON.parse(hostedKeys);
      if (typeof parsed.default === "string") return parsed.default;
      const firstKey = Object.values(parsed).find(
        (value) => typeof value === "string",
      );
      if (firstKey) return firstKey;
    } catch {
      throw new Error("SUPABASE_SECRET_KEYS is not valid JSON.");
    }
  }

  const localKey = Deno.env.get("SUPABASE_SECRET_KEY");
  if (localKey) return localKey;

  // Legacy hosted/local projects still expose this variable. It remains
  // server-side and is never returned to the browser.
  const legacyKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacyKey) return legacyKey;

  throw new Error("No Supabase server-side secret key is configured.");
}

async function readJsonBody(request) {
  const contentType = request.headers.get("Content-Type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new PayloadValidationError("Content-Type must be application/json.");
  }

  const contentLength = request.headers.get("Content-Length");
  if (contentLength !== null) {
    const declaredBytes = Number(contentLength);
    if (Number.isFinite(declaredBytes) && declaredBytes > MAX_REQUEST_BYTES) {
      throw new PayloadValidationError("Request body is too large.");
    }
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_REQUEST_BYTES) {
    throw new PayloadValidationError("Request body is too large.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new PayloadValidationError("Request body must contain valid JSON.");
  }
}

Deno.serve(async (request) => {
  const allowedOrigins = configuredOrigins();
  let origin;

  try {
    if (allowedOrigins.size === 0) {
      throw new Error(`${ALLOWED_ORIGINS_VARIABLE} is not configured.`);
    }
    origin = requestOrigin(request, allowedOrigins);
  } catch (error) {
    const configurationError = !(error instanceof PayloadValidationError);
    return jsonResponse(
      {
        ok: false,
        error: configurationError
          ? "Feedback service is not configured."
          : "Request origin is not allowed.",
      },
      configurationError ? 503 : 403,
    );
  }

  if (request.method === "OPTIONS") {
    const headers = new Headers({
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Max-Age": "86400",
      "Cache-Control": "no-store",
    });
    if (origin) {
      headers.set("Access-Control-Allow-Origin", origin);
      headers.set("Vary", "Origin");
    }
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== "POST") {
    return jsonResponse(
      { ok: false, error: "Method not allowed." },
      405,
      origin ?? undefined,
      { Allow: "POST, OPTIONS" },
    );
  }

  try {
    const payload = validateFeedbackPayload(await readJsonBody(request));

    // Silently accept bot submissions, but never write them to the database.
    if (payload.isHoneypot) {
      return jsonResponse({ ok: true }, 200, origin ?? undefined);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!supabaseUrl) throw new Error("SUPABASE_URL is not configured.");

    const supabase = createClient(supabaseUrl, getSupabaseSecretKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.rpc("submit_page_feedback", {
      p_response_id: payload.responseId,
      p_page_path: payload.pagePath,
      p_page_title: payload.pageTitle,
      p_rating: payload.rating,
      p_feedback_comment: payload.comment,
    });

    if (error) {
      if (error.code === "P0001" && error.message.includes("feedback_rate_limited")) {
        return jsonResponse(
          { ok: false, error: "Please wait a moment and try again." },
          429,
          origin ?? undefined,
          { "Retry-After": "1" },
        );
      }
      console.error("Feedback database write failed.", {
        code: error.code,
        message: error.message,
      });
      return jsonResponse(
        { ok: false, error: "Feedback could not be saved." },
        500,
        origin ?? undefined,
      );
    }

    return jsonResponse(
      { ok: true, response: data },
      200,
      origin ?? undefined,
    );
  } catch (error) {
    if (error instanceof PayloadValidationError) {
      return jsonResponse(
        { ok: false, error: error.message },
        error.message === "Request body is too large." ? 413 : 400,
        origin ?? undefined,
      );
    }

    console.error("Feedback function failed.", error);
    return jsonResponse(
      { ok: false, error: "Feedback service is temporarily unavailable." },
      503,
      origin ?? undefined,
    );
  }
});
