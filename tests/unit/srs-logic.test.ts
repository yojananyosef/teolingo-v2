import { describe, expect, it } from "bun:test";
import { calculateNextReview } from "@/features/lessons/srs-logic";

describe("SRS Logic (SuperMemo-2 IME Adaptation)", () => {
  it("should set initial interval to 1 day on first successful review (quality >= 3)", () => {
    const result = calculateNextReview(4, 0, 250, 0);

    expect(result.interval).toBe(1);
    expect(result.repetitionCount).toBe(1);
    expect(result.easeFactor).toBeGreaterThanOrEqual(130);
  });

  it("should set interval to 6 days on second successful review", () => {
    const result = calculateNextReview(4, 1, 250, 1);

    expect(result.interval).toBe(6);
    expect(result.repetitionCount).toBe(2);
  });

  it("should exponentially scale interval on subsequent successful reviews", () => {
    const result = calculateNextReview(5, 6, 250, 2);

    expect(result.interval).toBeGreaterThan(6);
    expect(result.repetitionCount).toBe(3);
  });

  it("should reset interval to 1 day and repetitionCount to 0 on failure (quality < 3)", () => {
    const result = calculateNextReview(2, 10, 250, 4);

    expect(result.interval).toBe(1);
    expect(result.repetitionCount).toBe(0);
    expect(result.easeFactor).toBe(230); // 250 - 20
  });

  it("should enforce a minimum ease factor of 130", () => {
    const result = calculateNextReview(1, 10, 140, 2);

    expect(result.easeFactor).toBe(130); // Cannot drop below 130
  });
});
