"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, User as UserIcon, Loader2 } from "lucide-react";
import { updateProfileAction, deleteAccountAction, logoutAction } from "@/features/auth/actions";
import { toast } from "sonner";

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
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-[#1CB0F6] text-white rounded-3xl shadow-[0_4px_0_0_#1899D6]">
            <SettingsIcon size={40} />
          </div>
          <h1 className="text-4xl font-black text-[#4B4B4B] uppercase tracking-tight">Configuración</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 text-sm font-black text-[#FF4B4B] hover:bg-[#FFF5F5] rounded-2xl transition-colors uppercase tracking-widest border-2 border-transparent hover:border-[#FF4B4B]"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border-2 border-[#E5E5E5] overflow-hidden">
        {/* Profile Setting */}
        <div className="p-8 border-b-2 border-[#E5E5E5]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-[#DDF4FF] text-[#1CB0F6] rounded-2xl">
                <UserIcon size={28} />
              </div>
              <div className="flex-1">
                <div className="font-black text-xl text-[#4B4B4B] uppercase tracking-tight">Nombre de usuario</div>
                {isEditingName ? (
                  <div className="flex items-center gap-3 mt-4">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="px-4 py-2 border-2 border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#1CB0F6] font-bold text-lg"
                      autoFocus
                    />
                    <button
                      onClick={handleUpdateName}
                      disabled={isPending}
                      className="px-6 py-2 bg-[#58CC02] text-white font-black rounded-xl border-b-4 border-[#46A302] hover:bg-[#61E002] active:translate-y-1 active:border-b-0 disabled:opacity-50 uppercase tracking-widest text-sm"
                    >
                      {isPending ? <Loader2 size={18} className="animate-spin" /> : "Guardar"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setNewName(user.displayName);
                      }}
                      className="px-4 py-2 font-black text-[#AFAFAF] hover:text-[#777777] uppercase tracking-widest text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="text-lg text-[#777777] font-bold mt-1">{user.displayName}</div>
                )}
              </div>
            </div>
            {!isEditingName && (
              <button
                onClick={() => setIsEditingName(true)}
                className="px-6 py-2 font-black text-[#1CB0F6] hover:bg-[#DDF4FF] rounded-xl transition-colors uppercase tracking-widest text-sm border-2 border-[#1CB0F6]"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        {/* Notifications Setting */}
        <div className="p-8 border-b-2 border-[#E5E5E5] flex items-center justify-between hover:bg-[#F7F7F7] transition-colors">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#FFF5E5] text-[#FF9600] rounded-2xl">
              <Bell size={28} />
            </div>
            <div>
              <div className="font-black text-xl text-[#4B4B4B] uppercase tracking-tight">Notificaciones</div>
              <div className="text-lg text-[#777777] font-bold mt-1">Recordatorios de estudio y alertas</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)}
              className="sr-only peer" 
            />
            <div className="w-14 h-8 bg-[#E5E5E5] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#58CC02]"></div>
          </label>
        </div>

        {/* Privacy Setting */}
        <div className="p-8 flex items-center justify-between hover:bg-[#F7F7F7] transition-colors cursor-pointer">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-[#D7FFB7] text-[#58CC02] rounded-2xl">
              <Shield size={28} />
            </div>
            <div>
              <div className="font-black text-xl text-[#4B4B4B] uppercase tracking-tight">Privacidad</div>
              <div className="text-lg text-[#777777] font-bold mt-1">Gestiona tus datos y visibilidad</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF5F5] p-8 rounded-[2rem] border-2 border-[#FF4B4B] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="font-black text-2xl text-[#FF4B4B] uppercase tracking-tight">Eliminar cuenta</div>
          <div className="text-lg text-[#FF4B4B] font-bold mt-1 opacity-80">Esta acción es permanente y no se puede deshacer</div>
        </div>
        <button 
          onClick={handleDeleteAccount}
          disabled={isPending}
          className="w-full md:w-auto px-10 py-4 bg-[#FF4B4B] text-white font-black rounded-2xl border-b-8 border-[#CC3C3C] hover:bg-[#FF5C5C] active:translate-y-1 active:border-b-0 transition-all uppercase tracking-widest text-lg disabled:opacity-50"
        >
          {isPending ? <Loader2 size={24} className="animate-spin" /> : "Eliminar mi cuenta"}
        </button>
      </div>
    </div>
  );
}
