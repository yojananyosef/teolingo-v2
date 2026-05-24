"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn, formatTimestamp } from "@/lib/utils";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import Link from "next/link";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  updatedByName: string | null;
  updatedAt: string | null; // serialized Date
  createdAt: string | null; // serialized Date
  teacherName: string;
}

interface TeacherQuizzesClientContentProps {
  quizzesList: Quiz[];
}

export default function TeacherQuizzesClientContent({
  quizzesList,
}: TeacherQuizzesClientContentProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/teacher"
          className="p-3 bg-white rounded-2xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] transition-colors"
        >
          <ArrowLeft className="text-[#AFAFAF]" size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
            {t("teacher.titleQuizzes")}
          </h1>
          <p className="text-[#777777] font-bold">{t("teacher.subtitleQuizzes")}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/teacher/quizzes/create"
          className="bg-[#1CB0F6] px-6 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> {t("teacher.createQuiz")}
        </Link>
      </div>

      <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] overflow-hidden shadow-sm">
        <div className="p-6 border-b-2 border-[#E5E5E5]">
          <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
            {t("teacher.listQuizzes")}
          </h2>
        </div>
        <div className="p-6">
          {quizzesList.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-[#E5E5E5] mx-auto mb-4" />
              <p className="text-[#AFAFAF] font-bold text-lg">{t("teacher.emptyQuizzes")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzesList.map((quiz) => {
                const formattedCreated = quiz.createdAt ? formatTimestamp(new Date(quiz.createdAt)) : "";
                const formattedUpdated = quiz.updatedAt ? formatTimestamp(new Date(quiz.updatedAt)) : "";
                const formattedCreatedRaw = quiz.createdAt ? formatTimestamp(new Date(quiz.createdAt)) : "";

                return (
                  <div
                    key={quiz.id}
                    className="p-6 rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F7F7] flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-black text-[#4B4B4B] mb-2">{quiz.title}</h3>
                      <p className="text-[#777777] font-bold mb-4 line-clamp-2">
                        {quiz.description || t("teacher.noDescription")}
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-col gap-2 text-xs font-bold text-[#AFAFAF]">
                        <span>Creado: {formattedCreated}</span>
                        <div className="space-y-1">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center",
                              quiz.isActive
                                ? "bg-[#DDF4FF] text-[#1CB0F6]"
                                : "bg-[#FFF0F0] text-[#D22D2D]",
                            )}
                          >
                            {quiz.isActive ? t("teacher.active") : t("teacher.inactive")}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF] block">
                            {t("teacher.createdBy", { name: quiz.teacherName })}
                          </span>
                          {quiz.updatedByName &&
                            quiz.updatedAt &&
                            formattedUpdated !== formattedCreatedRaw && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF] block">
                                {t("teacher.updatedBy", { name: quiz.updatedByName, date: formattedUpdated })}
                              </span>
                            )}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t-2 border-[#E5E5E5]">
                        <Link
                          href={`/teacher/quizzes/${quiz.id}`}
                          className="block w-full text-center bg-white px-4 py-2 rounded-xl text-[#1CB0F6] font-black uppercase tracking-widest text-xs border-2 border-[#E5E5E5] hover:bg-[#FDFBF7]"
                        >
                          {t("teacher.viewDetails")}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
