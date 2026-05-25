import { GetVocabularyUseCase } from "@/features/lessons/use-cases";
import { getSession } from "@/infrastructure/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const course = searchParams.get("course") || "hebrew";

  const useCase = new GetVocabularyUseCase();
  const result = await useCase.execute(session.id, course);

  if (result.isFailure()) {
    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status: 400 },
    );
  }

  return NextResponse.json(result.value);
}
