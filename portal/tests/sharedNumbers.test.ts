import assert from "node:assert/strict";
import test from "node:test";
import { makeLuckyUrl, parseLuckyNumbers } from "../lib/sharedNumbers.ts";

test("keeps valid lucky values in order and ignores malformed values", () => {
  assert.deepEqual(parseLuckyNumbers("1678,bad,8888"), ["1678", "8888"]);
  assert.deepEqual(parseLuckyNumbers("0000,2222,4444,9999"), ["0000", "2222", "4444"]);
  assert.deepEqual(parseLuckyNumbers("0007,0007,1234"), ["0007", "1234"]);
  assert.deepEqual(parseLuckyNumbers("12,12345,word"), []);
});

test("creates a compact, shareable lucky URL", () => {
  assert.equal(makeLuckyUrl("https://magnum4dclassic.vercel.app", "/", ["1678", "8888"]), "https://magnum4dclassic.vercel.app/?lucky=1678%2C8888");
});