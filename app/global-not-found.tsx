import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import type { Metadata } from "next";
import "./styles/global.css";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
          <div className="text-center space-y-6 max-w-md">
            <div className="relative">
              <h1 className="text-9xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                404
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl -z-10"></div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Page Not Found</h2>
              <p className="text-muted-foreground text-balance">
                The page you're looking for doesn't exist or has been moved.
                Let's get you back on track.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity rounded-xl h-11">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
