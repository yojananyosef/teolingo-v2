import { getSession } from "@/infrastructure/lib/auth";
import { GetAchievementsUseCase } from "@/features/auth/use-case";
import { GetProfileUseCase } from "@/features/auth/profile-use-cases";
import { Trophy, Flame, Target, Medal, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }

  const profileUseCase = new GetProfileUseCase();
  const profileResult = await profileUseCase.execute(session.userId);

  if (profileResult.isFailure()) {
    redirect("/auth/login");
  }

  const user = profileResult.value;

  const achievementsUseCase = new GetAchievementsUseCase();
  const achievementsResult = await achievementsUseCase.execute(user.id);

  const achievements = achievementsResult.isSuccess() ? achievementsResult.value : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header */}
      <div className="bg-white p-10 rounded-3xl border-2 border-[#E5E5E5] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="flex items-center gap-8 z-10">
          <div className="w-32 h-32 bg-[#DDF4FF] rounded-full flex items-center justify-center text-5xl font-black text-[#1CB0F6] border-4 border-white shadow-sm">
            {user.displayName[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-black text-[#4B4B4B]">{user.displayName}</h1>
            <p className="text-xl font-bold text-[#777777] mt-1">{user.email}</p>
          </div>
        </div>
        
        <form action="/api/auth/logout" method="POST" className="z-10">
          <button 
            type="submit"
            className="flex items-center gap-2 text-[#FF4B4B] font-black uppercase tracking-wide hover:bg-[#FFF5F5] px-6 py-3 rounded-2xl transition-colors border-2 border-transparent hover:border-[#FF4B4B]"
          >
            <X size={20} />
            Cerrar Sesión
          </button>
        </form>

        {/* Decorative circle */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F7F7F7] rounded-full -z-0" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border-2 border-[#E5E5E5] flex flex-col items-center text-center group hover:border-[#FFC800] transition-colors">
          <div className="p-4 mb-4">
            <Trophy size={48} className="text-[#FFC800] fill-[#FFC800]" />
          </div>
          <div className="text-4xl font-black text-[#4B4B4B]">{user.points}</div>
          <div className="text-sm font-black text-[#AFAFAF] uppercase tracking-widest mt-2">Puntos Totales</div>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-[#E5E5E5] flex flex-col items-center text-center group hover:border-[#FF9600] transition-colors">
          <div className="p-4 mb-4">
            <Flame size={48} className="text-[#FF9600] fill-[#FF9600]" />
          </div>
          <div className="text-4xl font-black text-[#4B4B4B]">{user.streak}</div>
          <div className="text-sm font-black text-[#AFAFAF] uppercase tracking-widest mt-2">Racha de Días</div>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-[#E5E5E5] flex flex-col items-center text-center group hover:border-[#1CB0F6] transition-colors">
          <div className="p-4 mb-4">
            <Target size={48} className="text-[#1CB0F6] fill-[#1CB0F6]" />
          </div>
          <div className="text-4xl font-black text-[#4B4B4B]">{user.level}</div>
          <div className="text-sm font-black text-[#AFAFAF] uppercase tracking-widest mt-2">Nivel Actual</div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white p-10 rounded-3xl border-2 border-[#E5E5E5]">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Mis Logros</h2>
          <div className="text-base font-black text-[#1CB0F6] bg-[#DDF4FF] px-6 py-2 rounded-full uppercase tracking-widest">
            {achievements.filter(a => a.isUnlocked).length} de {achievements.length}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "flex flex-col items-center p-6 rounded-3xl border-2 transition-all relative group",
                achievement.isUnlocked
                  ? "bg-white border-[#E5E5E5] hover:border-[#1CB0F6]"
                  : "bg-[#F7F7F7] border-[#E5E5E5] opacity-50 grayscale"
              )}
            >
              {achievement.isUnlocked && (
                <div className="absolute -top-2 -right-2 bg-[#58CC02] text-white p-1.5 rounded-full border-4 border-white shadow-sm z-10">
                  <CheckCircle2 size={16} />
                </div>
              )}
              
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 transition-transform group-hover:scale-110",
                achievement.isUnlocked ? "" : ""
              )}>
                {achievement.icon}
              </div>
              
              <h3 className={cn("font-black text-center text-base uppercase tracking-wide leading-tight", 
                achievement.isUnlocked ? "text-[#4B4B4B]" : "text-[#AFAFAF]")}>
                {achievement.name}
              </h3>
              
              <p className="text-xs text-[#777777] font-bold text-center leading-snug mt-2">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
