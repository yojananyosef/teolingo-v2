import type { MorphologicalPart } from "@/components/HebrewWordIME";

export type ExerciseType =
  | "multiple-choice"
  | "translation"
  | "word-bank"
  | "noun-parsing"
  | "adjective-parsing"
  | "prefix-parsing"
  | "pronoun-parsing"
  | "suffix-parsing"
  | "verb-parsing";

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  correctAnswer: string;
  options: string[]; // Options can be stringified JSON for parsing exercises
  hebrewText?: string;
  hebrewParts?: MorphologicalPart[];
  audioUrl?: string;
  hint?: string | null;
  originalIndex?: number;
}

export interface TranslationExercise extends BaseExercise {
  type: "translation";
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: "multiple-choice";
}

export interface WordBankExercise extends BaseExercise {
  type: "word-bank";
}

export interface NounParsingExercise extends BaseExercise {
  type: "noun-parsing";
}

export interface AdjectiveParsingExercise extends BaseExercise {
  type: "adjective-parsing";
}

export interface PrefixParsingExercise extends BaseExercise {
  type: "prefix-parsing";
}

export interface PronounParsingExercise extends BaseExercise {
  type: "pronoun-parsing";
}

export interface SuffixParsingExercise extends BaseExercise {
  type: "suffix-parsing";
}

export interface VerbParsingExercise extends BaseExercise {
  type: "verb-parsing";
}

export type Exercise =
  | TranslationExercise
  | MultipleChoiceExercise
  | WordBankExercise
  | NounParsingExercise
  | AdjectiveParsingExercise
  | PrefixParsingExercise
  | PronounParsingExercise
  | SuffixParsingExercise
  | VerbParsingExercise;
