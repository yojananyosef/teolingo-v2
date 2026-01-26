import { NextResponse } from "next/server";
import { getSession } from "@/infrastructure/lib/auth";
import { GetVocabularyUseCase } from "@/features/lessons/use-case";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const useCase = new GetVocabularyUseCase();
  const result = await useCase.execute();

  if (result.isFailure()) {
    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status: 400 }
    );
  }

  return NextResponse.json(result.value);
}
