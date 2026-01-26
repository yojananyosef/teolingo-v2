"use client";

import Link from "next/link";
import { Home, BookOpen, Trophy, User as UserIcon, Settings, Flame, Star, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";

const sidebarItems = [
  { icon: Home, label: "Aprender", href: "/learn" },
  { icon: BookOpen, label: "Práctica", href: "/practice" },
  { icon: Trophy, label: "Clasificación", href: "/leaderboard" },
  { icon: UserIcon, label: "Perfil", href: "/profile" },
  { icon: Settings, label: "Configuración", href: "/settings" },
];

export function Sidebar({ className }: { className?: string }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className={cn("flex flex-col h-full border-r-2 border-[#E5E5E5] bg-white w-64 p-4", className)}>
      <div className="flex items-center gap-2 px-4 mb-10 pt-4">
        <span className="text-3xl font-black text-[#58CC02] tracking-tighter">teolingo</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 font-black rounded-xl transition-all border-2 border-transparent uppercase text-sm tracking-wide",
                isActive 
                  ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]" 
                  : "text-[#777777] hover:bg-[#F7F7F7]"
              )}
            >
              <item.icon className={cn("w-7 h-7", isActive ? "text-[#1CB0F6]" : "text-[#777777]")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="mt-auto p-4 border-t-2 border-[#E5E5E5]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 font-black text-[#777777] hover:text-[#FF4B4B] hover:bg-[#FFF5F5] rounded-xl transition-all uppercase text-sm tracking-wide"
          >
            <LogOut className="w-7 h-7" />
            CERRAR SESIÓN
          </button>
        </div>
      )}
    </div>
  );
}
