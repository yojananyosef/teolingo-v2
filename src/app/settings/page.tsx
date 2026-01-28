"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, User as UserIcon, CheckCircle2, X } from "lucide-react";
import { updateProfileAction, deleteAccountAction, logoutAction } from "@/features/auth/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function SettingsPage() {
  const { user, setAuth, token } = useAuthStore();
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
        toast.success("Perfil actualizado");
        setIsEditingName(false);
      } else {
        toast.error(result.error || "Error al actualizar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setIsPending(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.")) {
      return;
    }

    setIsPending(true);
    try {
      const result = await deleteAccountAction();
      if (result.success) {
        setAuth(null, null);
        router.push("/auth/login");
        toast.success("Cuenta eliminada correctamente");
      } else {
        toast.error(result.error || "Error al eliminar cuenta");
      }
    } catch (error) {
      toast.error("Error de conexión");
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
          <h1 className="text-xl lg:text-4xl font-black text-[#4B4B4B] uppercase tracking-tight">Configuración</h1>
        </div>
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto px-6 py-2.5 text-[10px] lg:text-sm font-black text-[#FF4B4B] hover:bg-[#FFF5F5] rounded-xl lg:rounded-2xl transition-colors uppercase tracking-widest border-2 border-transparent hover:border-[#FF4B4B]"
        >
          Cerrar sesión
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
                <h3 className="text-xs lg:text-sm font-black text-[#4B4B4B] uppercase tracking-wide">Nombre de perfil</h3>
                {isEditingName ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1.5 lg:mt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1 sm:w-64 px-3 py-1.5 border-2 border-[#E5E5E5] rounded-xl outline-none focus:border-[#1CB0F6] font-bold text-[#4B4B4B] text-sm lg:text-base"
                        autoFocus
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
                  <p className="text-[#777777] font-bold text-xs lg:text-base">{user.displayName}</p>
                )}
              </div>
            </div>
            {!isEditingName && (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-[10px] lg:text-sm font-black text-[#1CB0F6] uppercase tracking-widest hover:bg-[#DDF4FF] px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl transition-colors text-center"
              >
                Editar
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
                <h3 className="text-xs lg:text-sm font-black text-[#4B4B4B] uppercase tracking-wide">Notificaciones</h3>
                <p className="text-[#777777] font-bold text-xs lg:text-base">Recordatorios diarios</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={cn(
                "w-10 lg:w-12 h-5 lg:h-6 rounded-full transition-colors relative",
                notifications ? "bg-[#58CC02]" : "bg-[#E5E5E5]"
              )}
            >
              <div className={cn(
                "absolute top-0.5 lg:top-1 w-4 h-4 bg-white rounded-full transition-all",
                notifications ? "left-5.5 lg:left-7" : "left-0.5 lg:left-1"
              )} />
            </button>
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
                <h3 className="text-xs lg:text-sm font-black text-[#4B4B4B] uppercase tracking-wide">Cuenta</h3>
                <p className="text-[#777777] font-bold text-[10px] lg:text-base">Eliminar mi cuenta permanentemente</p>
              </div>
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={isPending}
              className="text-[10px] lg:text-sm font-black text-[#FF4B4B] uppercase tracking-widest hover:bg-[#FFF5F5] px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg lg:rounded-xl transition-colors disabled:opacity-50 text-center"
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
