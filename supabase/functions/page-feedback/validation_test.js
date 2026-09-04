import {
  PayloadValidationError,
  validateFeedbackPayload,
} from "./validation.js";

const validPayload = {
  responseId: "8c758e94-a1f7-4d0b-b7a5-74df57e8e933",
  pagePath: "/lectures/02-linear-regression/",
  pageTitle: "Linear Regression",
  rating: "not_helpful",
  comment: "  Add another worked example.  ",
  website: "",
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertRejects(payload) {
  let rejected = false;
  try {
    validateFeedbackPayload(payload);
  } catch (error) {
    rejected = error instanceof PayloadValidationError;
  }
  assert(rejected, "Expected the payload to be rejected.");
}

Deno.test("normalizes a valid not-helpful response", () => {
  const result = validateFeedbackPayload(validPayload);
  assert(result.comment === "Add another worked example.", "Comment was not trimmed.");
  assert(result.rating === "not_helpful", "Rating changed unexpectedly.");
  assert(!result.isHoneypot, "Valid request triggered the honeypot.");
});

Deno.test("positive responses cannot retain a comment", () => {
  const result = validateFeedbackPayload({ ...validPayload, rating: "helpful" });
  assert(result.comment === null, "Helpful response retained its comment.");
});

Deno.test("accepts a not-helpful response without a comment", () => {
  const result = validateFeedbackPayload({ ...validPayload, comment: null });
  assert(result.comment === null, "Null comment changed unexpectedly.");
});

Deno.test("accepts a multiline not-helpful comment", () => {
  const result = validateFeedbackPayload({
    ...validPayload,
    comment: "First suggestion.\nSecond suggestion.",
  });
  assert(result.comment?.includes("\n"), "Comment line break was removed.");
});

Deno.test("recognizes a filled honeypot", () => {
  const result = validateFeedbackPayload({ ...validPayload, website: "spam" });
  assert(result.isHoneypot, "Filled honeypot was not recognized.");
});

Deno.test("accepts a neutral response", () => {
  const result = validateFeedbackPayload({ ...validPayload, rating: "neutral" });
  assert(result.rating === "neutral", "Neutral rating changed unexpectedly.");
});

Deno.test("rejects an invalid rating", () => {
  assertRejects({ ...validPayload, rating: "unknown" });
});

Deno.test("rejects a non-canonical page path", () => {
  assertRejects({ ...validPayload, pagePath: "/lectures/../private" });
});

Deno.test("rejects a canonical path outside the exact allowlist", () => {
  assertRejects({ ...validPayload, pagePath: "/foo/" });
});

Deno.test("rejects placeholder example categories", () => {
  assertRejects({ ...validPayload, pagePath: "/examples/language-models/" });
});

Deno.test("rejects comments longer than 500 Unicode characters", () => {
  assertRejects({ ...validPayload, comment: "🙂".repeat(501) });
});

Deno.test("rejects malformed UUIDs", () => {
  assertRejects({ ...validPayload, responseId: "not-a-uuid" });
});
