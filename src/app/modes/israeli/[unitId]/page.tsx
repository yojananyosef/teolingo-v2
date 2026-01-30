import { IsraeliModeClient } from "@/app/modes/israeli/[unitId]/IsraeliModeClient";
import { getIsraeliUnitAction } from "@/features/israeli-mode/actions";
import { getSession } from "@/infrastructure/lib/auth";
import { redirect } from "next/navigation";

export default async function IsraeliModePage({ params }: { params: { unitId: string } }) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const { unitId } = await params;
  const result = await getIsraeliUnitAction(unitId);

  if (!result.success || !result.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Error al cargar el Modo Israelí</h1>
        <p className="text-gray-500">{result.error || "Unidad no encontrada"}</p>
      </div>
    );
  }

  return <IsraeliModeClient unit={result.data} />;
}
