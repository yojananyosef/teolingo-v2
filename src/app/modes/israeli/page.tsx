import { listIsraeliUnitsAction } from "@/features/israeli-mode/actions";
import { IsraeliUnitsList } from "./IsraeliUnitsList";
import { redirect } from "next/navigation";
import { getSession } from "@/infrastructure/lib/auth";

export default async function IsraeliRoadmapPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const result = await listIsraeliUnitsAction();

  if (!result.success || !result.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Error al cargar el Roadmap</h1>
        <p className="text-gray-500">{result.error || "No se encontraron unidades"}</p>
      </div>
    );
  }

  return <IsraeliUnitsList units={result.data} />;
}
