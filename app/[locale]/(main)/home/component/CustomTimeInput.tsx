"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Label } from "@/components/ui/label";

interface CustomTimeInputProps {
  value: string;
  onChange: (val: string) => void;
  onValidChange: (isValid: boolean) => void;
}

export function CustomTimeInput({
  value,
  onChange,
  onValidChange,
}: CustomTimeInputProps) {
  const MIN = 25;
  const MAX = 360;
  const [error, setError] = useState("");

  const validate = (val: string) => {
    if (val === "") {
      setError("");
      onValidChange(false);
      return true;
    }

    if (!/^\d+$/.test(val)) {
      setError("Only numbers allowed.");
      onValidChange(false);
      return false;
    }

    const num = Number(val);

    if (num < MIN) {
      setError(`Minimum is ${MIN} minutes.`);
      onValidChange(false);
      return false;
    }

    if (num > MAX) {
      setError(`Maximum is ${MAX} minutes.`);
      onValidChange(false);
      return false;
    }

    setError("");
    onValidChange(true);
    return true;
  };

  const handleChange = (val: string) => {
    onChange(val);
    validate(val);
  };

  const handleBlur = () => {
    const num = Number(value);
    if (value === "" || isNaN(num) || num < MIN || num > MAX) {
      onChange("");
      setError("");
      onValidChange(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Label className="mb-2 block text-foreground">
        Custom Duration (25–360 min)
      </Label>
      <motion.input
        type="number"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="Enter minutes"
        className={`w-full px-4 py-3 bg-input text-foreground border rounded-2xl transition ${
          error ? "border-destructive" : "border-border"
        }`}
      />
      {error && (
        <p className="text-sm text-destructive-foreground mt-1">{error}</p>
      )}
    </motion.div>
  );
}
