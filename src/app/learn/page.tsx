import { getSession } from "@/infrastructure/lib/auth";
import { GetLessonsUseCase } from "@/features/lessons/use-case";
import { Flame, Star, Trophy, BookOpen } from "lucide-react";
import { LessonCard as LessonCardComponent } from "@/components/LessonCard";

export default async function LearnPage() {
  const session = await getSession();
  const userId = session?.userId;

  const useCase = new GetLessonsUseCase();
  const result = await useCase.execute(userId);

  if (result.isFailure()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold text-red-600">Error al cargar las lecciones</h1>
        <p className="text-gray-500">{result.error.message}</p>
      </div>
    );
  }

  const lessons = result.value;

  // For the header, we'd normally get user info from the DB
  // For now we'll use session data if available
  const user = session ? {
    displayName: session.displayName,
    streak: session.streak || 0,
    points: session.points || 0,
    level: session.level || 1
  } : null;

  const unit1 = lessons.filter((l: any) => l.order <= 8);
  const unit2 = lessons.filter((l: any) => l.order > 8);

  return (
    <div className="flex flex-col min-h-full">
      <header className="flex items-center justify-between bg-white p-4 lg:p-6 sticky top-0 z-20 border-b-2 border-[#E5E5E5] px-4 lg:px-8 shrink-0">
        <div>
          <h1 className="text-base lg:text-2xl font-black text-[#4B4B4B] tracking-wide uppercase">Mi Progreso</h1>
        </div>
        <div className="flex items-center gap-3 lg:gap-8">
          <div className="flex items-center gap-1 lg:gap-2 group cursor-help">
            <Flame size={18} className="text-[#FF9600] fill-[#FF9600] lg:w-6 lg:h-6" />
            <span className="font-black text-[#FF9600] text-sm lg:text-xl">{user?.streak || 0}</span>
          </div>
          <div className="flex items-center gap-1 lg:gap-2 group cursor-help">
            <Star size={18} className="text-[#1CB0F6] fill-[#1CB0F6] lg:w-6 lg:h-6" />
            <span className="font-black text-[#1CB0F6] text-sm lg:text-xl">{user?.points || 0}</span>
          </div>
          <div className="flex items-center gap-1 lg:gap-2 group cursor-help">
            <Trophy size={18} className="text-[#FFC800] fill-[#FFC800] lg:w-6 lg:h-6" />
            <span className="font-black text-[#FFC800] text-sm lg:text-xl">{user?.level || 1}</span>
          </div>
        </div>
      </header>

      <div className="px-4 lg:px-8 py-4 lg:py-8 flex-1">
        <div className="max-w-2xl mx-auto space-y-12 lg:space-y-24 pb-12 lg:pb-24">
          {/* UNIDAD 1 */}
          <div className="space-y-6 lg:space-y-12">
            <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-8 bg-[#58CC02] text-white p-4 lg:p-6 rounded-2xl shadow-[0_4px_0_0_#46A302]">
              <div className="p-1.5 lg:p-3 bg-white/20 rounded-xl">
                <BookOpen size={20} className="text-white lg:w-7 lg:h-7" />
              </div>
              <div>
                <h2 className="text-[10px] lg:text-xl font-black uppercase tracking-widest opacity-80">Unidad 1</h2>
                <p className="text-sm lg:text-2xl font-black">Fundamentos y Alef-Bet</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 lg:gap-12 relative pt-4 lg:pt-8">
              <div className="absolute top-0 bottom-0 w-1.5 lg:w-2 bg-[#E5E5E5] -z-10 rounded-full" />
              {unit1.map((lesson: any, index: number) => {
                const offset = Math.sin(index * 1.5);

                const isPreviousCompleted = index === 0 || unit1[index - 1].isCompleted;
                const isLocked = !isPreviousCompleted;

                return (
                  <div
                    key={lesson.id}
                    style={{
                      transform: `translateX(calc(${offset} * clamp(20px, 8vw, 70px)))`
                    }}
                    className="relative transition-transform duration-300"
                  >
                    <LessonCardComponent
                      lesson={{
                        ...lesson,
                        isCompleted: !!lesson.isCompleted,
                        isLocked
                      }}
                      offset={offset * 60}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* UNIDAD 2 */}
          {unit2.length > 0 && (
            <div className="space-y-6 lg:space-y-12">
              <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-8 bg-[#1CB0F6] text-white p-4 lg:p-6 rounded-2xl shadow-[0_4px_0_0_#1899D6]">
                <div className="p-1.5 lg:p-3 bg-white/20 rounded-xl">
                  <BookOpen size={20} className="text-white lg:w-7 lg:h-7" />
                </div>
                <div>
                  <h2 className="text-[10px] lg:text-xl font-black uppercase tracking-widest opacity-80">Unidad 2</h2>
                  <p className="text-sm lg:text-2xl font-black">Vocabulario y Gramática</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 lg:gap-12 relative pt-4 lg:pt-8">
                <div className="absolute top-0 bottom-0 w-1.5 lg:w-2 bg-[#E5E5E5] -z-10 rounded-full" />
                {unit2.map((lesson: any, index: number) => {
                  const offset = Math.sin((index + unit1.length) * 1.5);
                  const isPreviousCompleted = index === 0
                    ? unit1[unit1.length - 1]?.isCompleted
                    : unit2[index - 1].isCompleted;
                  const isLocked = !isPreviousCompleted;

                  return (
                    <div
                      key={lesson.id}
                      style={{
                        transform: `translateX(calc(${offset} * clamp(20px, 8vw, 70px)))`
                      }}
                      className="relative transition-transform duration-300"
                    >
                      <LessonCardComponent
                        lesson={{
                          ...lesson,
                          isCompleted: !!lesson.isCompleted,
                          isLocked
                        }}
                        offset={offset * 60}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
