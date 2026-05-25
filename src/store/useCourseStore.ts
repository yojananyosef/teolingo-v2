import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CourseType = "hebrew" | "greek";

interface CourseState {
  activeCourse: CourseType;
  hasDismissedGreekWarning: boolean;
  setCourse: (course: CourseType) => void;
  setDismissedGreekWarning: (dismissed: boolean) => void;
  resetCourse: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      activeCourse: "hebrew",
      hasDismissedGreekWarning: false,

      setCourse: (activeCourse) => set({ activeCourse }),
      setDismissedGreekWarning: (hasDismissedGreekWarning) => set({ hasDismissedGreekWarning }),
      resetCourse: () => set({ activeCourse: "hebrew", hasDismissedGreekWarning: false }),
    }),
    {
      name: "teolingo-course",
    }
  )
);
