import { NextResponse } from "next/server";
import { getSession } from "@/infrastructure/lib/auth";
import { GetPracticeExercisesUseCase } from "@/features/lessons/use-case";

export async function GET() {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const useCase = new GetPracticeExercisesUseCase();
  const result = await useCase.execute(session.userId);

  if (result.isFailure()) {
    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status: 400 }
    );
  }

  const data = result.value;
  return NextResponse.json(data);
}
