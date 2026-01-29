import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isLowEnergyMode: boolean;
  toggleLowEnergyMode: () => void;
  isIMEMode: boolean;
  toggleIMEMode: () => void;
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isLowEnergyMode: false,
      toggleLowEnergyMode: () => set((state) => ({ isLowEnergyMode: !state.isLowEnergyMode })),
      isIMEMode: true, // IME mode active by default for Teolingo 2.0
      toggleIMEMode: () => set((state) => ({ isIMEMode: !state.isIMEMode })),
      isSidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    {
      name: "teolingo-ui-storage",
    }
  )
);
