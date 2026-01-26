import { GetLeaderboardUseCase } from "@/features/leaderboard/use-case";
import { Trophy, Medal, Star, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function LeaderboardPage() {
  const useCase = new GetLeaderboardUseCase();
  const result = await useCase.execute();

  if (result.isFailure()) {
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <h1 className="text-2xl font-black text-[#FF4B4B] uppercase">
          Error al cargar
        </h1>
        <p className="text-[#777777] font-bold mt-2">{result.error.message}</p>
      </div>
    );
  }

  const topUsers = result.value;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center mb-12">
        <div className="bg-[#FFC800] p-6 rounded-3xl shadow-[0_4px_0_0_#C79B00] mb-6">
          <Trophy className="w-16 h-16 text-white fill-white" />
        </div>
        <h1 className="text-4xl font-black text-[#4B4B4B] uppercase tracking-tight text-center">
          Tabla de Clasificación
        </h1>
        <p className="text-[#777777] font-black uppercase text-sm tracking-[0.2em] mt-4">
          Los mejores estudiantes de Teolingo
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden">
        <div className="divide-y-2 divide-[#E5E5E5]">
          {topUsers.map((user: any, index: number) => (
            <div
              key={user.id}
              className={cn(
                "flex items-center gap-6 p-6 transition-colors hover:bg-[#F7F7F7]",
                index === 0 && "bg-[#FFF9E5]/50",
                index === 1 && "bg-[#F7F7F7]/50",
                index === 2 && "bg-[#FFF5EB]/50",
              )}
            >
              <div
                className={cn(
                  "w-10 text-center font-black text-xl",
                  index === 0
                    ? "text-[#FFC800]"
                    : index === 1
                      ? "text-[#AFAFAF]"
                      : index === 2
                        ? "text-[#CD7F32]"
                        : "text-[#AFAFAF]",
                )}
              >
                {index + 1}
              </div>

              <div className="relative">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl uppercase border-b-4",
                    index === 0
                      ? "bg-[#FFC800] border-[#C79B00]"
                      : index === 1
                        ? "bg-[#AFAFAF] border-[#8A8A8A]"
                        : index === 2
                          ? "bg-[#CD7F32] border-[#A05A2C]"
                          : "bg-[#1CB0F6] border-[#1899D6]",
                  )}
                >
                  {user.displayName[0]}
                </div>
                {index < 3 && (
                  <div
                    className={cn(
                      "absolute -top-2 -right-2 rounded-full p-2 border-4 border-white shadow-sm",
                      index === 0
                        ? "bg-[#FFC800]"
                        : index === 1
                          ? "bg-[#AFAFAF]"
                          : "bg-[#CD7F32]",
                    )}
                  >
                    <Medal className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="font-black text-xl text-[#4B4B4B]">
                  {user.displayName}
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1.5 text-sm font-black uppercase tracking-wider text-[#1CB0F6]">
                    <Star className="w-4 h-4 fill-[#1CB0F6]" />
                    Nivel {user.level}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-black uppercase tracking-wider text-[#FF9600]">
                    <Flame className="w-4 h-4 fill-[#FF9600]" />
                    {user.streak}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-[#4B4B4B] text-2xl">
                  {user.points}
                </div>
                <div className="text-xs font-black text-[#AFAFAF] uppercase tracking-widest mt-1">
                  XP
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 p-8 bg-[#F7F7F7] rounded-3xl border-2 border-[#E5E5E5] text-center">
        <p className="text-[#777777] font-bold text-lg leading-relaxed">
          ¡Sigue practicando para subir en la tabla y demostrar tu conocimiento
          de los idiomas bíblicos!
        </p>
      </div>
    </div>
  );
}
