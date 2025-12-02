"use client";

import { useState } from "react";

const moods = [
  { emoji: "😊", label: "Great" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😕", label: "Low" },
  { emoji: "😭", label: "Tough" },
];

export function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <div className="flex justify-center gap-4">
      {moods.map((mood, index) => {
        const isSelected = selectedMood === index;

        return (
          <button
            key={index}
            onClick={() => setSelectedMood(index)}
            aria-label={mood.label}
            className={`text-4xl transition-transform duration-300 
                        ${isSelected ? "scale-125" : "scale-100 opacity-60 hover:scale-110 hover:opacity-100"}`}
          >
            {mood.emoji}
          </button>
        );
      })}
    </div>
  );
}
