"use client";

import type React from "react";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function WaitlistForm() {
  const t = useTranslations("landing.cta.waitinglist");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "protonmail.com",
  ];

  const isValidEmail = (email: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    const domain = email.split("@")[1].toLowerCase();
    return allowedDomains.includes(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || isSubmitted) return;

    if (!isValidEmail(email)) {
      setError(t("errors.invalid_email"));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await axios.post("/api/v1/waitlist", { email });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto backdrop-blur-xl bg-card/40 rounded-3xl p-5 sm:p-6 lg:p-8 border border-primary/10 shadow-lg">
        <div className="flex items-center justify-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t("success.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("success.description_part1")}{" "}
              <span className="text-foreground font-medium">{email}</span>{" "}
              {t("success.description_part2")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto backdrop-blur-xl bg-card/40 rounded-3xl p-5 sm:p-6 lg:p-8 border border-primary/10 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-6 text-center">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {t("headline")}
        </h3>
      </div>

      <p className="text-center text-sm sm:text-base text-muted-foreground mb-3 leading-relaxed">
        {t("description_part1")}
      </p>

      <p className="text-center text-sm sm:text-base text-muted-foreground mb-4 sm:mb-3 leading-relaxed">
        {t("description_part2")}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder={t("input_placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-12 h-11 sm:h-12 rounded-2xl bg-background/50 border-primary/20 focus:border-primary/50"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 sm:h-12 px-6 sm:px-8 rounded-2xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
        >
          {isLoading ? t("buttons.loading") : t("buttons.join_waitlist")}
        </Button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-destructive text-center">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" />
          <span>{t("benefits.early_access")}</span>{" "}
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-primary" />
          <span>{t("benefits.priority_support")}</span>{" "}
        </div>
      </div>
    </div>
  );
}
