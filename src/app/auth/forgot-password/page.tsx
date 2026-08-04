"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { forgotPasswordAction } from "@/features/auth/actions";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setDevResetUrl(null);
    setLoading(true);

    try {
      const result = await forgotPasswordAction(email);
      if (result.success) {
        setSuccessMessage(result.message || "Correo enviado con éxito.");
        if (result.devResetUrl) {
          setDevResetUrl(result.devResetUrl);
        }
      } else {
        setError(result.error || "Ocurrió un error al procesar tu solicitud.");
      }
    } catch (err: any) {
      console.error("forgot-password submit error:", err);
      setError("Error al solicitar el enlace de recuperación.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="w-full max-w-md p-6 lg:p-10 bg-white rounded-[2rem] border-2 border-[#E5E5E5] shadow-[0_4px_0_0_#E5E5E5] overflow-y-auto no-scrollbar">
        <h1 className="text-xl lg:text-3xl font-black text-center mb-4 text-[#4B4B4B] uppercase tracking-tight">
          Recuperar Contraseña
        </h1>
        <p className="text-center text-[#777777] font-bold text-sm mb-6 lg:mb-8">
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {error && (
          <div className="p-4 mb-6 text-sm font-bold text-[#FF4B4B] bg-[#FFF5F5] rounded-2xl border-2 border-[#FFD9D9] transition-all duration-300">
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="space-y-6 text-center py-4">
            <div className="p-4 text-sm font-bold text-[#58CC02] bg-[#F3FFF0] rounded-2xl border-2 border-[#D7F5D0] transition-all duration-300">
              {successMessage}
            </div>
            
            {/* Developer Helper Panel */}
            {devResetUrl && (
              <div className="p-5 mt-4 text-left bg-[#F4F9FF] rounded-2xl border-2 border-[#D0E7FF] shadow-[0_4px_0_0_#D0E7FF] transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#1CB0F6] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                    Modo Desarrollo
                  </span>
                  <span className="text-[#1CB0F6] font-extrabold text-xs">Debug Helper</span>
                </div>
                <p className="text-xs text-[#4B4B4B] font-bold mb-3 leading-relaxed">
                  Como estás en desarrollo local, hemos capturado el enlace generado para que puedas probar el flujo al instante sin configurar Resend ni revisar la terminal:
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href={devResetUrl}
                    className="w-full py-2.5 bg-[#1CB0F6] text-white rounded-xl font-black text-center uppercase tracking-widest text-xs border-b-4 border-[#1899D6] hover:bg-[#20C4FF] active:border-b-0 active:translate-y-1 transition-all"
                  >
                    👉 Probar Enlace de Recuperación
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(devResetUrl);
                      alert("¡Enlace copiado al portapapeles!");
                    }}
                    className="w-full py-2 bg-white text-[#777777] rounded-xl font-black text-center uppercase tracking-widest text-xs border-2 border-[#E5E5E5] hover:bg-[#F7F7F7] active:translate-y-0.5 transition-all"
                  >
                    📋 Copiar Enlace
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Link
                href="/auth/login"
                className="inline-block px-8 py-3 bg-[#E5E5E5] text-[#777777] rounded-2xl font-black uppercase tracking-widest text-sm border-b-4 border-[#AFAFAF] hover:bg-[#F0F0F0] active:border-b-0 active:translate-y-1 transition-all"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email-input"
                className="block text-sm font-black text-[#777777] uppercase tracking-widest mb-2 ml-1"
              >
                Email
              </label>
              <input
                id="email-input"
                name="email"
                type="email"
                className="w-full px-4 py-3 lg:py-4 rounded-2xl border-2 border-[#E5E5E5] focus:border-[#1CB0F6] outline-none transition-all font-bold text-[#4B4B4B] placeholder:text-[#AFAFAF]"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  <span>Enviando...</span>
                </>
              ) : (
                "Enviar Enlace"
              )}
            </button>
          </form>
        )}

        {!successMessage && (
          <p className="mt-8 text-center text-[#777777] font-bold">
            ¿Recordaste tu contraseña?{" "}
            <Link
              href="/auth/login"
              className="text-[#1CB0F6] hover:text-[#20C4FF] transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
