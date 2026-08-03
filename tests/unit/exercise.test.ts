import { describe, expect, it } from "bun:test";
import type { Exercise, ExerciseType } from "@/domain/lessons/exercise";

describe("Domain Exercises", () => {
  it("should validate all 9 exercise types", () => {
    const validTypes: ExerciseType[] = [
      "multiple-choice",
      "translation",
      "word-bank",
      "noun-parsing",
      "adjective-parsing",
      "prefix-parsing",
      "pronoun-parsing",
      "suffix-parsing",
      "verb-parsing",
    ];

    expect(validTypes.length).toBe(9);
  });

  it("should structure a noun-parsing exercise correctly", () => {
    const nounExercise: Exercise = {
      id: "ex-123",
      type: "noun-parsing",
      question: "Identifica el género y número de: סוּסִים",
      correctAnswer: "Masculino Plural",
      options: ["Masculino Singular", "Masculino Plural", "Femenino Singular", "Femenino Plural"],
      hebrewText: "סוּסִים",
      hint: "Observa el sufijo -im (ִים)",
    };

    expect(nounExercise.type).toBe("noun-parsing");
    expect(nounExercise.correctAnswer).toBe("Masculino Plural");
    expect(nounExercise.options).toContain("Masculino Plural");
  });
});
