// Why: Domain Service for evaluating and unlocking achievements.
// Decouples gamification logic from core lesson completion workflow (SRP).

import type { Achievement, IProgressRepository } from "../repositories";

export class AchievementService {
  constructor(private readonly progressRepository: IProgressRepository) {}

  /**
   * Evaluates the user's progress against the achievements catalog.
   * Saves newly unlocked achievements and returns them.
   */
  public async evaluateAchievements(
    userId: string,
    newPoints: number,
    newStreak: number,
    isPassed: boolean,
    tx?: any,
  ): Promise<Achievement[]> {
    if (!isPassed) return [];

    // 1. Fetch catalog and already unlocked achievements
    const allAchievements = await this.progressRepository.getAllAchievements(tx);
    const unlockedIds = new Set(await this.progressRepository.getUserAchievements(userId, tx));

    // 2. Count non-optional lessons completed
    const totalCompleted = await this.progressRepository.countCompletedLessons(userId, tx);

    const newlyUnlocked: Achievement[] = [];

    // 3. Process requirements
    for (const ach of allAchievements) {
      if (unlockedIds.has(ach.id)) continue;

      let met = false;
      if (ach.requirementType === "points" && newPoints >= ach.requirementValue) met = true;
      if (ach.requirementType === "streak" && newStreak >= ach.requirementValue) met = true;
      if (ach.requirementType === "lessons" && totalCompleted >= ach.requirementValue) met = true;

      if (met) {
        await this.progressRepository.saveUserAchievement(userId, ach.id, tx);
        newlyUnlocked.push(ach);
      }
    }

    return newlyUnlocked;
  }
}
