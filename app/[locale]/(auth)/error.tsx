"use client";

export default function AuthError({ error, reset }: any) {
  return (
    <div>
      <h2>Authentication Error</h2>
      <button onClick={() => reset()}>Retry</button>
    </div>
  );
}
