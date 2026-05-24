"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { deleteAccountAction, logoutAction, updateProfileAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAccessibilityStore } from "@/store/useAccessibilityStore";
import {
  Bell,
  CheckCircle2,
  Globe,
  Settings as SettingsIcon,
  Shield,
  User as UserIcon,
  X,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, setAuth, token } = useAuthStore();
  const { t, locale, setLocale } = useTranslation();
  const {
    font,
    theme,
    spacing,
    textSize,
    align,
    setFont,
    setTheme,
    setSpacing,
    setTextSize,
    setAlign,
  } = useAccessibilityStore();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    } else {
      setNewName(user.displayName);
    }
  }, [user, router]);

  if (!user) return null;

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.displayName) {
      setIsEditingName(false);
      return;
    }

    setIsPending(true);
    try {
      const result = await updateProfileAction({ displayName: newName });
      if (result.success && result.data) {
        setAuth(result.data, token!); // token exists if user exists
        toast.success(t("settings.successUpdate"));
        setIsEditingName(false);
      } else {
        toast.error(result.error || "Error");
      }
    } catch (error) {
      toast.error("Error");
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(t("settings.confirmDelete"))
    ) {
      return;
    }

    setIsPending(true);
    try {
      const result = await deleteAccountAction();
      if (result.success) {
        setAuth(null, null);
        router.push("/auth/login");
        toast.success(t("settings.successDelete"));
      } else {
        toast.error(result.error || "Error");
      }
    } catch (error) {
      toast.error("Error");
    } finally {
      setIsPending(false);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    setAuth(null, null);
    router.push("/auth/login");
  };

  return (
    <div className="max-w-3xl mx-auto py-4 lg:py-12 px-4 lg:px-8 space-y-6 lg:space-y-12 pb-24 lg:pb-12">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 lg:gap-6">
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="p-2.5 lg:p-4 bg-[#1CB0F6] text-white rounded-2xl lg:rounded-3xl shadow-[0_4px_0_0_#1899D6]">
            <SettingsIcon size={24} className="lg:w-10 lg:h-10" />
          </div>
          <h1 className="text-xl lg:text-4xl font-black text-[#4B4B4B] uppercase tracking-tight">
            {t("settings.title")}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto px-6 py-2.5 text-[10px] lg:text-sm font-black text-[#FF4B4B] hover:bg-[#FFF5F5] rounded-xl lg:rounded-2xl transition-colors uppercase tracking-widest border-2 border-transparent hover:border-[#FF4B4B]"
        >
          {t("sidebar.logout")}
        </button>
      </div>

      <div className="bg-white rounded-[1.5rem] lg:rounded-[2rem] border-2 border-[#E5E5E5] overflow-hidden">
        {/* Profile Setting */}
        <div className="p-5 lg:p-8 border-b-2 border-[#E5E5E5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="p-2.5 lg:p-3 bg-[#F7F7F7] rounded-xl lg:rounded-2xl text-[#777777]">
                <UserIcon size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-black text-[#4B4B4B] uppercase tracking-wide">
                  {t("settings.profileName")}
                </h3>
                {isEditingName ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1.5 lg:mt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 sm:w-64 px-3 py-1.5 border-2 border-[#E5E5E5] rounded-xl outline-none focus:border-[#1CB0F6] font-bold text-[#4B4B4B] text-sm lg:text-base"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleUpdateName}
                          disabled={isPending}
                          className="p-1.5 text-[#58CC02] hover:bg-[#F7F7F7] rounded-lg transition-colors"
                        >
                          {isPending ? <LoadingSpinner size="sm" /> : <CheckCircle2 size={22} />}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingName(false);
                            setNewName(user.displayName);
                          }}
                          className="p-1.5 text-[#FF4B4B] hover:bg-[#F7F7F7] rounded-lg transition-colors"
                        >
                          <X size={22} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#777777] font-bold text-xs lg:text-base">
                    {user.displayName}
                  </p>
                )}
              </div>
            </div>
            {!isEditingName && (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-[10px] lg:text-sm font-black text-[#1CB0F6] uppercase tracking-widest hover:bg-[#DDF4FF] px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl transition-colors text-center"
              >
                {t("settings.edit")}
              </button>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="p-5 lg:p-8 border-b-2 border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="p-2.5 lg:p-3 bg-[#F7F7F7] rounded-xl lg:rounded-2xl text-[#777777]">
                <Bell size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-black text-[#4B4B4B] uppercase tracking-wide">
                  {t("settings.notifications")}
                </h3>
                <p className="text-[#777777] font-bold text-xs lg:text-base">
                  {t("settings.dailyReminders")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={cn(
                "w-10 lg:w-12 h-5 lg:h-6 rounded-full transition-colors relative",
                notifications ? "bg-[#58CC02]" : "bg-[#E5E5E5]",
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 lg:top-1 w-4 h-4 bg-white rounded-full transition-all",
                  notifications ? "left-5.5 lg:left-7" : "left-0.5 lg:left-1",
                )}
              />
            </button>
          </div>
        </div>

        {/* Idioma de la aplicación */}
        <div className="p-5 lg:p-8 border-b-2 border-[#E5E5E5] space-y-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="p-2.5 lg:p-3 bg-[#F7F7F7] rounded-xl lg:rounded-2xl text-[#777777]">
              <Globe size={20} className="lg:w-6 lg:h-6" />
            </div>
            <div>
              <h3 className="text-xs lg:text-sm font-black text-[#4B4B4B] uppercase tracking-wide">
                {t("settings.language")}
              </h3>
              <p className="text-[#777777] font-bold text-xs lg:text-base">
                {t("settings.languageDesc")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { code: "es", label: "Español", flag: "🇪🇸" },
              { code: "en", label: "English", flag: "🇺🇸" },
              { code: "pt", label: "Português", flag: "🇧🇷" },
            ].map((lang) => {
              const isSelected = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code as any)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 lg:p-4 rounded-2xl border-2 transition-all cursor-pointer font-black text-sm uppercase tracking-wider gap-2 select-none",
                    isSelected
                      ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6] shadow-[0_4px_0_0_#84D8FF] translate-y-[-2px]"
                      : "border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F7F7F7] shadow-[0_4px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E5E5E5]"
                  )}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-[10px] lg:text-xs">{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ajustes de Accesibilidad */}
        <div className="p-5 lg:p-8 border-b-2 border-[#E5E5E5] space-y-6">
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="p-2.5 lg:p-3 bg-[#F7F7F7] rounded-xl lg:rounded-2xl text-[#777777]">
              <Eye size={20} className="lg:w-6 lg:h-6" />
            </div>
            <div>
              <h3 className="text-xs lg:text-sm font-black text-[#4B4B4B] uppercase tracking-wide">
                {t("accessibility.title")}
              </h3>
              <p className="text-[#777777] font-bold text-xs lg:text-base">
                {t("accessibility.desc")}
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            {/* 1. Tipo de Letra */}
            <div className="space-y-2">
              <label className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider block">
                {t("accessibility.fontLabel")}
              </label>
              <p className="text-[11px] lg:text-xs text-[#777777] font-bold">
                {t("accessibility.fontDesc")}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { code: "default", label: t("accessibility.fontDefault"), fontStyle: "font-sans" },
                  { code: "accessible-sans", label: t("accessibility.fontAccessibleSans"), fontStyle: "accessibility-font-accessible-sans" },
                ].map((f) => {
                  const isSelected = font === f.code;
                  return (
                    <button
                      key={f.code}
                      onClick={() => setFont(f.code as any)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer font-black text-center text-xs uppercase tracking-wider gap-2 select-none",
                        isSelected
                          ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6] shadow-[0_4px_0_0_#84D8FF] translate-y-[-2px]"
                          : "border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F7F7F7] shadow-[0_4px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E5E5E5]"
                      )}
                    >
                      <span className={cn("text-2xl normal-case font-bold leading-none", f.fontStyle)}>Aa</span>
                      <span className="text-[10px] lg:text-xs leading-tight">{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Tema Cromático (Contraste Moderado) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider block">
                {t("accessibility.themeLabel")}
              </label>
              <p className="text-[11px] lg:text-xs text-[#777777] font-bold">
                {t("accessibility.themeDesc")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                {[
                  { code: "default", label: t("accessibility.themeDefault"), bg: "bg-[#fffdf5]", border: "border-[#E5E5E5]" },
                  { code: "cream", label: t("accessibility.themeCream"), bg: "bg-[#f5f5f0]", border: "border-[#dcdcd3]" },
                  { code: "pastel-blue", label: t("accessibility.themePastelBlue"), bg: "bg-[#eef7fc]", border: "border-[#d1e6f3]" },
                  { code: "mint-green", label: t("accessibility.themeMintGreen"), bg: "bg-[#edf7ed]", border: "border-[#d2edd2]" },
                ].map((th) => {
                  const isSelected = theme === th.code;
                  return (
                    <button
                      key={th.code}
                      onClick={() => setTheme(th.code as any)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer font-black text-center text-[10px] uppercase tracking-wider gap-2 select-none",
                        isSelected
                          ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6] shadow-[0_4px_0_0_#84D8FF] translate-y-[-2px]"
                          : "border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F7F7F7] shadow-[0_4px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E5E5E5]"
                      )}
                    >
                      <div className={cn("w-6 h-6 rounded-full border-2 shadow-inner", th.bg, th.border)} />
                      <span className="text-[9px] lg:text-[10px] leading-tight truncate w-full">{th.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Espaciado Tipográfico */}
            <div className="space-y-2">
              <label className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider block">
                {t("accessibility.spacingLabel")}
              </label>
              <p className="text-[11px] lg:text-xs text-[#777777] font-bold">
                {t("accessibility.spacingDesc")}
              </p>
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { code: "default", label: t("spacingDefault"), desc: "Normal" },
                  { code: "optimized", label: t("accessibility.spacingOptimized"), desc: "1.65x / +0.03" },
                  { code: "wcag", label: t("accessibility.spacingWcag"), desc: "1.85x / +0.12" },
                ].map((sp) => {
                  const isSelected = spacing === sp.code;
                  return (
                    <button
                      key={sp.code}
                      onClick={() => setSpacing(sp.code as any)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer font-black text-center text-xs uppercase tracking-wider gap-1 select-none",
                        isSelected
                          ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6] shadow-[0_4px_0_0_#84D8FF] translate-y-[-2px]"
                          : "border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F7F7F7] shadow-[0_4px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E5E5E5]"
                      )}
                    >
                      <span className="text-[10px] lg:text-xs leading-none">{sp.label}</span>
                      <span className="text-[9px] text-[#AFAFAF] normal-case font-bold">{sp.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 4. Tamaño de Letra */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider block">
                  {t("accessibility.textSizeLabel")}
                </label>
                <p className="text-[11px] lg:text-xs text-[#777777] font-bold">
                  {t("accessibility.textSizeDesc")}
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { code: "normal", label: "100%" },
                    { code: "medium", label: "115%" },
                    { code: "large", label: "130%" },
                  ].map((sz) => {
                    const isSelected = textSize === sz.code;
                    return (
                      <button
                        key={sz.code}
                        onClick={() => setTextSize(sz.code as any)}
                        className={cn(
                          "p-2.5 rounded-xl border-2 transition-all cursor-pointer font-black text-center text-xs select-none",
                          isSelected
                            ? "border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6] shadow-[0_4px_0_0_#84D8FF] translate-y-[-2px]"
                            : "border-[#E5E5E5] bg-white text-[#777777] hover:bg-[#F7F7F7] shadow-[0_4px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E5E5E5]"
                        )}
                      >
                        {sz.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Alineación Forzada */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <label className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider block">
                    {t("accessibility.alignLabel")}
                  </label>
                  <p className="text-[11px] lg:text-xs text-[#777777] font-bold mt-1 leading-tight">
                    {t("accessibility.alignDesc")}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setAlign(align === "default" ? "left" : "default")}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative cursor-pointer border border-[#E5E5E5] shrink-0",
                      align === "left" ? "bg-[#58CC02]" : "bg-[#E5E5E5]"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full transition-all shadow-md",
                        align === "left" ? "left-6" : "left-0.5"
                      )}
                    />
                  </button>
                  <span className="text-xs font-black text-[#4B4B4B] uppercase tracking-wider select-none">
                    {align === "left" ? t("accessibility.alignLeft") : t("accessibility.alignDefault")}
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Previsualización del Texto */}
            <div className="p-4 lg:p-6 rounded-2xl border-2 border-[#E5E5E5] bg-[#F7F7F7] space-y-3 mt-4">
              <div className="flex items-center gap-2 border-b border-[#E5E5E5] pb-2 text-[#777777]">
                <Globe size={14} />
                <span className="text-[10px] font-black uppercase tracking-wider">{t("accessibility.previewTitle")}</span>
              </div>
              <p className="text-sm font-bold text-[#4B4B4B] transition-all leading-relaxed">
                {t("accessibility.previewText")}
              </p>
              <p className="HebrewFont text-2xl text-right dir-rtl leading-loose pt-1 font-semibold text-[#121212]">
                בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמัיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ
              </p>
            </div>
          </div>
        </div>

        {/* Account Safety */}
        <div className="p-5 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="p-2.5 lg:p-3 bg-[#F7F7F7] rounded-xl lg:rounded-2xl text-[#777777]">
                <Shield size={20} className="lg:w-6 lg:h-6" />
              </div>
              <div>
                <h3 className="text-xs lg:text-sm font-black text-[#4B4B4B] uppercase tracking-wide">
                  {t("settings.account")}
                </h3>
                <p className="text-[#777777] font-bold text-[10px] lg:text-base">
                  {t("settings.deleteAccount")}
                </p>
              </div>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={isPending}
              className="text-[10px] lg:text-sm font-black text-[#FF4B4B] uppercase tracking-widest hover:bg-[#FFF5F5] px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl transition-colors disabled:opacity-50 text-center"
            >
              {t("settings.deleteButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
