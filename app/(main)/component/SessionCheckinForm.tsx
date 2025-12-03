"use client";

import { useState } from "react";
import { Clock, AlertCircle, Sparkles } from "lucide-react";

type Step = "extend" | "distraction" | "mood" | "complete";
type DistractionType = "Phone" | "Social Media" | "Noise" | "Environment" | "Other";
type EnergyLevel = "Low" | "Medium" | "High";
type Mood = "Focused" | "Tired" | "Neutral" | "Distracted";

interface PostSessionProps {
  sessionId: string;
  onExtend: (minutes: number) => void; // callback to start extended session
  onEnd: () => void; // callback after session + form complete
}

export function PostSession({ onExtend, onEnd }: PostSessionProps) {
  const [currentStep, setCurrentStep] = useState<Step>("extend");

  // Extend Session
  const [extendMinutes, setExtendMinutes] = useState(25);

  // Distraction Logger
  const [selectedDistractions, setSelectedDistractions] = useState<DistractionType[]>([]);
  const [distractionDuration, setDistractionDuration] = useState(5);
  const [intensity, setIntensity] = useState(3);
  const [distractionNote, setDistractionNote] = useState("");

  // Mood / Energy
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  const intensityColors = ["bg-emerald-500", "bg-lime-500", "bg-yellow-500", "bg-orange-500", "bg-red-500"];
  const moodEmojis: Record<Mood, string> = {
    Focused: "😊",
    Tired: "😓",
    Neutral: "😐",
    Distracted: "😕",
  };

  // --- Handlers ---
  const handleExtendSession = () => {
    onExtend(extendMinutes);
  };

  const handleEndSession = () => setCurrentStep("distraction");

  const toggleDistraction = (type: DistractionType) => {
    setSelectedDistractions((prev) => prev.includes(type) ? prev.filter(d => d !== type) : [...prev, type]);
  };

  const handleSaveDistraction = () => setCurrentStep("mood");
  const handleSkipDistraction = () => setCurrentStep("mood");

  const handleSubmitMood = () => setCurrentStep("complete");
  const handleSkipMood = () => setCurrentStep("complete");

  const handleGoHome = () => {
    onEnd(); // notify ActiveSessionPage to go home
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">

      {/* --- Step 1: Extend Session --- */}
      {currentStep === "extend" && (
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 shadow-2xl border border-border text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
          <p className="text-muted-foreground mb-6">Do you want to extend the session or end it?</p>

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

      {/* --- Step 2: Distraction Logger --- */}
      {currentStep === "distraction" && (
        <div className="w-full max-w-2xl bg-card rounded-3xl p-8 shadow-2xl border border-border">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-3">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">What distracted you?</h2>
            <p className="text-muted-foreground">Record any distractions to improve focus.</p>
          </div>

          {/* Distraction Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Distraction Type</label>
            <div className="flex flex-wrap gap-2">
              {(["Phone","Social Media","Noise","Environment","Other"] as DistractionType[]).map(type => (
                <button
                  key={type}
                  onClick={() => toggleDistraction(type)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${selectedDistractions.includes(type) ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Intensity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Duration (minutes): {distractionDuration}</label>
            <input
              type="range"
              min="1"
              max="60"
              value={distractionDuration}
              onChange={(e) => setDistractionDuration(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Intensity</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(level => (
                <button
                  key={level}
                  onClick={() => setIntensity(level)}
                  className={`w-12 h-12 rounded-full transition-all ${intensity >= level ? intensityColors[level-1] : "bg-muted"} hover:scale-110`}
                />
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div className="mb-6">
            <textarea
              value={distractionNote}
              onChange={(e) => setDistractionNote(e.target.value)}
              placeholder="Additional notes..."
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSaveDistraction} className="flex-1 py-3 px-6 bg-primary text-white rounded-xl font-semibold hover:scale-105 transition">Save</button>
            <button onClick={handleSkipDistraction} className="py-3 px-6 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition">Skip</button>
          </div>
        </div>
      )}

      {/* --- Step 3: Mood & Energy --- */}
      {currentStep === "mood" && (
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 shadow-2xl border border-border">
          <h2 className="text-2xl font-bold mb-2 text-center">How do you feel after this session?</h2>
          <p className="text-muted-foreground text-center mb-6">Your mood & energy help personalize insights.</p>

          {/* Energy Level */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Energy Level</label>
            <div className="grid grid-cols-3 gap-3">
              {(["Low","Medium","High"] as EnergyLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setEnergy(level)}
                  className={`py-4 px-6 rounded-2xl font-semibold transition-all ${energy===level ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105" : "bg-muted text-foreground hover:bg-muted/80"}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Mood</label>
            <div className="grid grid-cols-2 gap-3">
              {(["Focused","Tired","Neutral","Distracted"] as Mood[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`py-4 px-6 rounded-2xl font-medium flex items-center justify-center gap-2 transition-all ${mood===m ? "bg-primary text-white shadow-lg scale-105" : "bg-muted text-foreground hover:bg-muted/80"}`}
                >
                  <span className="text-2xl">{moodEmojis[m]}</span>
                  <span>{m}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSubmitMood} className="flex-1 py-3 px-6 bg-primary text-white rounded-xl font-semibold hover:scale-105 transition">Submit</button>
            <button onClick={handleSkipMood} className="py-3 px-6 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition">Skip</button>
          </div>
        </div>
      )}

      {/* --- Step 4: Complete --- */}
      {currentStep === "complete" && (
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 shadow-2xl border border-border text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-4">
            <Sparkles className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">All Done!</h2>
          <p className="text-muted-foreground mb-6">Your session data is saved. Great job!</p>
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
