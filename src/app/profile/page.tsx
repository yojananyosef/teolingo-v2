import { GetProfileUseCase } from "@/features/auth/profile-use-cases";
import { GetAchievementsUseCase } from "@/features/auth/use-case";
import { getSession } from "@/infrastructure/lib/auth";
import { redirect } from "next/navigation";
import { ProfileClientContent } from "./ProfileClientContent";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const profileUseCase = new GetProfileUseCase();
  const profileResult = await profileUseCase.execute(session.id);

  if (profileResult.isFailure()) {
    redirect("/auth/login");
  }

  const user = profileResult.value;

  const achievementsUseCase = new GetAchievementsUseCase();
  const achievementsResult = await achievementsUseCase.execute(user.id);

  const achievements = achievementsResult.isSuccess() ? achievementsResult.value : [];

  const plainUser = {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    points: user.points,
    streak: user.streak,
    level: user.level,
  };

  const plainAchievements = achievements.map((a: any) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    icon: a.icon,
    isUnlocked: a.isUnlocked,
  }));

  return <ProfileClientContent user={plainUser} achievements={plainAchievements} />;
}

