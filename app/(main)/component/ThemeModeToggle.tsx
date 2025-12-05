"use client";

import { Button } from "@/components/ui/button";
import { useThemeModeStore } from "@/store/theme_mode/theme-mode";
import { Sun, Moon } from "lucide-react";

export function ThemeModeToggle() {
  const mode = useThemeModeStore((s) => s.mode);
  const setMode = useThemeModeStore((s) => s.setMode);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      className="p-2 rounded-full"
      aria-label="Toggle theme"
    >
      {mode === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}
