"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { HelpCircle, MessageSquare, Send, Bug } from "lucide-react";
import { storage } from "@/lib/storage";

export function SupportButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to storage or send to backend
    storage.addSupportRequest({
      id: crypto.randomUUID(),
      type,
      subject,
      message,
      email: email || undefined,
      createdAt: new Date().toISOString(),
    });

    // Reset form
    setType("suggestion");
    setSubject("");
    setMessage("");
    setEmail("");
    setOpen(false);

    alert("Thank you! We'll get back to you soon.");
  };

  const placeholderSubject =
    type === "suggestion"
      ? "Share your idea..."
      : type === "bug"
      ? "What issue did you find?"
      : "What do you need help with?";

  const placeholderMessage =
    type === "suggestion"
      ? "Tell us more about your suggestion..."
      : type === "bug"
      ? "Describe the bug in detail. Steps to reproduce are helpful..."
      : "Describe your issue in detail...";

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          // Reset form when dialog closes
          setType("suggestion");
          setSubject("");
          setMessage("");
          setEmail("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary/10 hover:bg-primary/20 border-primary/20 z-50"
        >
          <HelpCircle className="h-6 w-6 text-primary" />
          <span className="sr-only">Open support center</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Support Center
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            We're here to help. Send us your suggestion, report a bug, or contact support.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Type selection */}
          <div className="space-y-3">
            <Label>What can we help you with?</Label>
            <RadioGroup value={type} onValueChange={setType} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion" className="font-normal cursor-pointer">
                  Send a suggestion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug" className="font-normal cursor-pointer flex items-center gap-1">
                  <Bug className="h-4 w-4" /> Report a bug
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="support" id="support" />
                <Label htmlFor="support" className="font-normal cursor-pointer">
                  Contact support
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder={placeholderSubject}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder={placeholderMessage}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="bg-background/50 resize-none"
            />
          </div>

          {/* Optional email */}
          <div className="space-y-2">
            <Label htmlFor="email">Your email (optional)</Label>
            <Input
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!subject || !message}
          >
            <Send className="h-4 w-4 mr-2" />
            {type === "suggestion"
              ? "Send Suggestion"
              : type === "bug"
              ? "Submit Bug Report"
              : "Send Support Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
