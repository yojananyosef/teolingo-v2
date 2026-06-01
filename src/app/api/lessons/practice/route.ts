import { GetPracticeExercisesUseCase } from "@/features/lessons/use-cases";
import { getSession } from "@/infrastructure/lib/auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const mode =
    (searchParams.get("mode") as
      | "quick"
      | "intense"
      | "freq"
      | "nouns"
      | "adjectives"
      | "verbs"
      | "imperfect"
      | "verb-suffixes"
      | "prefixes"
      | "pronouns"
      | "suffixes"
      | "participle"
      | "participle-v2"
      | "infinitives"
      | "imperatives") || "quick";
  const range = searchParams.get("range") || undefined;
  const randomOrder = searchParams.get("random") === "1";
  const course = searchParams.get("course") || "hebrew";

  const useCase = new GetPracticeExercisesUseCase();
  const result = await useCase.execute(session.id, mode, range, randomOrder, course);

  if (result.isFailure()) {
    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status: 400 },
    );
  }

  const data = result.value;
  return NextResponse.json(data);
}
