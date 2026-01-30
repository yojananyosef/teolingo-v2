import { GetPracticeExercisesUseCase } from "@/features/lessons/use-case";
import { getSession } from "@/infrastructure/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const mode = (searchParams.get("mode") as "quick" | "intense") || "quick";

  const useCase = new GetPracticeExercisesUseCase();
  const result = await useCase.execute(session.userId, mode);

  if (result.isFailure()) {
    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status: 400 },
    );
  }

  const data = result.value;
  return NextResponse.json(data);
}
