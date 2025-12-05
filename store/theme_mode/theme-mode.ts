"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ModeType = "dark" | "light"; // more type-safe than string

interface ThemeModeState {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
}

export const useThemeModeStore = create<ThemeModeState>()(
  persist(
    (set) => ({
      mode: "dark", // default
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "mode", // localStorage key
    }
  )
);
