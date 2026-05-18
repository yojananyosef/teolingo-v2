"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Edit3, Save, Trash2, Slash } from "lucide-react";
import { toast } from "sonner";
import { deleteQuizAction, toggleQuizStatusAction, updateQuizAction } from "@/features/teacher/actions";
import { formatTimestamp } from "@/lib/utils";

interface QuestionData {
  id: string;
  question: string;
  correctAnswer: string;
  type: string;
  lessonTitle: string;
}

interface QuizDetailsProps {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    isActive: boolean;
    createdAt: string | Date;
    teacherName: string;
  };
  questions: QuestionData[];
  allExercises: QuestionData[];
}

export function QuizDetails({ quiz, questions, allExercises }: QuizDetailsProps) {
  const router = useRouter();
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description || "");
  const [selectedIds, setSelectedIds] = useState<string[]>(questions.map((question) => question.id));
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    if (selectedIds.length === 0) {
      toast.error("Selecciona al menos una pregunta");
      return;
    }

    setIsSaving(true);
    const result = await updateQuizAction({
      id: quiz.id,
      title: title.trim(),
      description,
      exerciseIds: selectedIds,
    });
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error || "Error al guardar los cambios");
      return;
    }

    toast.success("Quiz actualizado");
    router.refresh();
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    const result = await toggleQuizStatusAction({ id: quiz.id, isActive: !quiz.isActive });
    setIsToggling(false);

    if (!result.success) {
      toast.error(result.error || "Error al actualizar el estado del quiz");
      return;
    }

    toast.success(quiz.isActive ? "Quiz desactivado" : "Quiz activado");
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

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este quiz? Esta acción no se puede deshacer.");
    if (!confirmDelete) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteQuizAction({ id: quiz.id });
    setIsDeleting(false);

    if (!result.success) {
      toast.error(result.error || "Error al eliminar el quiz");
      return;
    }

    toast.success("Quiz eliminado");
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
          <h1 className="text-3xl font-black text-[#4B4B4B] uppercase tracking-tight">Detalle del Quiz</h1>
          <p className="text-[#777777] font-bold">Edita o elimina tu quiz cuando lo necesites.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight">Información del Quiz</h2>
                <p className="text-[#AFAFAF] text-sm">Creado por {quiz.teacherName} el {formatTimestamp(quiz.createdAt)}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-2 text-sm font-bold text-[#4B4B4B] uppercase">
                <Slash size={16} /> {quiz.isActive ? "Activo" : "Desactivado"}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">Título del Quiz</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest block mb-2">Descripción</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors resize-none"
                rows={4}
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto bg-[#58CC02] hover:bg-[#61E002] text-white font-black uppercase tracking-widest px-6 py-4 rounded-2xl border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                onClick={handleToggleStatus}
                disabled={isToggling}
                className={`w-full sm:w-auto text-white font-black uppercase tracking-widest px-6 py-4 rounded-2xl border-b-4 active:border-b-0 active:translate-y-1 transition-all ${quiz.isActive ? "bg-[#FF9600] border-[#D28200] hover:bg-[#FFC46C]" : "bg-[#58CC02] border-[#46A302] hover:bg-[#61E002]"}`}
              >
                {isToggling ? (quiz.isActive ? "Desactivando..." : "Activando...") : quiz.isActive ? "Desactivar quiz" : "Activar quiz"}
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto bg-[#FF4B4B] hover:bg-[#FF6A6A] text-white font-black uppercase tracking-widest px-6 py-4 rounded-2xl border-b-4 border-[#D22D2D] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Eliminando..." : "Eliminar quiz"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight mb-4">Preguntas del Quiz ({selectedIds.length})</h2>
            <div className="relative mb-6">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-2xl px-4 py-3 font-bold text-[#4B4B4B] focus:border-[#1CB0F6] focus:outline-none transition-colors"
                placeholder="Buscar preguntas por contenido o módulo..."
              />
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredExercises.length === 0 ? (
                <p className="text-center text-[#AFAFAF] font-bold py-8">No se encontraron preguntas.</p>
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
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 shrink-0 ${
                        isSelected ? "bg-[#1CB0F6] border-[#1CB0F6] text-white" : "border-[#E5E5E5] text-transparent"
                      }`}>
                        ✓
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight mb-4">Resumen</h2>
            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5]">
              <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-2">Preguntas seleccionadas</p>
              <p className="font-bold text-[#4B4B4B]">{selectedIds.length}</p>
            </div>
            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5] mt-4">
              <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-2">ID del Quiz</p>
              <p className="font-bold text-[#4B4B4B] break-words">{quiz.id}</p>
            </div>
            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5] mt-4">
              <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-2">Creado</p>
              <p className="font-bold text-[#4B4B4B]">{formatTimestamp(quiz.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
