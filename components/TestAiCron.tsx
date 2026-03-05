"use client";

import { useState } from "react";

export default function TestAiCron() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runTest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/ai/run", {
        method: "POST",
      });
      
      const data = await res.json();
      console.log(data);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={runTest} disabled={loading}>
        {loading ? "Running..." : "Run AI Cron Test"}
      </button>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}