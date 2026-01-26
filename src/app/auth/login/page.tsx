"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { loginAction } from "@/features/auth/actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginAction(formData);
      console.log("loginAction result:", result);
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
          console.warn(
            "location.assign failed, falling back to router.push",
            err,
          );
          try {
            router.push("/learn");
          } catch (e) {
            /* ignore */
          }
        }
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err: any) {
      console.error("login submit error:", err);
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Bienvenido de nuevo
        </h1>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/auth/register"
            className="text-indigo-600 font-bold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
