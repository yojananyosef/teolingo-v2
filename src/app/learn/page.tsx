import { getSession } from "@/infrastructure/lib/auth";
import { GetLessonsUseCase } from "@/features/lessons/use-case";
import { LearnClientContent } from "./LearnClientContent";

export default async function LearnPage() {
  const session = await getSession();
  const userId = session?.userId;

  const useCase = new GetLessonsUseCase();
  const result = await useCase.execute(userId);

  if (result.isFailure()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-red-600">Error al cargar las lecciones</h1>
        <p className="text-gray-500">{result.error.message}</p>
      </div>
    );
  }

  const lessons = result.value;

  const user = session ? {
    displayName: session.displayName,
    streak: session.streak || 0,
    points: session.points || 0,
    level: session.level || 1
  } : null;

  return <LearnClientContent lessons={lessons} user={user} />;
}
