"use client";

import { BookOpen, Heart, Shield, Terminal, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const donationUrl =
    "https://www.flow.cl/app/web/pagarBtnPago.php?token=bbf8019fcc40b7478107cf1cb3449046a2bf0fe2";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl lg:text-5xl font-black text-[#58CC02] tracking-tighter uppercase">
          Acerca de Teolingo
        </h1>
        <p className="text-[#777777] font-bold text-sm lg:text-lg uppercase tracking-widest">
          Aprende idiomas bíblicos de forma interactiva
        </p>
      </div>

      {/* Qué es Teolingo Card */}
      <div className="bg-white rounded-[2rem] border-2 border-[#E5E5E5] p-6 lg:p-10 shadow-[0_4px_0_0_#E5E5E5] space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#EBF7FF] rounded-2xl border-2 border-[#84D8FF]">
            <BookOpen className="text-[#1CB0F6]" size={28} />
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Nuestra Plataforma
          </h2>
        </div>
        <p className="text-[#777777] font-bold text-sm lg:text-base leading-relaxed">
          Teolingo es una plataforma educativa de gamificación diseñada para el estudio y
          aprendizaje de las Sagradas Escrituras en sus lenguas originales. Creemos que el hebreo
          bíblico y el griego koiné no deben ser materias áridas o inalcanzables, sino senderos
          apasionantes y motivadores para cualquier estudiante sincero de la Palabra de Dios. 
        </p>
        <p className="text-[#777777] font-bold text-sm lg:text-base leading-relaxed">
          Uniendo metodologías modernas de aprendizaje interactivo con un respeto profundo hacia el
          texto sagrado, Teolingo facilita la asimilación del vocabulario, el análisis morfológico
          y la pronunciación para servir de puente hacia un estudio bíblico más riguroso y espiritual.
        </p>
      </div>

      {/* Donaciones Card con desglose de costos */}
      <div className="bg-[#FFFDF5] rounded-[2rem] border-2 border-[#FFC800] p-6 lg:p-10 shadow-[0_4px_0_0_#FFC800] space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FFF5E5] rounded-2xl border-2 border-[#FF9600]">
            <Heart className="text-[#FF9600]" size={28} />
          </div>
          <h2 className="text-xl lg:text-2xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Apoya este Proyecto
          </h2>
        </div>
        <p className="text-[#777777] font-bold text-sm lg:text-base leading-relaxed">
          Si este recurso ha sido de bendición para tu vida, ministerio o estudio de las Escrituras,
          puedes apoyarnos para sostener los costos de infraestructura que mantienen a Teolingo activo,
          gratuito y disponible en todo el mundo.
        </p>

        {/* Desglose de Gastos */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#777777]">
            Gastos de mantenimiento mensual
          </h3>
          <div className="bg-white rounded-2xl border-2 border-[#E5E5E5] overflow-hidden divide-y-2 divide-[#E5E5E5]">
            <div className="flex justify-between items-center p-4 text-xs lg:text-sm font-bold text-[#4B4B4B]">
              <span>Suscripción ChatGPT Plus (Modelos de IA y feedback inteligente)</span>
              <span className="text-[#FF9600] font-extrabold">$20.00 USD/mes</span>
            </div>
            <div className="flex justify-between items-center p-4 text-xs lg:text-sm font-bold text-[#4B4B4B]">
              <span>Plan de Turso (Base de Datos SQL distribuida en la nube)</span>
              <span className="text-[#FF9600] font-extrabold">$4.99 USD/mes</span>
            </div>
            <div className="flex justify-between items-center p-4 text-xs lg:text-sm font-bold text-[#4B4B4B]">
              <span>Plan Pro de Vercel (Hospedaje de alta disponibilidad)</span>
              <span className="text-[#FF9600] font-extrabold">$20.00 USD/mes</span>
            </div>
            <div className="flex justify-between items-center p-4 text-xs lg:text-sm font-bold text-[#4B4B4B]">
              <span>Plan de Resend (Envío de correos y recuperación de cuentas)</span>
              <span className="text-[#FF9600] font-extrabold">$20.00 USD/mes</span>
            </div>
            <div className="flex justify-between items-center p-4 text-xs lg:text-sm font-bold text-[#4B4B4B] bg-[#FFFBF0]">
              <span className="font-extrabold">Publicación futura en Stores (Apple App Store / Google Play)</span>
              <span className="text-[#FF9600] font-extrabold">$125.00 USD (Anual/Único)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center sm:text-left">
          <Link
            href={donationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto text-center py-4 px-8 bg-[#58CC02] text-white rounded-2xl font-black uppercase tracking-widest text-sm lg:text-base border-b-4 border-[#46A302] hover:bg-[#61E002] active:border-b-0 active:translate-y-1 transition-all"
          >
            👉 Apoyar Proyecto (Donar aquí)
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Nuestra Fe Card */}
        <div className="bg-white rounded-[2rem] border-2 border-[#E5E5E5] p-6 lg:p-8 shadow-[0_4px_0_0_#E5E5E5] space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#F3FFF0] rounded-2xl border-2 border-[#D7F5D0]">
              <Shield className="text-[#58CC02]" size={24} />
            </div>
            <h2 className="text-lg lg:text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
              Nuestra Fe
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-black text-sm text-[#4B4B4B] uppercase tracking-tight">
                Sola Scriptura
              </h3>
              <p className="text-xs text-[#777777] font-bold mt-1 leading-relaxed">
                Aceptamos la Biblia como nuestra única norma de fe y práctica. Creemos que las Sagradas
                Escrituras son la Palabra de Dios escrita, inspirada por el Espíritu Santo y la
                revelación autoritativa de Su voluntad.
              </p>
            </div>
            <div>
              <h3 className="font-black text-sm text-[#4B4B4B] uppercase tracking-tight">
                La Esperanza Adventista
              </h3>
              <p className="text-xs text-[#777777] font-bold mt-1 leading-relaxed">
                Sostenemos las 28 creencias fundamentales de la Iglesia Adventista del Séptimo Día,
                destacando la salvación por gracia mediante la fe en Jesucristo, la vigencia de los
                Diez Mandamientos (incluyendo el sábado como reposo bíblico) y la bienaventurada
                esperanza de Su pronto regreso.
              </p>
            </div>
          </div>
        </div>

        {/* Desarrollo Card */}
        <div className="bg-white rounded-[2rem] border-2 border-[#E5E5E5] p-6 lg:p-8 shadow-[0_4px_0_0_#E5E5E5] space-y-6 flex flex-col">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#FFF5F5] rounded-2xl border-2 border-[#FFD9D9]">
              <Users className="text-[#FF4B4B]" size={24} />
            </div>
            <h2 className="text-lg lg:text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
              Desarrollo
            </h2>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-black text-[#4B4B4B] uppercase tracking-tight mb-1">
                Johan Gutierrez
              </h3>
              <p className="text-xs text-[#1CB0F6] font-black uppercase tracking-wider mb-2">
                Estudiante de Teología
              </p>
              <p className="text-xs text-[#777777] font-bold leading-relaxed">
                Universidad Adventista de Chile (UnACh)
              </p>
            </div>

            <div className="bg-[#F7F7F7] border-l-4 border-[#1CB0F6] p-4 rounded-r-xl italic font-bold text-xs text-[#4B4B4B]">
              "Dedicado a la excelencia en el estudio de las Escrituras para el servicio del reino de Dios."
            </div>
          </div>
        </div>
      </div>

      {/* Fundamentos Didácticos y Metodológicos Card */}
      <div className="bg-white rounded-[2rem] border-2 border-[#E5E5E5] p-6 lg:p-8 shadow-[0_4px_0_0_#E5E5E5] space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#F4F9FF] rounded-2xl border-2 border-[#D0E7FF]">
            <Terminal className="text-[#1CB0F6]" size={24} />
          </div>
          <h2 className="text-lg lg:text-xl font-black text-[#4B4B4B] uppercase tracking-tight">
            Fundamentos Didácticos y Metodologías
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#F7F7F7] border-2 border-[#E5E5E5] p-4 rounded-2xl font-bold">
            <p className="font-black text-[#4B4B4B] uppercase mb-1">Método IME</p>
            <p className="text-[#777777]">
              Inmersión Multisensorial Estructurada que estimula de forma simultánea canales Visuales, Auditivos y Kinestésicos.
            </p>
          </div>
          <div className="bg-[#F7F7F7] border-2 border-[#E5E5E5] p-4 rounded-2xl font-bold">
            <p className="font-black text-[#4B4B4B] uppercase mb-1">Morfología Cromática</p>
            <p className="text-[#777777]">
              Codificación visual gramatical explícita por colores (Raíz: Gris, Prefijos: Verde, Sufijos: Azul, Marcadores: Naranja).
            </p>
          </div>
          <div className="bg-[#F7F7F7] border-2 border-[#E5E5E5] p-4 rounded-2xl font-bold">
            <p className="font-black text-[#4B4B4B] uppercase mb-1">Estructura Bloom</p>
            <p className="text-[#777777]">
              Progresión pedagógica sistemática desde la retención básica (LOTS) hasta el análisis morfológico exegético complejo (HOTS).
            </p>
          </div>
          <div className="bg-[#F7F7F7] border-2 border-[#E5E5E5] p-4 rounded-2xl font-bold">
            <p className="font-black text-[#4B4B4B] uppercase mb-1">Repaso Espaciado (SRS)</p>
            <p className="text-[#777777]">
              Algoritmo de repetición espaciada SuperMemo-2 adaptado para optimizar la memorización y retención de vocabulario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
