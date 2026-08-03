import { BookOpen, Home } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-6">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-indigo-400">404</h1>
          <h2 className="text-xl font-bold tracking-tight">Página o recurso no encontrado</h2>
          <p className="text-slate-400 text-sm">
            La lección, módulo o página que buscas no existe o ha sido movida.
          </p>
        </div>
        <Link
          href="/learn"
          className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition duration-200"
        >
          <Home className="w-4 h-4" />
          Volver a mis Lecciones
        </Link>
      </div>
    </div>
  );
}
