// Why: Domain Service for managing user activity streaks.
// Part of the Domain Layer (DDD).

import type { User } from "../entities/user.entity";

export class StreakService {
  /**
   * Evaluates and updates the user's activity streak based on today's date and performance.
   */
  public processActivityStreak(user: User, isPassed: boolean, today = new Date()): void {
    user.updateStreak(today, isPassed);
  }
}
