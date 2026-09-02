import assert from "node:assert/strict";
import test from "node:test";
import { TRANSLATIONS } from "../lib/i18n.ts";

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") return [prefix];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key));
}

test("all languages provide the complete English translation catalog", () => {
  const expected = leafPaths(TRANSLATIONS.en).sort();
  for (const [language, translation] of Object.entries(TRANSLATIONS)) {
    assert.deepEqual(leafPaths(translation).sort(), expected, `${language} translation keys differ`);
    for (const path of expected) {
      const value = path.split(".").reduce<unknown>((current, key) => (current as Record<string, unknown>)[key], translation);
      assert.equal(typeof value, "string");
      assert.ok((value as string).trim().length > 0, `${language}.${path} is empty`);
    }
  }
});
