"use client";

import { logoutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useCourseStore } from "@/store/useCourseStore";
import {
  BatteryFull,
  BatteryLow,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ChevronDown,
  Globe,
  AlertTriangle,
  Heart,
  Home,
  Info,
  LogOut,
  Menu,
  Music,
  Settings,
  Star,
  Trophy,
  User as UserIcon,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Sidebar({
  className,
  isMobile = false,
}: {
  className?: string;
  isMobile?: boolean;
}) {
  const { user, setAuth } = useAuthStore();
  const { isLowEnergyMode, toggleLowEnergyMode, isSidebarCollapsed, toggleSidebar } = useUIStore();
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingQuizzesCount, setPendingQuizzesCount] = useState<number>(0);
  const { activeCourse, setCourse, hasDismissedGreekWarning, setDismissedGreekWarning } = useCourseStore();
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [showGreekWarning, setShowGreekWarning] = useState(false);

  const sidebarItems = [
    { icon: Home, label: t("sidebar.learn"), href: "/learn" },
    { icon: BookOpen, label: t("sidebar.practice"), href: "/practice" },
    { icon: ClipboardCheck, label: t("sidebar.quizzes"), href: "/quizzes" },
    { icon: Star, label: t("sidebar.israeli"), href: "/modes/israeli" },
    { icon: Trophy, label: t("sidebar.ranking"), href: "/leaderboard" },
    { icon: UserIcon, label: t("sidebar.profile"), href: "/profile" },
    { icon: Settings, label: t("sidebar.settings"), href: "/settings" },
    { icon: Info, label: t("sidebar.about"), href: "/about" },
  ];

  const teacherItems = [{ icon: Users, label: "Docente", href: "/teacher" }];

  useEffect(() => {
    if (!user) return;
    const fetchPendingCount = async () => {
      try {
        const res = await fetch("/api/quizzes/pending-count");
        if (res.ok) {
          const data = await res.json();
          setPendingQuizzesCount(data.count || 0);
        }
      } catch (err) {
        console.error("Error fetching pending count:", err);
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    await logoutAction();
    setAuth(null, null);
    router.push("/auth/login");
  };

  // On mobile, we show the first 4 items in the bottom nav, and the rest in the "More" menu.
  // If the user is teacher, include the teacher panel link in the more menu too.
  const primaryMobileItems = sidebarItems.slice(0, 4);
  const secondaryMobileItems = [
    ...sidebarItems.slice(4),
    ...(user?.role === "teacher" ? teacherItems : []),
  ];

  if (isMobile) {
    return (
      <div className="flex w-full h-full">
        {primaryMobileItems.map((item) => {
          const isActive = pathname === item.href;
          const isQuizzes = item.href === "/quizzes";
          const showBadge = isQuizzes && pendingQuizzesCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative",
                isActive ? "text-[#1CB0F6]" : "text-[#777777]",
              )}
            >
              <div className="relative">
                <item.icon
                  className={cn("w-6 h-6", isActive ? "text-[#1CB0F6]" : "text-[#777777]")}
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4B4B] text-[9px] font-black text-white ring-2 ring-white animate-pulse">
                    {pendingQuizzesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">
                {item.label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all",
            isMenuOpen ? "text-[#1CB0F6]" : "text-[#777777]",
          )}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          <span className="text-[10px] font-black uppercase tracking-tighter">Más</span>
        </button>

        {/* Mobile More Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
            <div className="absolute bottom-16 left-4 right-4 bg-white rounded-3xl p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom-10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-black text-[#AFAFAF] uppercase tracking-widest text-sm">
                  Más Opciones
                </h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#AFAFAF] hover:text-[#4B4B4B]"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    toggleLowEnergyMode();
                    setIsMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-4 w-full p-4 font-black rounded-2xl transition-all border-2 border-transparent uppercase text-sm tracking-wide",
                    isLowEnergyMode
                      ? "bg-[#FFF9E5] border-[#FFC800] text-[#FFC800]"
                      : "text-[#777777] hover:bg-[#F7F7F7]",
                  )}
                >
                  {isLowEnergyMode ? (
                    <BatteryLow className="w-6 h-6" />
                  ) : (
                    <BatteryFull className="w-6 h-6" />
                  )}
                  Modo Energía
                </button>

                {secondaryMobileItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4 font-black rounded-2xl transition-all border-2 border-transparent uppercase text-sm tracking-wide",
                      pathname === item.href
                        ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]"
                        : "text-[#777777] hover:bg-[#F7F7F7]",
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.label}
                  </Link>
                ))}

                {user && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full p-4 font-black text-[#777777] hover:text-[#FF4B4B] hover:bg-[#FFF5F5] rounded-2xl transition-all uppercase text-sm tracking-wide"
                  >
                    <LogOut className="w-6 h-6" />
                    {t("sidebar.logout")}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r-2 border-[#E5E5E5] bg-white transition-all duration-300 relative",
        isSidebarCollapsed ? "w-20" : "w-64",
        className,
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border-2 border-[#E5E5E5] rounded-full p-1 text-[#AFAFAF] hover:text-[#1CB0F6] hover:border-[#1CB0F6] transition-all z-10 hidden lg:block shadow-md group"
        title={isSidebarCollapsed ? "Expandir" : "Colapsar"}
      >
        {isSidebarCollapsed ? (
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        ) : (
          <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        )}
      </button>

      <div
        className={cn(
          "flex items-center gap-2 mb-2 pt-4 transition-all duration-300",
          isSidebarCollapsed ? "px-4 justify-center" : "px-8",
        )}
      >
        <span
          className={cn(
            "font-black text-[#58CC02] tracking-tighter transition-all duration-300",
            isSidebarCollapsed ? "text-xl" : "text-3xl",
          )}
        >
          {isSidebarCollapsed ? "t" : "teolingo"}
        </span>
      </div>

      {/* Selector de Cursos Estilo Duolingo */}
      <div className={cn("px-4 mb-4 relative z-20", isSidebarCollapsed ? "flex justify-center" : "")}>
        <button
          onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}
          className={cn(
            "w-full flex items-center justify-between p-3 rounded-2xl border-2 transition-all cursor-pointer font-black text-sm uppercase tracking-wide select-none active:translate-y-[2px] active:shadow-[0_2px_0_0_#E5E5E5] outline-none",
            isSidebarCollapsed ? "px-2" : "px-4",
            "border-[#E5E5E5] bg-white text-[#4B4B4B] shadow-[0_4px_0_0_#E5E5E5] hover:bg-[#F7F7F7]"
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{activeCourse === "greek" ? "🇬🇷" : "🇮🇱"}</span>
            {!isSidebarCollapsed && (
              <span className="truncate max-w-[120px] text-xs font-black">
                {activeCourse === "greek" ? "GRIEGO (EXP)" : "HEBREO BÍB."}
              </span>
            )}
          </div>
          {!isSidebarCollapsed && <ChevronDown size={14} className={cn("text-[#AFAFAF] shrink-0 transition-transform duration-200", isCourseDropdownOpen ? "rotate-180" : "")} />}
        </button>

        {/* Dropdown del Selector */}
        {isCourseDropdownOpen && (
          <div
            className={cn(
              "absolute left-4 right-4 mt-2 bg-white border-2 border-[#E5E5E5] rounded-2xl shadow-xl overflow-hidden py-1.5 z-30",
              isSidebarCollapsed ? "w-48 left-16 top-0" : ""
            )}
          >
            {[
              { code: "hebrew", label: "Hebreo Bíblico", flag: "🇮🇱", isExp: false },
              { code: "greek", label: "Griego (Experimental)", flag: "🇬🇷", isExp: true },
            ].map((courseOption) => (
              <button
                key={courseOption.code}
                onClick={() => {
                  setIsCourseDropdownOpen(false);
                  if (courseOption.code === "greek" && !hasDismissedGreekWarning) {
                    setShowGreekWarning(true);
                  } else {
                    setCourse(courseOption.code as any);
                    router.push(`/learn?course=${courseOption.code}`);
                  }
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 hover:bg-[#F7F7F7] font-black text-[11px] lg:text-xs text-[#4B4B4B] text-left uppercase tracking-wider transition-colors cursor-pointer",
                  activeCourse === courseOption.code ? "bg-[#DDF4FF] text-[#1CB0F6]" : ""
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{courseOption.flag}</span>
                  <span>{courseOption.label}</span>
                </div>
                {courseOption.isExp && (
                  <span className="bg-[#FF4B4B] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0 tracking-tight leading-none">
                    EXP
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Advertencia Experimental del Griego (Backdrop borroso) */}
      {showGreekWarning && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border-2 border-[#E5E5E5] max-w-md w-full p-6 lg:p-8 space-y-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-[#FFF5F5] border-2 border-[#FF4B4B] text-[#FF4B4B] rounded-2xl shadow-[0_4px_0_0_#CC3C3C] animate-bounce">
                <AlertTriangle size={36} />
              </div>
              <h3 className="text-lg lg:text-xl font-black text-[#4B4B4B] uppercase tracking-wide">
                ¡SECCIÓN EXPERIMENTAL!
              </h3>
              <p className="text-xs lg:text-sm text-[#777777] font-bold leading-relaxed">
                Ten en cuenta que al ser una sección experimental de griego koiné, puede cambiar absolutamente todo en un futuro, incluyendo lecciones, niveles o incluso eliminarse por completo.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setDismissedGreekWarning(true);
                  setShowGreekWarning(false);
                  setCourse("greek");
                  router.push("/learn?course=greek");
                }}
                className="w-full py-3 rounded-2xl bg-[#FF4B4B] text-white font-black text-xs uppercase tracking-widest shadow-[0_4px_0_0_#CC3C3C] active:translate-y-[2px] active:shadow-[0_2px_0_0_#CC3C3C] transition-all text-center select-none cursor-pointer"
              >
                ENTENDIDO Y ACEPTAR
              </button>
              <button
                onClick={() => {
                  setShowGreekWarning(false);
                  setCourse("hebrew");
                  router.push("/learn?course=hebrew");
                }}
                className="w-full py-3 rounded-2xl bg-white border-2 border-[#E5E5E5] text-[#777777] hover:bg-[#F7F7F7] font-black text-xs uppercase tracking-widest shadow-[0_4px_0_0_#E5E5E5] active:translate-y-[2px] active:shadow-[0_2px_0_0_#E5E5E5] transition-all text-center select-none cursor-pointer"
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1.5 px-4 overflow-y-auto no-scrollbar pt-0 pb-2">
        {sidebarItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          const isQuizzes = item.href === "/quizzes";
          const showBadge = isQuizzes && pendingQuizzesCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center font-black rounded-xl transition-all border-2 border-transparent uppercase text-sm tracking-wide group relative",
                isActive
                  ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]"
                  : "text-[#777777] hover:bg-[#F7F7F7]",
                isSidebarCollapsed ? "justify-center p-2.5" : "gap-4 px-4 py-2.5",
              )}
              title={isSidebarCollapsed ? item.label : ""}
            >
              <div className="relative">
                <item.icon
                  className={cn("w-7 h-7 shrink-0", isActive ? "text-[#1CB0F6]" : "text-[#777777]")}
                />
                {showBadge && isSidebarCollapsed && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4B4B] text-[9px] font-black text-white ring-2 ring-white animate-pulse">
                    {pendingQuizzesCount}
                  </span>
                )}
              </div>
              {!isSidebarCollapsed && <span className="flex-1">{item.label}</span>}
              {showBadge && !isSidebarCollapsed && (
                <span className="ml-auto bg-[#FF4B4B] text-white text-[10px] font-black px-2 py-0.5 rounded-full ring-2 ring-[#FF4B4B]/20 animate-pulse">
                  {pendingQuizzesCount}
                </span>
              )}
            </Link>
          );
        })}

        {user?.role === "teacher" &&
          teacherItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center font-black rounded-xl transition-all border-2 border-transparent uppercase text-sm tracking-wide group",
                  isActive
                    ? "bg-[#FFF5E5] border-[#FF9600] text-[#FF9600]"
                    : "text-[#777777] hover:bg-[#F7F7F7]",
                  isSidebarCollapsed ? "justify-center p-2.5" : "gap-4 px-4 py-2.5",
                )}
                title={isSidebarCollapsed ? item.label : ""}
              >
                <item.icon
                  className={cn("w-7 h-7 shrink-0", isActive ? "text-[#FF9600]" : "text-[#777777]")}
                />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

        <div className="py-1">
          <button
            onClick={toggleLowEnergyMode}
             className={cn(
              "flex items-center font-black rounded-xl transition-all border-2 border-transparent uppercase text-sm tracking-wide",
              isLowEnergyMode
                ? "bg-[#FFF9E5] border-[#FFC800] text-[#FFC800]"
                : "text-[#777777] hover:bg-[#F7F7F7]",
              isSidebarCollapsed ? "justify-center p-2.5" : "gap-4 px-4 py-2.5 w-full",
            )}
            title={
              isSidebarCollapsed ? (isLowEnergyMode ? "Modo Energía ON" : "Modo Energía OFF") : ""
            }
          >
            {isLowEnergyMode ? (
              <BatteryLow className="w-7 h-7 shrink-0" />
            ) : (
              <BatteryFull className="w-7 h-7 shrink-0" />
            )}
            {!isSidebarCollapsed && (
              <span>{isLowEnergyMode ? t("settings.energyOn") : t("settings.energyOff")}</span>
            )}
          </button>
        </div>

        {sidebarItems.slice(4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center font-black rounded-xl transition-all border-2 border-transparent uppercase text-sm tracking-wide group",
                isActive
                  ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]"
                  : "text-[#777777] hover:bg-[#F7F7F7]",
                isSidebarCollapsed ? "justify-center p-2.5" : "gap-4 px-4 py-2.5",
              )}
              title={isSidebarCollapsed ? item.label : ""}
            >
              <item.icon
                className={cn("w-7 h-7 shrink-0", isActive ? "text-[#1CB0F6]" : "text-[#777777]")}
              />
              {!isSidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div
          className={cn(
            "mt-auto p-4 border-t-2 border-[#E5E5E5] transition-all duration-300",
            isSidebarCollapsed ? "flex justify-center" : "",
          )}
        >
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center font-black text-[#777777] hover:text-[#FF4B4B] hover:bg-[#FFF5F5] rounded-xl transition-all uppercase text-sm tracking-wide",
              isSidebarCollapsed ? "p-2.5" : "gap-4 px-4 py-2.5 w-full",
            )}
            title={isSidebarCollapsed ? t("sidebar.logout") : ""}
          >
            <LogOut className="w-7 h-7 shrink-0" />
            {!isSidebarCollapsed && <span>{t("sidebar.logout")}</span>}
          </button>
        </div>
      )}
    </div>
  );
}
