// Why: Repository interfaces (abstractions) for domain entities.
// Follows the Dependency Inversion Principle (DIP).

import type { User } from "./entities/user.entity";

export interface IUserRepository {
  findById(userId: string, tx?: any): Promise<User | null>;
  update(user: User, tx?: any): Promise<void>;
  insertMistakes(userId: string, exerciseIds: string[], tx?: any): Promise<void>;
}

export interface LessonData {
  id: string;
  title: string;
  xpReward: number;
}

export interface QuizData {
  id: string;
  allowedAttempts: number;
}

export interface ILessonRepository {
  findLessonById(lessonId: string, tx?: any): Promise<LessonData | null>;
  findQuizById(quizId: string, tx?: any): Promise<QuizData | null>;
  ensureQuizExists(quizId: string, fallbackUserId?: string, tx?: any): Promise<void>;
  getQuizExerciseIds(quizId: string, tx?: any): Promise<Set<string>>;
}

export interface UserLessonProgress {
  id: string;
  isCompleted: boolean;
  accuracy: number;
  isPerfect: boolean;
}

export interface UserQuizAssignment {
  id: string;
  isCompleted: boolean;
  score: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirementType: string;
  requirementValue: number;
}

export interface QuizAttemptInput {
  quizId: string;
  studentId: string;
  isPassed: boolean;
  score: number;
  timeLimitSeconds: number;
  timeSpentSeconds: number;
  timedOut: boolean;
  correctCount: number;
  incorrectCount: number;
  correctExerciseIds: string;
  incorrectExerciseIds: string;
  startedAt: Date;
  completedAt: Date;
}

export interface IProgressRepository {
  findUserLessonProgress(
    userId: string,
    lessonId: string,
    tx?: any,
  ): Promise<UserLessonProgress | null>;
  saveUserLessonProgress(
    progress: {
      userId: string;
      lessonId: string;
      isCompleted: boolean;
      accuracy: number;
      isPerfect: boolean;
      completedAt: Date;
    },
    tx?: any,
  ): Promise<void>;
  updateUserLessonProgress(
    id: string,
    progress: { isCompleted: boolean; accuracy: number; isPerfect: boolean; completedAt: Date },
    tx?: any,
  ): Promise<void>;

  findUserQuizAssignment(
    userId: string,
    quizId: string,
    tx?: any,
  ): Promise<UserQuizAssignment | null>;
  saveUserQuizAssignment(
    assignment: {
      userId: string;
      quizId: string;
      isCompleted: boolean;
      score: number;
      completedAt: Date;
    },
    tx?: any,
  ): Promise<void>;
  updateUserQuizAssignment(
    id: string,
    assignment: { isCompleted: boolean; score: number; completedAt: Date },
    tx?: any,
  ): Promise<void>;

  getUserQuizAttemptsCount(userId: string, quizId: string, tx?: any): Promise<number>;
  getOldestQuizAttempts(userId: string, quizId: string, tx?: any): Promise<{ id: string }[]>;
  deleteQuizAttempts(ids: string[], tx?: any): Promise<void>;
  saveQuizAttempt(attempt: QuizAttemptInput, tx?: any): Promise<void>;

  countCompletedLessons(userId: string, tx?: any): Promise<number>;
  getAllAchievements(tx?: any): Promise<Achievement[]>;
  getUserAchievements(userId: string, tx?: any): Promise<string[]>; // Returns unlocked achievement IDs
  saveUserAchievement(userId: string, achievementId: string, tx?: any): Promise<void>;
}
