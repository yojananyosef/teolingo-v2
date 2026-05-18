"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Edit3, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteQuizAction, updateQuizAction } from "@/features/teacher/actions";

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
    createdAt: string;
    teacherName: string;
  };
  questions: QuestionData[];
}

export function QuizDetails({ quiz, questions }: QuizDetailsProps) {
  const router = useRouter();
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }

    setIsSaving(true);
    const result = await updateQuizAction({ id: quiz.id, title: title.trim(), description });
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error || "Error al guardar los cambios");
      return;
    }

    toast.success("Quiz actualizado");
    router.refresh();
  };

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
                <p className="text-[#AFAFAF] text-sm">Creado por {quiz.teacherName} el {new Date(quiz.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-2 text-sm font-bold text-[#4B4B4B] uppercase">
                <Edit3 size={16} /> Editar
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
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full sm:w-auto bg-[#FF4B4B] hover:bg-[#FF6A6A] text-white font-black uppercase tracking-widest px-6 py-4 rounded-2xl border-b-4 border-[#D22D2D] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Eliminando..." : "Eliminar quiz"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight mb-4">Preguntas del Quiz ({questions.length})</h2>
            {questions.length === 0 ? (
              <p className="text-[#AFAFAF] font-bold">Este quiz no tiene preguntas asignadas.</p>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="rounded-3xl border-2 border-[#E5E5E5] bg-[#F7F7F7] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-2">{question.lessonTitle}</p>
                        <p className="font-bold text-[#4B4B4B]">{index + 1}. {question.question}</p>
                      </div>
                      <span className="text-xs font-black text-[#AFAFAF] uppercase tracking-widest">{question.type}</span>
                    </div>
                    <p className="mt-3 text-sm text-[#777777]"><span className="font-bold">Respuesta:</span> {question.correctAnswer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-[#E5E5E5] p-6">
            <h2 className="text-xl font-black text-[#4B4B4B] uppercase tracking-tight mb-4">Resumen</h2>
            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5]">
              <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-2">ID del Quiz</p>
              <p className="font-bold text-[#4B4B4B] break-words">{quiz.id}</p>
            </div>
            <div className="bg-[#F7F7F7] rounded-2xl p-4 border-2 border-[#E5E5E5] mt-4">
              <p className="text-[10px] text-[#AFAFAF] font-black uppercase tracking-widest mb-2">Creado</p>
              <p className="font-bold text-[#4B4B4B]">{new Date(quiz.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
