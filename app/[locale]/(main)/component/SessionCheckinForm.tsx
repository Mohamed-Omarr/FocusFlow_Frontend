"use client";

import { useState } from "react";
import {
  Clock,
  AlertCircle,
  Sparkles,
  Phone,
  MessageSquare,
  Volume2,
  Wind,
  HelpCircle,
} from "lucide-react";

type Step = "extend" | "distraction" | "mood" | "complete";
type DistractionType =
  | "Phone"
  | "Social Media"
  | "Noise"
  | "Environment"
  | "Other";
type EnergyLevel = "Low" | "Medium" | "High";
type Mood = "Focused" | "Tired" | "Neutral" | "Distracted";

interface PostSessionProps {
  sessionId?: string;
  onExtend: (minutes: number) => void;
  onEnd: () => void;
}

// ✅ FIX #1: Icons for each distraction type
const distractionIcons: Record<DistractionType, any> = {
  Phone: Phone,
  "Social Media": MessageSquare,
  Noise: Volume2,
  Environment: Wind,
  Other: HelpCircle,
};

export function PostSession({ onExtend, onEnd }: PostSessionProps) {
  const [showDistractionModal,setShowDistractionModal] = useState(false)
  
  
  const [currentStep, setCurrentStep] = useState<Step>("extend");

  // Extend Session
  const [extendMinutes, setExtendMinutes] = useState(1);

  // Distraction Logger
  const [selectedDistractions, setSelectedDistractions] = useState<
    DistractionType[]
  >([]);
  const [distractionDuration, setDistractionDuration] = useState(5);
  const [intensity, setIntensity] = useState(3);
  const [distractionNote, setDistractionNote] = useState("");

  // ✅ FIX #2: Missing state for "Other" text
  const [otherDistractionText, setOtherDistractionText] = useState("");

  // Mood / Energy
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  const moodEmojis: Record<Mood, string> = {
    Focused: "😊",
    Tired: "😓",
    Neutral: "😐",
    Distracted: "😕",
  };

  const handleExtendSession = () => onExtend(extendMinutes);
  const handleEndSession = () => setCurrentStep("distraction");

  const toggleDistraction = (type: DistractionType) => {
    setSelectedDistractions((prev) =>
      prev.includes(type) ? prev.filter((d) => d !== type) : [...prev, type]
    );
  };

  const handleSaveDistraction = () => setCurrentStep("mood");
  const handleSkipDistraction = () => setCurrentStep("mood");

  const handleSubmitMood = () => setCurrentStep("complete");
  const handleSkipMood = () => setCurrentStep("complete");

  const handleGoHome = () => onEnd();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* --- Step 1: Extend Session --- */}
      {currentStep === "extend" && (
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 shadow-2xl border border-border text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
          <p className="text-muted-foreground mb-6">
            Do you want to extend the session or end it?
          </p>

          <div className="mb-4 flex gap-2 justify-center">
            <input
              type="number"
              min={1}
              value={extendMinutes}
              onChange={(e) => setExtendMinutes(Number(e.target.value))}
              className="w-24 px-3 py-2 rounded-xl border border-border text-center"
            />
            <span className="text-foreground py-2">minutes</span>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleExtendSession}
              className="px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:scale-105 transition"
            >
              <Clock className="inline w-5 h-5 mr-1 mb-0.5" /> Extend
            </button>
            <button
              onClick={handleEndSession}
              className="px-6 py-3 bg-muted text-foreground rounded-2xl font-medium hover:bg-muted/80 transition"
            >
              End
            </button>
          </div>
        </div>
      )}

      {/* --- Step 2: Distraction Logger (Improved / Smaller) --- */}
      {currentStep === "distraction" && (
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-card rounded-2xl p-6 shadow-xl border border-border">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/15 mb-3 border border-orange-400/20">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-1">
                Distraction Tracker
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                Quickly note what distracted you. This helps build better focus
                habits.
              </p>
            </div>

            {/* Distraction Selection */}
            <label className="block text-sm font-medium text-foreground mb-2">
              What distracted you?
            </label>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {(
                [
                  "Phone",
                  "Social Media",
                  "Noise",
                  "Environment",
                  "Other",
                ] as DistractionType[]
              ).map((type) => {
                const Icon = distractionIcons[type];
                const isSelected = selectedDistractions.includes(type);

                return (
                  <button
                    key={type}
                    onClick={() => toggleDistraction(type)}
                    className={`p-3 rounded-xl text-sm border flex flex-col items-center gap-1 transition ${
                      isSelected
                        ? "bg-orange-500 text-white border-orange-600 shadow-sm"
                        : "bg-muted/40 text-foreground border-border hover:bg-muted"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? "text-white" : "text-orange-500"
                      }`}
                    />
                    {type}
                  </button>
                );
              })}
            </div>

            {/* Other text */}
            {selectedDistractions.includes("Other") && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Describe briefly
                </label>
                <textarea
                  value={otherDistractionText}
                  onChange={(e) => setOtherDistractionText(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-background border border-border placeholder:text-muted-foreground resize-none"
                  rows={2}
                  placeholder="What was the distraction?"
                />
              </div>
            )}

            {/* Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={distractionDuration}
                onChange={(e) => setDistractionDuration(Number(e.target.value))}
                className="w-28 px-3 py-2 text-sm rounded-xl bg-background border border-border"
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-1">
                Additional notes{" "}
                <span className="text-muted-foreground">(optional)</span>
              </label>
              <textarea
                value={distractionNote}
                onChange={(e) => setDistractionNote(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl bg-muted/40 border border-border placeholder:text-muted-foreground resize-none"
                rows={3}
                placeholder="Any patterns or details?"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveDistraction}
                disabled={selectedDistractions.length === 0}
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold shadow-sm hover:scale-[1.02] transition disabled:opacity-50 disabled:hover:scale-100"
              >
                Save
              </button>
              <button
                onClick={handleSkipDistraction}
                className="py-3 px-4 bg-muted text-foreground rounded-xl text-sm border border-border hover:bg-muted/80"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Step 3: Mood & Energy --- */}
      {currentStep === "mood" && (
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 shadow-2xl border border-border">
          <h2 className="text-2xl font-bold mb-2 text-center">
            How do you feel after this session?
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            Your mood & energy help personalize insights.
          </p>

          {/* Energy Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Energy Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["Low", "Medium", "High"] as EnergyLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setEnergy(level)}
                  className={`py-4 px-6 rounded-2xl font-semibold transition-all ${
                    energy === level
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Mood
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["Focused", "Tired", "Neutral", "Distracted"] as Mood[]).map(
                (m) => (
                  <button
                    key={m}
                    onClick={() => setMood(m)}
                    className={`py-4 px-6 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all ${
                      mood === m
                        ? "bg-primary text-white shadow-lg scale-105"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <span className="text-2xl">{moodEmojis[m]}</span>
                    <span>{m}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Submit (Disabled until BOTH mood + energy selected) */}
          <button
            onClick={handleSubmitMood}
            disabled={!mood || !energy}
            className="w-full py-3 px-6 bg-primary text-white rounded-xl font-semibold transition
        hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            Submit
          </button>
        </div>
      )}

      {/* --- Step 4: Complete --- */}
      {currentStep === "complete" && (
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 shadow-2xl border border-border text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-4">
            <Sparkles className="w-10 h-10 text-emerald-500" />
          </div>

          <h2 className="text-3xl font-bold mb-2">All Done!</h2>
          <p className="text-muted-foreground mb-6">
            Your session data is saved. Great job!
          </p>

          <button
            onClick={handleGoHome}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:scale-105 transition"
          >
            Go Home
          </button>
        </div>
      )}
    </div>
  );
}
