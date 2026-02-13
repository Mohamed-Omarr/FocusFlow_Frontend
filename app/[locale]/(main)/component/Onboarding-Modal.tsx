"use client";

import { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  TrendingUp,
  Gift,
} from "lucide-react";
import { completeOnBoarding } from "../active-session/helper";
import axios from "axios";

const questions = [
  {
    id: "focus_rhythm",
    title: "Current focus rhythm",
    question: "How often do you usually do focused work?",
    hint: "Used to assess habit strength & starting difficulty",
    options: ["Rarely", "A few times a week", "Most days", "Almost daily"],
  },
  {
    id: "session_length",
    title: "Typical session length",
    question: "When you do focus, how long does it usually last?",
    hint: "Used to calibrate session challenges",
    options: ["25–35 minutes", "35–45 minutes", "More than 45 minutes"],
  },
  {
    id: "main_struggle",
    title: "Main struggle",
    question: "What makes focus hardest for you right now?",
    hint: "Used to choose your first Bridge type",
    options: [
      "Getting started",
      "Staying focused",
      "Finding time",
      "Mental fatigue",
    ],
  },
  {
    id: "goal_orientation",
    title: "Goal orientation",
    question: "What would feel like a win this month?",
    hint: "Used to tune challenge tone: gentle vs stretch",
    options: [
      "Just building the habit",
      "Being more consistent",
      "Going deeper",
      "Recovering after a break",
    ],
  },
];

const introSteps = [
  {
    id: "welcome",
    type: "intro",
  },
  {
    id: "why_questions",
    type: "bridge",
  },
];

export function OnboardingModal() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const totalSteps = introSteps.length + questions.length;
  const isIntroStep = currentStep < introSteps.length;
  const questionIndex = currentStep - introSteps.length;
  const currentQuestion = !isIntroStep ? questions[questionIndex] : null;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (isIntroStep) {
      setCurrentStep(currentStep + 1);
      return;
    }

    if (!selectedOption) return;

    const newAnswers = { ...answers, [currentQuestion!.id]: selectedOption };
    
    setAnswers(newAnswers);

    if (isLastStep) {
      await completeOnBoarding(newAnswers);
      setIsOpen(false);
    } else {
      setCurrentStep(currentStep + 1);
      const nextQuestionIndex = currentStep + 1 - introSteps.length;
      setSelectedOption(answers[questions[nextQuestionIndex]?.id] || null);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (currentStep - 1 >= introSteps.length) {
        const prevQuestionIndex = currentStep - 1 - introSteps.length;
        setSelectedOption(answers[questions[prevQuestionIndex]?.id] || null);
      }
    }
  };

  const renderWelcomeStep = () => (
    <div className="px-6 pb-8 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[oklch(0.6_0.18_250)] to-[oklch(0.7_0.14_285)] flex items-center justify-center">
        <Sparkles className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-3">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-[oklch(0.6_0.18_250)] via-[oklch(0.7_0.13_175)] to-[oklch(0.7_0.14_285)] bg-clip-text text-transparent">
          FocusFlow
        </span>
      </h1>

      <p className="text-lg text-muted-foreground mb-8">
        A smarter way to build focus — without pressure.
      </p>

      <div className="text-left space-y-4 mb-8 bg-background/50 rounded-2xl p-5 border border-border">
        <p className="text-foreground font-medium">
          FocusFlow helps you improve focus at your own pace.
        </p>
        <p className="text-muted-foreground text-sm">
          We don't force rigid routines. Instead, we:
        </p>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-[oklch(0.6_0.18_250)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.6_0.18_250)]" />
            </div>
            Learn how you naturally work
          </li>
          <li className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-[oklch(0.68_0.15_280)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.68_0.15_280)]" />
            </div>
            Track real focus sessions (not promises)
          </li>
          <li className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-[oklch(0.7_0.13_175)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.13_175)]" />
            </div>
            Adapt challenges as your focus evolves
          </li>
          <li className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="w-5 h-5 rounded-full bg-[oklch(0.7_0.14_285)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.14_285)]" />
            </div>
            Reward consistency, not perfection
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-[oklch(0.7_0.13_175)]/10 rounded-xl px-4 py-3 border border-[oklch(0.7_0.13_175)]/20">
        <Sparkles className="w-4 h-4 text-[oklch(0.7_0.13_175)]" />
        <span>
          There are no wrong answers — this only helps us personalize your
          journey.
        </span>
      </div>

      <button
        onClick={handleNext}
        className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold bg-gradient-to-r from-[oklch(0.6_0.18_250)] to-[oklch(0.68_0.15_280)] text-white hover:opacity-90 transition-all"
      >
        Start personalization
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );

  const renderBridgeStep = () => (
    <div className="px-6 pb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Why We Ask These Questions
        </h2>
        <p className="text-muted-foreground">
          These questions help us choose your starting path.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-sm text-muted-foreground text-center mb-6">
          Your answers shape:
        </p>

        <div className="flex items-start gap-4 bg-background/50 rounded-2xl p-4 border border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.6_0.18_250)] to-[oklch(0.65_0.16_255)] flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Your First Bridge
            </h3>
            <p className="text-sm text-muted-foreground">
              Your focus direction tailored to how you work best
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-background/50 rounded-2xl p-4 border border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.68_0.15_280)] to-[oklch(0.7_0.14_285)] flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Your First Challenges
            </h3>
            <p className="text-sm text-muted-foreground">
              Achievable goals that grow with you
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 bg-background/50 rounded-2xl p-4 border border-border">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[oklch(0.7_0.13_175)] to-[oklch(0.6_0.18_250)] flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Early Milestones & Rewards
            </h3>
            <p className="text-sm text-muted-foreground">
              Meaningful progress markers from day one
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-[oklch(0.6_0.18_250)] to-[oklch(0.68_0.15_280)] text-white hover:opacity-90 transition-all"
        >
          Let's begin
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderQuestionStep = () => (
    <div className="px-6 pb-6">
      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
        {currentQuestion!.title}
      </p>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {currentQuestion!.question}
      </h2>
      <p className="text-xs text-muted-foreground/70 mb-6">
        {currentQuestion!.hint}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-8">
        {currentQuestion!.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelectOption(option)}
            className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 ${
              selectedOption === option
                ? "border-[oklch(0.6_0.18_250)] bg-[oklch(0.6_0.18_250)]/10 text-foreground"
                : "border-border bg-background/50 text-muted-foreground hover:border-muted-foreground/50 hover:bg-background"
            }`}
          >
            <span className="font-medium">{option}</span>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={!selectedOption}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            selectedOption
              ? "bg-gradient-to-r from-[oklch(0.6_0.18_250)] to-[oklch(0.68_0.15_280)] text-white hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isLastStep ? "Complete" : "Continue"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

    if (!isOpen) return null;
  return (
    <div className="fixed inset-0 max-h-fit bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {isIntroStep ? (
                <span className="text-sm text-muted-foreground">
                  {currentStep === 0 ? "Welcome" : "Getting Started"}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Question {questionIndex + 1} of {questions.length}
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-background rounded-full overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-to-r from-[oklch(0.6_0.18_250)] via-[oklch(0.7_0.13_175)] to-[oklch(0.7_0.14_285)] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content */}
        {currentStep === 0 && renderWelcomeStep()}
        {currentStep === 1 && renderBridgeStep()}
        {!isIntroStep && renderQuestionStep()}
      </div>
    </div>
  );
}
