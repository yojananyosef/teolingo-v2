import { db } from "../../infrastructure/database/db";
import { users } from "../../infrastructure/database/schema";
import { desc } from "drizzle-orm";
import { Result, DomainError } from "../../domain/shared/result";

// Why: Application layer logic for fetching leaderboard data.
export class GetLeaderboardUseCase {
  async execute(): Promise<Result<any[]>> {
    try {
      const results = await db
        .select({
          id: users.id,
          displayName: users.displayName,
          points: users.points,
          level: users.level,
          streak: users.streak,
        })
        .from(users)
        .orderBy(desc(users.points))
        .limit(10);
      
      return Result.ok(results);
    } catch (error) {
      return Result.fail(new DomainError(error instanceof Error ? error.message : "Error desconocido", "INTERNAL_ERROR"));
    }
  }
}
