import { FEEDBACK_PAGE_PATHS } from "./allowed-pages.js";

export class PayloadValidationError extends Error {}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PAGE_PATH_PATTERN = /^\/(?:[A-Za-z0-9][A-Za-z0-9_-]*\/)*$/;
const SINGLE_LINE_CONTROL_CHARACTER_PATTERN = /[\u0000-\u001f\u007f]/;
const COMMENT_CONTROL_CHARACTER_PATTERN =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

function characterLength(value) {
  return Array.from(value).length;
}

function requireString(value, field, maximumLength) {
  if (typeof value !== "string") {
    throw new PayloadValidationError(`${field} must be a string.`);
  }

  const normalized = value.trim();
  if (
    normalized.length === 0 ||
    characterLength(normalized) > maximumLength ||
    SINGLE_LINE_CONTROL_CHARACTER_PATTERN.test(normalized)
  ) {
    throw new PayloadValidationError(`${field} is invalid.`);
  }

  return normalized;
}

export function validateFeedbackPayload(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new PayloadValidationError("Request body must be a JSON object.");
  }

  const responseId = requireString(value.responseId, "responseId", 36);
  if (!UUID_PATTERN.test(responseId)) {
    throw new PayloadValidationError("responseId must be a UUID.");
  }

  const pagePath = requireString(value.pagePath, "pagePath", 255);
  if (!PAGE_PATH_PATTERN.test(pagePath)) {
    throw new PayloadValidationError(
      "pagePath must be a canonical documentation path.",
    );
  }
  if (!FEEDBACK_PAGE_PATHS.has(pagePath)) {
    throw new PayloadValidationError(
      "pagePath is not enabled for documentation feedback.",
    );
  }

  const pageTitle = requireString(value.pageTitle, "pageTitle", 160);
  if (!["helpful", "neutral", "not_helpful"].includes(value.rating)) {
    throw new PayloadValidationError(
      "rating must be helpful, neutral, or not_helpful.",
    );
  }

  if (
    value.comment !== undefined &&
    value.comment !== null &&
    typeof value.comment !== "string"
  ) {
    throw new PayloadValidationError("comment must be a string or null.");
  }

  let comment = typeof value.comment === "string" ? value.comment.trim() : null;
  if (comment === "") comment = null;
  if (comment !== null && characterLength(comment) > 500) {
    throw new PayloadValidationError(
      "comment must contain no more than 500 characters.",
    );
  }
  if (comment !== null && COMMENT_CONTROL_CHARACTER_PATTERN.test(comment)) {
    throw new PayloadValidationError("comment contains invalid characters.");
  }
  if (value.rating === "helpful") comment = null;

  if (value.website !== undefined && typeof value.website !== "string") {
    throw new PayloadValidationError("website must be a string.");
  }

  const website = typeof value.website === "string" ? value.website.trim() : "";

  return {
    responseId: responseId.toLowerCase(),
    pagePath,
    pageTitle,
    rating: value.rating,
    comment,
    isHoneypot: website.length > 0,
  };
}
