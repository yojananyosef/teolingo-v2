"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { resetPasswordAction } from "@/features/auth/actions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(4);

  // Countdown timer for auto redirection on success
  useEffect(() => {
    if (!successMessage) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/auth/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [successMessage, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("token", token || "");
    formData.append("password", password);

    try {
      const result = await resetPasswordAction(formData);
      if (result.success) {
        setSuccessMessage(result.message || "Contraseña restablecida con éxito.");
      } else {
        setError(result.error || "Error al restablecer la contraseña.");
      }
    } catch (err: unknown) {
      console.error("reset-password submit error:", err);
      setError("Error interno al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md p-6 lg:p-10 bg-white rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] text-center">
        <div className="w-16 h-16 bg-[#FFF5F5] border-2 border-[#FFD9D9] text-[#FF4B4B] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black">
          !
        </div>
        <h1 className="text-xl lg:text-3xl font-black text-[#4B4B4B] uppercase tracking-tight mb-4">
          Enlace Inválido
        </h1>
        <p className="text-[#777777] font-bold text-sm mb-8 leading-relaxed">
          No se ha proporcionado un token de recuperación de contraseña o el enlace es incorrecto.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block w-full py-3 bg-[#1CB0F6] text-white rounded-2xl font-black uppercase tracking-widest text-sm border-b-4 border-[#1899D6] hover:bg-[#20C4FF] active:border-b-0 active:translate-y-1 transition-all"
        >
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-6 lg:p-10 bg-white rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5]">
      <h1 className="text-xl lg:text-3xl font-black text-center mb-4 text-[#4B4B4B] uppercase tracking-tight">
        Nueva Contraseña
      </h1>
      <p className="text-center text-[#777777] font-bold text-sm mb-6 lg:mb-8">
        Elige una contraseña nueva y segura para tu cuenta.
      </p>

      {error && (
        <div className="p-4 mb-6 text-sm font-bold text-[#FF4B4B] bg-[#FFF5F5] rounded-2xl border-2 border-[#FFD9D9] transition-all">
          {error}
        </div>
      )}

      {successMessage ? (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 bg-[#F3FFF0] border-2 border-[#D7F5D0] text-[#58CC02] rounded-full flex items-center justify-center mx-auto text-3xl font-black">
            ✓
          </div>
          <div className="p-4 text-sm font-bold text-[#58CC02] bg-[#F3FFF0] rounded-2xl border-2 border-[#D7F5D0] transition-all">
            {successMessage}
          </div>
          <p className="text-xs text-[#777777] font-bold">
            Redirigiendo al inicio de sesión en <span className="text-[#1CB0F6] text-sm font-black">{countdown}</span> segundos...
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="w-full py-3 bg-[#1CB0F6] text-white rounded-2xl font-black uppercase tracking-widest text-sm border-b-4 border-[#1899D6] hover:bg-[#20C4FF] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center"
            >
              Iniciar sesión ahora
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password-input"
              className="block text-sm font-black text-[#777777] uppercase tracking-widest mb-2 ml-1"
            >
              Nueva Contraseña
            </label>
            <input
              id="password-input"
              name="password"
              type="password"
              className="w-full px-4 py-3 lg:py-4 rounded-2xl border-2 border-[#E5E5E5] focus:border-[#1CB0F6] outline-none transition-all font-bold text-[#4B4B4B] placeholder:text-[#AFAFAF]"
              required
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password-input"
              className="block text-sm font-black text-[#777777] uppercase tracking-widest mb-2 ml-1"
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirm-password-input"
              name="confirmPassword"
              type="password"
              className="w-full px-4 py-3 lg:py-4 rounded-2xl border-2 border-[#E5E5E5] focus:border-[#1CB0F6] outline-none transition-all font-bold text-[#4B4B4B] placeholder:text-[#AFAFAF]"
              required
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 lg:py-4 bg-[#58CC02] text-white rounded-2xl font-black uppercase tracking-widest text-sm lg:text-base border-b-4 lg:border-b-8 border-[#46A302] hover:bg-[#61E002] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" variant="white" />
                <span>Guardando...</span>
              </>
            ) : (
              "Establecer Contraseña"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-white">
      <div className="mb-8 text-center">
        <h2 className="text-4xl lg:text-6xl font-black text-[#58CC02] tracking-tighter mb-2">
          teolingo
        </h2>
        <p className="text-[#777777] font-bold text-sm lg:text-lg uppercase tracking-widest">
          Aprende idiomas bíblicos
        </p>
      </div>

      <Suspense
        fallback={
          <div className="w-full max-w-md p-10 bg-white rounded-[2rem] border-2 border-[#E5E5E5] flex flex-col items-center justify-center min-h-[300px]">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-[#777777] font-black uppercase tracking-widest text-xs">
              Cargando...
            </p>
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
