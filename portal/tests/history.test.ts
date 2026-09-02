import assert from "node:assert/strict";
import test from "node:test";
import { buildPoints, daysBetween, normalizeNumber, type HistoryData } from "../lib/history.ts";

test("normalizes short entries and rejects invalid numbers", () => {
  assert.equal(normalizeNumber("7"), "0007");
  assert.equal(normalizeNumber("0168"), "0168");
  assert.equal(normalizeNumber("12 34"), "1234");
  assert.equal(normalizeNumber(""), null);
  assert.equal(normalizeNumber("12345"), null);
});

test("calculates calendar-day intervals", () => {
  assert.equal(daysBetween("2026-03-10", "2026-03-01"), 9);
});

test("filters history while retaining the previous-result interval", () => {
  const data: HistoryData = {
    schemaVersion: 1, generatorVersion: "1", generatedAt: "2026-01-01", updatedThrough: "2026-03-01", earliestResult: "2025-01-01",
    sourceRowCount: 3, recordCount: 3, duplicateRowsRemoved: 0, uniqueNumberCount: 1, sourceSha256: "test",
    numbers: { "0007": [["2025-01-01", "001/25", "1"], ["2025-02-01", "010/25", "S"], ["2026-03-01", "040/26", "1"]] },
  };
  const points = buildPoints(data, ["0007"], new Set(["1"]), "2026-01-01", "2026-12-31");
  assert.equal(points.length, 1);
  assert.equal(points[0].daysSincePrevious, 424);
});
