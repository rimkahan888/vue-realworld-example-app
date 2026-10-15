import { test, expect } from "@playwright/test";
import { extractErrors, NETWORK_ERROR_MESSAGE } from "../../src/common/errors";
import { formatDate, formatError } from "../../src/common/format";

test.describe("extractErrors", () => {
  test("returns API errors from the response body", () => {
    const errors = { email: ["has already been taken"] };
    expect(extractErrors({ response: { data: { errors } } })).toEqual(errors);
  });

  for (const [name, error] of [
    ["undefined", undefined],
    ["no response", new Error("Network Error")],
    ["no data", { response: {} }],
    ["malformed body without errors", { response: { data: {} } }],
  ]) {
    test(`falls back to network error for ${name}`, () => {
      expect(extractErrors(error)).toEqual({
        network: [NETWORK_ERROR_MESSAGE],
      });
    });
  }
});

test.describe("formatDate", () => {
  test("formats a valid ISO date", () => {
    expect(formatDate("2024-03-05T12:00:00Z")).toBe("March 5, 2024");
  });

  test("returns empty string for missing or invalid dates", () => {
    expect(formatDate("not a date")).toBe("");
    expect(formatDate(undefined)).toBe("");
  });
});

test("formatError uses the first message", () => {
  expect(formatError(["is invalid", "too short"])).toBe("is invalid");
});
