"use client";

import { logoutAction } from "@/features/auth/actions";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import {
  BatteryFull,
  BatteryLow,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  LogOut,
  Menu,
  Music,
  Settings,
  Star,
  Trophy,
  User as UserIcon,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const sidebarItems = [
  { icon: Home, label: "Aprender", href: "/learn" },
  { icon: Star, label: "Modo Israelí", href: "/modes/israeli" },
  { icon: BookOpen, label: "Práctica", href: "/practice" },
  { icon: Music, label: "Inmersión", href: "/immerse" },
  { icon: Heart, label: "Anclas", href: "/anchor-texts" },
  { icon: Zap, label: "Flashcards", href: "/practice/flashcards" },
  { icon: UserIcon, label: "Perfil", href: "/profile" },
  { icon: Settings, label: "Configuración", href: "/settings" },
];

export function Sidebar({
  className,
  isMobile = false,
}: { className?: string; isMobile?: boolean }) {
  const { user, setAuth } = useAuthStore();
  const { isLowEnergyMode, toggleLowEnergyMode, isSidebarCollapsed, toggleSidebar } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    setAuth(null, null);
    router.push("/auth/login");
  };

  const primaryMobileItems = sidebarItems.slice(0, 4);
  const secondaryMobileItems = sidebarItems.slice(4);

  if (isMobile) {
    return (
      <div className="flex w-full h-full">
        {primaryMobileItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all",
                isActive ? "text-[#1CB0F6]" : "text-[#777777]",
              )}
            >
              <item.icon
                className={cn("w-6 h-6", isActive ? "text-[#1CB0F6]" : "text-[#777777]")}
              />
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
                {/* Flashcards */}
                {secondaryMobileItems.slice(0, 1).map((item) => (
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

                {/* Perfil and Configuración */}
                {secondaryMobileItems.slice(1).map((item) => (
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
                    CERRAR SESIÓN
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
          "flex items-center gap-2 mb-10 pt-8 transition-all duration-300",
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

      <nav className="flex-1 space-y-2 px-4">
        {sidebarItems.slice(0, 5).map((item) => {
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
                isSidebarCollapsed ? "justify-center p-3" : "gap-4 px-4 py-3",
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

        <div className="py-2">
          <button
            onClick={toggleLowEnergyMode}
            className={cn(
              "flex items-center font-black rounded-xl transition-all border-2 border-transparent uppercase text-sm tracking-wide",
              isLowEnergyMode
                ? "bg-[#FFF9E5] border-[#FFC800] text-[#FFC800]"
                : "text-[#777777] hover:bg-[#F7F7F7]",
              isSidebarCollapsed ? "justify-center p-3" : "gap-4 px-4 py-3 w-full",
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
            {!isSidebarCollapsed && <span>{isLowEnergyMode ? "Energía ON" : "Energía OFF"}</span>}
          </button>
        </div>

        {sidebarItems.slice(5).map((item) => {
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
                isSidebarCollapsed ? "justify-center p-3" : "gap-4 px-4 py-3",
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
              isSidebarCollapsed ? "p-3" : "gap-4 px-4 py-3 w-full",
            )}
            title={isSidebarCollapsed ? "Cerrar Sesión" : ""}
          >
            <LogOut className="w-7 h-7 shrink-0" />
            {!isSidebarCollapsed && <span>CERRAR SESIÓN</span>}
          </button>
        </div>
      )}
    </div>
  );
}
