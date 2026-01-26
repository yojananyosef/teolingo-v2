import { NextResponse } from "next/server";
import { getSession } from "@/infrastructure/lib/auth";
import { GetLessonWithExercisesUseCase } from "@/features/lessons/use-case";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const useCase = new GetLessonWithExercisesUseCase();
  const result = await useCase.execute(id);

  if (result.isFailure()) {
    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status: result.error.code === "LESSON_NOT_FOUND" ? 404 : 400 }
    );
  }

  const data = result.value;
  return NextResponse.json(data);
}
