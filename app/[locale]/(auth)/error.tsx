"use client";

export default function AuthError({ error, reset }: any) {
  return (
    <div>
      <h2>Authentication Error</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Retry</button>
    </div>
  );
}
