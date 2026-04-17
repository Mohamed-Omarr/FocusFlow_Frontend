"use client";

import { Button } from "@/components/ui/button";

export default function AuthError({ error, reset }: any) {
  return (
    <div>
      <h2>Authentication Error</h2>
      <Button onClick={() => reset()}>Retry</Button>
    </div>
  );
}
