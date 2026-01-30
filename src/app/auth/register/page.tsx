"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { registerAction } from "@/features/auth/actions";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    if (email) {
      formData.set("email", email.toLowerCase().trim());
    }

    try {
      const result = await registerAction(formData);
      if (result.success && result.data) {
        try {
          setAuth(result.data.user as any, result.data.token);
        } catch (err) {
          console.error("setAuth failed:", err);
        }

        // Force a full navigation so the Set-Cookie from the server action is applied
        // and the next server-rendered request sees the session cookie.
        try {
          window.location.assign("/learn");
        } catch (err) {
          console.warn("location.assign failed, falling back to router.push", err);
          try {
            router.push("/learn");
          } catch (e) {
            /* ignore */
          }
        }
      } else {
        setError(result.error || "Error al registrarse");
      }
    } catch (err: any) {
      console.error("register submit error:", err);
      setError("Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-4xl lg:text-6xl font-black text-[#58CC02] tracking-tighter mb-2">
          teolingo
        </h2>
        <p className="text-[#777777] font-bold text-sm lg:text-lg uppercase tracking-widest">
          Aprende la Palabra de Dios
        </p>
      </div>

      <div className="w-full max-w-md p-6 lg:p-10 bg-white rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] overflow-y-auto no-scrollbar">
        <h1 className="text-xl lg:text-3xl font-black text-center mb-6 lg:mb-8 text-[#4B4B4B] uppercase tracking-tight">
          Crea tu cuenta
        </h1>

        {error && (
          <div className="p-4 mb-6 text-sm font-bold text-[#FF4B4B] bg-[#FFF5F5] rounded-2xl border-2 border-[#FFD9D9]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-black text-[#777777] uppercase tracking-widest mb-2 ml-1">
              Nombre para mostrar
            </label>
            <input
              name="displayName"
              type="text"
              className="w-full px-4 py-3 lg:py-4 rounded-2xl border-2 border-[#E5E5E5] focus:border-[#1CB0F6] outline-none transition-all font-bold text-[#4B4B4B] placeholder:text-[#AFAFAF]"
              required
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-[#777777] uppercase tracking-widest mb-2 ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-3 lg:py-4 rounded-2xl border-2 border-[#E5E5E5] focus:border-[#1CB0F6] outline-none transition-all font-bold text-[#4B4B4B] placeholder:text-[#AFAFAF]"
              required
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-[#777777] uppercase tracking-widest mb-2 ml-1">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-3 lg:py-4 rounded-2xl border-2 border-[#E5E5E5] focus:border-[#1CB0F6] outline-none transition-all font-bold text-[#4B4B4B] placeholder:text-[#AFAFAF]"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 lg:py-4 bg-[#1CB0F6] text-white rounded-2xl font-black uppercase tracking-widest text-sm lg:text-base border-b-4 lg:border-b-8 border-[#1899D6] hover:bg-[#20C4FF] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" variant="white" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[#777777] font-bold">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-[#1CB0F6] hover:text-[#20C4FF] transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
