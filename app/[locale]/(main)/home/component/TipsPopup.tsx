"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAxiosGet } from "@/lib/axios/useAxiosQuery";

interface TipsPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmStart: () => void;
}

interface TipsApiResponse {
  tip_1?: string;
  tip_2?: string;
  tips?: {
    tip_1?: string;
    tip_2?: string;
  };
}

export function TipsPopup({
  open,
  onOpenChange,
  onConfirmStart,
}: TipsPopupProps) {
  const { data, isLoading } = useAxiosGet<TipsApiResponse>(
    ["short_focus_tips"],
    "/tasks/short-focus-tip",
  );

  const tip1 = data?.tip_1 ?? data?.tips?.tip_1;
  const tip2 = data?.tip_2 ?? data?.tips?.tip_2;
  const hardcodedTip =
    "Take 1 min as rest before you start with no activity just sit.";

  const tips = [tip1, tip2, hardcodedTip].filter(Boolean) as string[];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                Before You Start
              </DialogTitle>
              <DialogDescription className="text-xs">
                AI tips based on your recent sessions
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tips */}
        <div className="mt-4 space-y-3 min-h-[80px]">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Generating smart tips...
            </p>
          )}

          {!isLoading && tips.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tips available yet.
            </p>
          )}

          {!isLoading &&
            tips.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-xl border bg-muted/40 p-3"
              >
                <p className="text-sm leading-relaxed">{tip}</p>
              </div>
            ))}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-xl"
            onClick={() => {
              onOpenChange(false);
              onConfirmStart();
            }}
          >
            Start Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
