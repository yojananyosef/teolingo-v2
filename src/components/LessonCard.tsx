import { Check, Play, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    isLocked?: boolean;
  };
  offset?: number;
}

export function LessonCard({ lesson, offset = 0 }: LessonCardProps) {
  const isRight = offset > 10;
  const side = isRight ? "left" : "right";

  const content = (
    <div
      className={cn(
        "relative z-10 w-20 h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transition-all group active:translate-y-1",
        lesson.isLocked
          ? "bg-[#E5E5E5] border-b-8 border-[#AFAFAF] cursor-not-allowed"
          : lesson.isCompleted
            ? "bg-[#58CC02] border-b-8 border-[#46A302] hover:bg-[#61E002]"
            : "bg-[#1CB0F6] border-b-8 border-[#1899D6] hover:bg-[#20C4FF]"
      )}
    >
      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      {lesson.isLocked ? (
        <Lock className="w-8 h-8 lg:w-12 lg:h-12 text-[#AFAFAF]" />
      ) : lesson.isCompleted ? (
        <Check className="w-8 h-8 lg:w-12 lg:h-12 text-white stroke-[4]" />
      ) : (
        <Play className="w-8 h-8 lg:w-12 lg:h-12 text-white fill-current ml-1" />
      )}
    </div>
  );

  return (
    <div className="group relative flex items-center justify-center">
      {lesson.isLocked ? (
        content
      ) : (
        <Link href={`/lesson/${lesson.id}`}>
          {content}
        </Link>
      )}

      <div
        className={cn(
          "absolute w-40 sm:w-64 transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100 z-50 hidden md:block",
          side === "left"
            ? "right-full mr-4 sm:mr-10 text-right"
            : "left-full ml-4 sm:ml-10 text-left"
        )}
      >
        <div className="bg-white px-6 py-4 rounded-2xl border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] group-hover:bg-[#F7F7F7] transition-colors relative">
          {/* Arrow */}
          <div className={cn(
            "absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-[#E5E5E5] rotate-45 group-hover:bg-[#F7F7F7]",
            side === "left" ? "-right-2.5 border-t-0 border-l-0 border-r-2 border-b-2" : "-left-2.5 rotate-[225deg]"
          )} />

          <h3 className="font-black text-[#4B4B4B] text-lg leading-tight uppercase tracking-wide">{lesson.title}</h3>
          <p className="text-sm text-[#777777] font-bold leading-snug mt-1">{lesson.description}</p>
        </div>
      </div>
    </div>
  );
}
