"use client";

import { useState } from "react";
import {
  Clock,
  Sparkles,
  Phone,
  MessageSquare,
  Volume2,
  Wind,
  // HelpCircle,
} from "lucide-react";
import { extend_session, finish_active_session } from "../helper";

type Step = "extend" | "distraction" | "mood" | "complete";

type DistractionType =
  | "Phone"
  | "Social Media"
  | "Noise"
  | "Environment"
  // | "Other";

type EnergyLevel = "Low" | "Medium" | "High";
type Mood = "Focused" | "Tired" | "Neutral" | "Distracted";


const distractionIcons: Record<DistractionType, any> = {
  Phone,
  "Social Media": MessageSquare,
  Noise: Volume2,
  Environment: Wind,
  // Other: HelpCircle,
};

export function SessionCheckoutForm({sessionId}:{sessionId:string}) {
  const [currentStep, setCurrentStep] = useState<Step>("extend");
  const [extendMinutes, setExtendMinutes] = useState(5);

  const [selectedDistractions, setSelectedDistractions] = useState<
    DistractionType[]
  >([]);
  const [distractionNote, setDistractionNote] = useState("");
  // const [otherDistractionText, setOtherDistractionText] = useState("");

  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  const moodEmojis: Record<Mood, string> = {
    Focused: "😊",
    Tired: "😓",
    Neutral: "😐",
    Distracted: "😕",
  };

  /* ---------------- actions ---------------- */

  const handleExtendSession = async () => {
    await extend_session(extendMinutes);
  };

  const handleEndSession = () => {
    setCurrentStep("distraction");
  };

  const toggleDistraction = (type: DistractionType) => {
    setSelectedDistractions((prev) =>
      prev.includes(type) ? prev.filter((d) => d !== type) : [...prev, type]
    );
  };

    const handleFinishSession = async (id:string) => {
      await finish_active_session(id);
  };


  /* ---------------- render ---------------- */

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* STEP 1: EXTEND */}
      {currentStep === "extend" && (
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 text-center border">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-2">Session Complete</h2>

          <div className="flex justify-center gap-2 my-6">
            <input
              type="number"
              min={1}
              value={extendMinutes}
              onChange={(e) => setExtendMinutes(Number(e.target.value))}
              className="w-24 px-3 py-2 border rounded-xl text-center"
            />
            <span className="py-2">minutes</span>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleExtendSession}
              className="px-6 py-3 bg-primary text-white rounded-xl"
            >
              <Clock className="inline w-5 h-5 mr-1" />
              Extend
            </button>

            <button
              onClick={handleEndSession}
              className="px-6 py-3 bg-muted rounded-xl"
            >
              End
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DISTRACTION */}
      {currentStep === "distraction" && (
        <div className="w-full max-w-lg bg-card rounded-2xl p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-center">
            What distracted you?
          </h2>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {(Object.keys(distractionIcons) as DistractionType[]).map(
              (type) => {
                const Icon = distractionIcons[type];
                const active = selectedDistractions.includes(type);

                return (
                  <button
                    key={type}
                    onClick={() => toggleDistraction(type)}
                    className={`p-3 rounded-xl border ${
                      active ? "bg-orange-500 text-white" : "bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    {type}
                  </button>
                );
              }
            )}
          </div>

          {/* {selectedDistractions.includes("Other") && (
            <textarea
              value={otherDistractionText}
              onChange={(e) => setOtherDistractionText(e.target.value)}
              className="w-full mb-3 p-2 border rounded-xl"
              placeholder="Describe the distraction"
            />
          )} */}

          <textarea
            value={distractionNote}
            onChange={(e) => setDistractionNote(e.target.value)}
            className="w-full mb-4 p-2 border rounded-xl"
            placeholder="Notes (optional)"
          />

          <button
            onClick={() => setCurrentStep("mood")}
            className="w-full py-3 bg-primary text-white rounded-xl"
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 3: MOOD */}
      {currentStep === "mood" && (
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 border">
          <h2 className="text-2xl font-bold text-center mb-6">
            How do you feel?
          </h2>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {(["Low", "Medium", "High"] as EnergyLevel[]).map((e) => (
              <button
                key={e}
                onClick={() => setEnergy(e)}
                className={`py-3 rounded-xl ${
                  energy === e ? "bg-primary text-white" : "bg-muted"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {(Object.keys(moodEmojis) as Mood[]).map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`py-3 rounded-xl ${
                  mood === m ? "bg-primary text-white" : "bg-muted"
                }`}
              >
                {moodEmojis[m]} {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentStep("complete")}
            disabled={!mood || !energy}
            className="w-full py-3 bg-primary text-white rounded-xl disabled:opacity-50"
          >
            Submit
          </button>
        </div>
      )}

      {/* STEP 4: COMPLETE */}
      {currentStep === "complete" && (
        <div className="w-full max-w-lg bg-card rounded-3xl p-8 text-center border">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
          <h2 className="text-3xl font-bold mb-2">All Done!</h2>
          <button
            onClick={()=>handleFinishSession(sessionId)}
            className="px-6 py-3 bg-primary text-white rounded-xl"
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
}
