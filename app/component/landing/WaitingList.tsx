"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check, Sparkles } from "lucide-react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store email in localStorage for now
    const emails = JSON.parse(localStorage.getItem("waitlist_emails") || "[]");
    emails.push({ email, date: new Date().toISOString() });
    localStorage.setItem("waitlist_emails", JSON.stringify(emails));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto backdrop-blur-xl bg-card/40 rounded-3xl p-8 border border-primary/10 shadow-lg">
        <div className="flex items-center justify-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              You're on the list!
            </h3>
            <p className="text-sm text-muted-foreground">
              We'll notify you at{" "}
              <span className="text-foreground font-medium">{email}</span> when
              we launch.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto backdrop-blur-xl bg-card/40 rounded-3xl p-8 border border-primary/10 shadow-lg">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Master your day with FocusFlow.
        </h3>
      </div>
      <p className="text-center text-muted-foreground mb-3 leading-relaxed">
        Turn distractions into progress. Join the waitlist and be the first to
        experience FocusFlow with exclusive early access.
      </p>

      <p className="text-center text-muted-foreground mb-3 leading-relaxed">
        we are coming soon.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-12 h-12 rounded-2xl bg-background/50 border-primary/20 focus:border-primary/50"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 px-8 rounded-2xl font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
        >
          {isLoading ? "Joining..." : "Join Waitlist"}
        </Button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
        {["Early access", "Launch day benefits", "Priority support"].map(
          (benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>{benefit}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
