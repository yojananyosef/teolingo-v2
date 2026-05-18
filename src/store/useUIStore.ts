import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  isLowEnergyMode: boolean;
  toggleLowEnergyMode: () => void;
  isIMEMode: boolean;
  toggleIMEMode: () => void;
  isRandomExerciseOrder: boolean;
  toggleRandomExerciseOrder: () => void;
  setRandomExerciseOrder: (enabled: boolean) => void;
  isAutoPlayExerciseAudioEnabled: boolean;
  toggleAutoPlayExerciseAudio: () => void;
  setAutoPlayExerciseAudio: (enabled: boolean) => void;
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
      isRandomExerciseOrder: false,
      toggleRandomExerciseOrder: () =>
        set((state) => ({ isRandomExerciseOrder: !state.isRandomExerciseOrder })),
      setRandomExerciseOrder: (enabled) => set({ isRandomExerciseOrder: enabled }),
      isAutoPlayExerciseAudioEnabled: true,
      toggleAutoPlayExerciseAudio: () =>
        set((state) => ({
          isAutoPlayExerciseAudioEnabled: !state.isAutoPlayExerciseAudioEnabled,
        })),
      setAutoPlayExerciseAudio: (enabled) => set({ isAutoPlayExerciseAudioEnabled: enabled }),
      isSidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    {
      name: "teolingo-ui-storage",
    },
  ),
);
