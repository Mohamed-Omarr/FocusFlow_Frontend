"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type LangType = "en" | "ar" | "tr"; // more type-safe than string

interface LanguageState {
  lang: LangType;
  setLang: (lang: LangType) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: "en", // default
      setLang: (lang) => set({ lang }),
    }),
    {
      name: "language", // localStorage key
    }
  )
);
