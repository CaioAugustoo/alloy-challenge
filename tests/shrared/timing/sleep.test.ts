import { describe, expect, test } from "vitest";
import { sleep } from "../../../src/shared/timing/sleep";

describe("sleep", () => {
  test("should delay at least the specified time", async () => {
    const start = Date.now();
    await sleep(100);
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(100);
  });
});
