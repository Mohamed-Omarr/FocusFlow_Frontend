"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  sessionId: string;
  onComplete: () => void;
};

const ENERGY_LEVELS = [
  { value: "low", label: "Low", color: "from-red-600 to-red-500" },
  { value: "medium", label: "Medium", color: "from-yellow-500 to-yellow-400" },
  { value: "high", label: "High", color: "from-green-500 to-green-400" },
];

const MOODS = [
  { value: "tired", label: "Tired", color: "from-gray-600 to-gray-500" },
  { value: "neutral", label: "Neutral", color: "from-blue-600 to-blue-500" },
  { value: "focused", label: "Focused", color: "from-indigo-600 to-indigo-500" },
  { value: "energized", label: "Energized", color: "from-green-600 to-green-500" },
  { value: "distracted", label: "Distracted", color: "from-orange-500 to-orange-400" },
];

export function SessionCheckinForm({ sessionId, onComplete }: Props) {
  const [energyLevel, setEnergyLevel] = useState<string>("medium");
  const [mood, setMood] = useState<string>("focused");

  const handleSubmit = () => {
    const checkin = {
      id: crypto.randomUUID(),
      sessionId,
      energyLevel,
      mood,
      createdAt: new Date().toISOString(),
    };
    storage.addCheckin(checkin);
    onComplete();
  };

  return (
    <div className="place-self-center">
      <Card className="max-w-lg w-full shadow-xl rounded-3xl border-0 overflow-hidden bg-gray-900">
        <CardHeader className="text-center bg-gray-900 pb-6">
          <CardTitle className="text-3xl font-bold text-white">Session Check-In</CardTitle>
          <p className="text-gray-400 mt-2 text-sm">Track your current energy and mood</p>
        </CardHeader>

        <CardContent className="space-y-10 p-6">
          {/* Energy Level */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Energy Level</h3>
            <div className="grid grid-cols-3 gap-4">
              {ENERGY_LEVELS.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setEnergyLevel(value)}
                  aria-pressed={energyLevel === value}
                  className={cn(
                    "flex items-center justify-center p-5 rounded-2xl font-medium transition-all duration-300 text-white",
                    energyLevel === value
                      ? `bg-gradient-to-tr ${color} scale-105 shadow-lg`
                      : "bg-gray-800 hover:bg-gray-700"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Mood</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MOODS.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => setMood(value)}
                  aria-pressed={mood === value}
                  className={cn(
                    "flex items-center justify-center p-5 rounded-2xl font-medium transition-all duration-300 text-white",
                    mood === value
                      ? `bg-gradient-to-tr ${color} scale-105 shadow-lg`
                      : "bg-gray-800 hover:bg-gray-700"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={onComplete}
              size="lg"
              className="px-8 py-3 rounded-xl border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3 rounded-xl shadow-lg"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
