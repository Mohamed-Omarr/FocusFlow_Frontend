"use client";

import { useState, useRef, useEffect } from "react";

export const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "AR", label: "Arabic" },
  { code: "TR", label: "Turkish" },
];

interface LanguageSelectorProps {
  selected: string;
  onChange: (lang: string) => void;
}

export function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setOpen(!open);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="px-3 py-1.5 bg-elevated border border-border rounded-lg text-sm text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {selected}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onChange(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-2 transition-colors ${
                selected === lang.code ? "bg-primary/10 font-semibold" : "hover:bg-primary/5"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
