"use client";

import {
  deleteQuizAction,
  toggleQuizStatusAction,
  updateQuizAction,
} from "@/features/teacher/actions";
import { formatTimestamp } from "@/lib/utils";
import { ArrowLeft, Check, Edit3, Save, Slash, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface QuestionData {
  id: string;
  question: string;
  correctAnswer: string;
  type: string;
  lessonTitle: string;
}

interface QuizAttemptData {
  id: string;
  studentId: string;
  studentName: string | null;
  score: number | null;
  isPassed: boolean;
  timeLimitSeconds: number;
  timeSpentSeconds: number;
  timedOut: boolean;
  correctExerciseIds: string[];
  incorrectExerciseIds: string[];
  completedAt: string | Date | null;
}

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

interface QuizDetailsProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    isActive: boolean;
    timeLimitSeconds: number;
    updatedByName: string | null;
    updatedAt: string | Date | null;
    createdAt: string | Date;
    teacherName: string;
  };
  questions: QuestionData[];
  allExercises: QuestionData[];
  attempts: QuizAttemptData[];
}

export function QuizDetails({ quiz, questions, allExercises, attempts }: QuizDetailsProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description || "");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(
    Math.round((quiz.timeLimitSeconds ?? 300) / 60)
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(
    questions.map((question) => question.id),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const questionMap = new Map(questions.map((question) => [question.id, question.question]));

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error(t("teacher.titleRequired"));
      return;
    }

    if (selectedIds.length === 0) {
      toast.error(t("teacher.selectAtLeastOne"));
      return;
    }

    setIsSaving(true);
    const result = await updateQuizAction({
      id: quiz.id,
      title: title.trim(),
      description,
      exerciseIds: selectedIds,
      timeLimitSeconds: timeLimitMinutes * 60,
    });
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error || t("teacher.errorSavingChanges"));
      return;
    }

    toast.success(t("teacher.quizUpdated"));
    router.refresh();
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    const result = await toggleQuizStatusAction({ id: quiz.id, isActive: !quiz.isActive });
    setIsToggling(false);

    if (!result.success) {
      toast.error(result.error || t("teacher.quizStatusError"));
      return;
    }

    toast.success(quiz.isActive ? t("teacher.quizDisabled") : t("teacher.quizActivated"));
    router.refresh();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id],
    );
  };

  const filteredExercises = allExercises.filter(
    (exercise) =>
      exercise.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const createdAtFormatted = formatTimestamp(quiz.createdAt);
  const updatedAtFormatted = quiz.updatedAt ? formatTimestamp(quiz.updatedAt) : "";
  const showModified = updatedAtFormatted && updatedAtFormatted !== createdAtFormatted;

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      t("teacher.confirmDeleteQuiz"),
    );
    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteQuizAction({ id: quiz.id });
    setIsDeleting(false);

    if (!result.success) {
      toast.error(result.error || t("teacher.quizDeleteError"));
      return;
    }

    toast.success(t("teacher.quizDeleted"));
    router.push("/teacher/quizzes");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/teacher/quizzes"
          className="p-3 bg-white rounded-2xl border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] transition-colors"
        >
          <ArrowLeft className="text-[#AFAFAF]" size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">
            {t("teacher.quizDetailsTitle")}
          </h1>
          <p className="text-[#777777] font-bold">{t("teacher.quizDetailsSubtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
                  {t("teacher.quizInfo")}
                </h2>
                <p className="text-[#AFAFAF] text-sm">
                  {t("teacher.createdByDate", { name: quiz.teacherName, date: createdAtFormatted })}
                </p>
                {showModified && quiz.updatedByName && (
                  <p className="text-[#AFAFAF] text-sm">
                    {t("teacher.updatedBy", { name: quiz.updatedByName, date: updatedAtFormatted })}
                  </p>
                )}
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-2 text-sm font-bold text-[#4B4B4B] uppercase">
                <Slash size={16} /> {quiz.isActive ? t("teacher.active") : t("teacher.inactive")}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">
                {t("teacher.quizTitleInput")}
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">
                {t("teacher.quizDescInput")}
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors resize-none"
                rows={4}
              />
            </div>
            <div>
              <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">
                {t("teacher.timeLimitInput")}
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={timeLimitMinutes}
                onChange={(event) => setTimeLimitMinutes(Math.max(1, parseInt(event.target.value) || 1))}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto bg-[#58CC02] hover:bg-[#61E002] text-white font-black uppercase tracking-widest px-6 py-4 rounded-2xl border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? t("teacher.saving") : t("teacher.saveChanges")}
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={isToggling}
                className={`w-full sm:w-auto text-white font-black uppercase tracking-widest px-6 py-4 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all ${quiz.isActive ? "bg-[#FF9600] border-[#D28200] hover:bg-[#FFC46C]" : "bg-[#58CC02] border-[#46A302] hover:bg-[#61E002]"}`}
              >
                {isToggling
                  ? quiz.isActive
                    ? t("teacher.disabling")
                    : t("teacher.enabling")
                  : quiz.isActive
                    ? t("teacher.disableQuiz")
                    : t("teacher.enableQuiz")}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto bg-[#FF4B4B] hover:bg-[#FF6A6A] text-white font-black uppercase tracking-widest px-6 py-4 rounded-2xl border-b-4 border-[#D22D2D] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? t("teacher.deleting") : t("teacher.deleteQuiz")}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight mb-4">
              {t("teacher.quizQuestionsCount", { count: selectedIds.length })}
            </h2>
            <div className="relative mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-2xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
                placeholder={t("teacher.searchQuestionsPlaceholder")}
              />
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredExercises.length === 0 ? (
                <p className="text-center text-[#AFAFAF] font-bold py-8">
                  {t("teacher.noQuestionsFound")}
                </p>
              ) : (
                filteredExercises.map((exercise) => {
                  const isSelected = selectedIds.includes(exercise.id);
                  return (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => toggleSelect(exercise.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-colors flex items-center justify-between gap-4 ${
                        isSelected
                          ? "border-[#1CB0F6] bg-[#DDF4FF]"
                          : "border-[#E5E5E5] bg-white hover:bg-[#F7F7F7]"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-1">
                          {exercise.lessonTitle}
                        </p>
                        <p className="font-bold text-[#4B4B4B]">{exercise.question}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center border-2 shrink-0 ${
                          isSelected
                            ? "bg-[#1CB0F6] border-[#1CB0F6] text-white"
                            : "border-[#E5E5E5] text-transparent"
                        }`}
                      >
                        ✓
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
                  {t("teacher.studentAttempts")}
                </h2>
                <p className="text-[#AFAFAF] text-sm font-bold">
                  {t("teacher.attemptsLimitNote")}
                </p>
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-[#AFAFAF]">
                {t("teacher.totalAttemptsCount", { count: attempts.length })}
              </div>
            </div>

            {attempts.length === 0 ? (
              <p className="text-center text-[#AFAFAF] font-bold py-8">
                {t("teacher.noAttemptsRecorded")}
              </p>
            ) : (
              <div className="space-y-4">
                {attempts.map((attempt) => {
                  const completedAtLabel = formatTimestamp(attempt.completedAt) || t("teacher.noDescription");
                  const correctQuestions = attempt.correctExerciseIds.map(
                    (id) => questionMap.get(id) ?? t("teacher.deletedQuestion"),
                  );
                  const incorrectQuestions = attempt.incorrectExerciseIds.map(
                    (id) => questionMap.get(id) ?? t("teacher.deletedQuestion"),
                  );

                  return (
                    <details
                      key={attempt.id}
                      className="rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F7F7] p-4"
                    >
                      <summary className="cursor-pointer list-none">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-black text-[#4B4B4B]">
                              {attempt.studentName || t("teacher.anonymousStudent")}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#AFAFAF]">
                              {completedAtLabel}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                attempt.isPassed
                                  ? "bg-[#DDF4FF] text-[#1CB0F6]"
                                  : "bg-[#FFF0F0] text-[#D22D2D]"
                              }`}
                            >
                              {attempt.isPassed ? t("quizzes.passed") : t("quizzes.failed")}
                            </span>
                            {attempt.timedOut && (
                              <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#FFF0F0] text-[#D22D2D]">
                                {t("lesson.timesUp")}
                              </span>
                            )}
                            <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-[#777777] border border-[#E5E5E5]">
                              {t("teacher.viewDetailsDetails")}
                            </span>
                          </div>
                        </div>
                      </summary>

                      <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="bg-white rounded-xl border-2 border-[#E5E5E5] px-3 py-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF]">
                              {t("lesson.accuracy")}
                            </p>
                            <p className="font-black text-[#4B4B4B]">{attempt.score ?? 0}%</p>
                          </div>
                          <div className="bg-white rounded-xl border-2 border-[#E5E5E5] px-3 py-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF]">
                              {t("lesson.time")}
                            </p>
                            <p className="font-black text-[#4B4B4B]">
                              {formatDuration(attempt.timeSpentSeconds)}
                            </p>
                          </div>
                          <div className="bg-white rounded-xl border-2 border-[#E5E5E5] px-3 py-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF]">
                              {t("teacher.correctCount")}
                            </p>
                            <p className="font-black text-[#4B4B4B]">{correctQuestions.length}</p>
                          </div>
                          <div className="bg-white rounded-xl border-2 border-[#E5E5E5] px-3 py-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF]">
                              {t("teacher.incorrectCount")}
                            </p>
                            <p className="font-black text-[#4B4B4B]">{incorrectQuestions.length}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF] mb-2">
                              {t("teacher.hits")}
                            </p>
                            {correctQuestions.length === 0 ? (
                              <p className="text-sm font-bold text-[#AFAFAF]">{t("teacher.noHits")}</p>
                            ) : (
                              <ul className="space-y-1 text-sm font-bold text-[#4B4B4B]">
                                {correctQuestions.map((question, index) => (
                                  <li key={`correct-${attempt.id}-${index}`}>{question}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#AFAFAF] mb-2">
                              {t("teacher.errors")}
                            </p>
                            {incorrectQuestions.length === 0 ? (
                              <p className="text-sm font-bold text-[#AFAFAF]">{t("teacher.noErrors")}</p>
                            ) : (
                              <ul className="space-y-1 text-sm font-bold text-[#4B4B4B]">
                                {incorrectQuestions.map((question, index) => (
                                  <li key={`incorrect-${attempt.id}-${index}`}>{question}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight mb-4">
              {t("teacher.summary")}
            </h2>
            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5]">
              <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-2">
                {t("teacher.selectedQuestions")}
              </p>
              <p className="font-bold text-[#4B4B4B]">{selectedIds.length}</p>
            </div>
            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5] mt-4">
              <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-2">
                {t("teacher.quizId")}
              </p>
              <p className="font-bold text-[#4B4B4B] break-words">{quiz.id}</p>
            </div>
            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5] mt-4">
              <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-2">
                {t("teacher.created")}
              </p>
              <p className="font-bold text-[#4B4B4B]">{createdAtFormatted || updatedAtFormatted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
