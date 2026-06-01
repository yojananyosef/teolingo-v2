"use client";

import { createQuizAction } from "@/features/teacher/actions";
import { ArrowLeft, Check, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ExerciseData {
  id: string;
  question: string;
  correctAnswer: string;
  type: string;
  lessonTitle: string;
}

export function QuizBuilder({ initialExercises }: { initialExercises: ExerciseData[] }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(5);
  const [allowedAttempts, setAllowedAttempts] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredExercises = initialExercises.filter(
    (ex) =>
      ex.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedExercises = initialExercises.filter((ex) => selectedIds.includes(ex.id));

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((exId) => exId !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error(t("teacher.titleRequired"));
    if (selectedIds.length === 0) return toast.error(t("teacher.selectAtLeastOne"));

    setIsSubmitting(true);
    try {
      const res = await createQuizAction({
        title,
        description,
        exerciseIds: selectedIds,
        timeLimitSeconds: timeLimitMinutes * 60,
        allowedAttempts,
      });
      if (res.success) {
        toast.success(t("teacher.successCreated"));
        router.push("/teacher/quizzes");
      } else {
        toast.error(res.error || t("teacher.errorCreatingQuiz"));
      }
    } catch (e) {
      toast.error(t("teacher.errorConnectingServer"));
    } finally {
      setIsSubmitting(false);
    }
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
            {t("teacher.titleCreate")}
          </h1>
          <p className="text-[#777777] font-bold">{t("teacher.createQuizSubtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 space-y-4">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("teacher.generalDetails")}
            </h2>
            <div>
              <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">
                {t("teacher.quizTitleInput")}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
                placeholder={t("teacher.quizTitlePlaceholder")}
              />
            </div>
            <div>
              <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">
                {t("teacher.quizDescOptional")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder={t("teacher.quizDescPlaceholderBuilder")}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">
                  {t("teacher.timeLimitInput")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">
                  {t("teacher.allowedAttemptsInput") || "Intentos Permitidos"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 5, 10].map((num) => {
                    const isSelected = allowedAttempts === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setAllowedAttempts(num)}
                        className={`flex-1 min-w-[70px] py-3 px-2 text-sm font-black rounded-2xl border-2 border-b-4 transition-all uppercase tracking-wide cursor-pointer text-center ${
                          isSelected
                            ? "bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6] border-b-[#1899D6] translate-y-0.5"
                            : "bg-white border-[#E5E5E5] text-[#777777] border-b-[#D4D4D4] hover:bg-[#F7F7F7] active:translate-y-0.5 active:border-b-2"
                        }`}
                      >
                        {num}
                        {num === 3 && (
                          <span className="block text-[9px] font-bold text-[#AFAFAF] normal-case mt-0.5">
                            ({t("teacher.defaultAttemptsLabel") || "por defecto"})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 space-y-4">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
              {t("teacher.questionsBank")}
            </h2>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AFAFAF]"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl pl-12 pr-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
                placeholder={t("teacher.searchQuestionPlaceholder")}
              />
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredExercises.length === 0 ? (
                <p className="text-center text-[#AFAFAF] font-bold py-8">
                  {t("teacher.noQuestionsFound")}
                </p>
              ) : (
                filteredExercises.map((ex) => {
                  const isSelected = selectedIds.includes(ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => toggleSelect(ex.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-colors flex items-center justify-between gap-4 ${
                        isSelected
                          ? "border-[#1CB0F6] bg-[#DDF4FF]"
                          : "border-[#E5E5E5] bg-white hover:bg-[#F7F7F7]"
                      }`}
                    >
                      <div className="flex-1">
                        <span className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-1">
                          {ex.lessonTitle}
                        </span>
                        <p className="font-bold text-[#4B4B4B]">{ex.question}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center border-2 shrink-0 ${
                          isSelected ? "bg-[#1CB0F6] border-[#1CB0F6]" : "border-[#E5E5E5]"
                        }`}
                      >
                        {isSelected && <Check className="text-white" size={14} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 sticky top-8">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight mb-4">
              {t("teacher.summary")}
            </h2>

            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5] mb-6">
              <span className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-1">
                {t("teacher.selectedQuestions")}
              </span>
              <p className="text-3xl font-black text-[#1CB0F6]">{selectedIds.length}</p>
            </div>

            <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
              {selectedExercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className="flex justify-between items-center gap-2 bg-[#F7F7F7] p-2 rounded-lg border border-[#E5E5E5]"
                >
                  <span className="text-sm font-bold text-[#777] line-clamp-1 flex-1">
                    {i + 1}. {ex.question}
                  </span>
                  <button
                    onClick={() => toggleSelect(ex.id)}
                    className="p-1 hover:bg-[#FFEBEB] rounded-md text-[#FF4B4B] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={isSubmitting || selectedIds.length === 0}
              className={`w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                isSubmitting || selectedIds.length === 0
                  ? "bg-[#E5E5E5] border-[#AFAFAF] cursor-not-allowed"
                  : "bg-[#58CC02] border-[#46A302] hover:bg-[#61E002]"
              }`}
            >
              {isSubmitting ? t("teacher.saving") : t("teacher.saveBtn")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
