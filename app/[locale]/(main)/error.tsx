"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("[v0] Error occurred:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <div className="rounded-full bg-destructive/10 p-6">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
            <div className="absolute inset-0 bg-destructive/20 blur-3xl -z-10"></div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Something Went Wrong</h2>
          <p className="text-muted-foreground text-balance">
            We encountered an unexpected error. Don't worry, we're here to help
            you get back on track.
          </p>
        </div>

        <div className="pt-4">
          <Button
            asChild
            variant="outline"
            className="rounded-xl h-11 bg-transparent"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
