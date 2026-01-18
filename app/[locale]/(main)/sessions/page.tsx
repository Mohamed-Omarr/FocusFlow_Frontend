"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

import SessionCard from "./component/SessionCard";
import { useAxiosGet } from "@/lib/axios/useAxiosQuery";
import type { SessionHistoryResponse } from "@/app/api/v1/sessions/history/route";

export default function SessionsPage() {
  const [activeCategory, setActiveCategory] = useState<
    "work" | "study" | "personal"
  >("work");

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<
    "all" | "2weeks" | "4weeks" | "1month+"
  >("all");

  const categories = [
    { id: "work", label: "Work", color: "var(--chart-1)" },
    { id: "study", label: "Study", color: "var(--chart-2)" },
    { id: "personal", label: "Personal", color: "var(--chart-3)" },
  ] as const;

  /* ---------------- FETCH ---------------- */
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useAxiosGet(["sessions"], "/sessions/history");

  const sessions = response;
  /* ---------------- FILTER + SORT ---------------- */
  const filteredAndSortedSessions = useMemo(() => {
    let result = [...sessions];

    /* (Optional) Category filter — only if your API provides category */
    result = result.filter(
      (session) => session.task_category === activeCategory,
    );

    /* Search */
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((session) =>
        session.task_name.toLowerCase().includes(query),
      );
    }

    /* Date filter */
    if (dateFilter !== "all") {
      const now = new Date();

      result = result.filter((session) => {
        const sessionDate = new Date(session.created_at);
        const diffInDays =
          (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);

        if (dateFilter === "2weeks") return diffInDays <= 14;
        if (dateFilter === "4weeks") return diffInDays <= 28;
        if (dateFilter === "1month+") return diffInDays > 28;
        return true;
      });
    }

    /* Sort newest first */
    return result.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [sessions, searchQuery, dateFilter, activeCategory]);

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading sessions…</p>
      </main>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (isError) {
    throw new Error(error?.message || "Failed to load sessions");
  }

  /* ---------------- UI ---------------- */
  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      {/* HEADER */}
      <div className="mb-6 border border-border/50 backdrop-blur-xl bg-background/60 rounded-full px-6 py-3">
        <h1 className="text-2xl font-bold">
          Sessions
          <br />
          <span className="text-sm font-normal text-muted-foreground">
            Track your productivity across categories
          </span>
        </h1>
      </div>

      <div className="border border-border rounded-2xl shadow-lg p-6 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* CATEGORIES */}
          <aside className="p-4 rounded-lg border border-border bg-background h-fit">
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
              Categories
            </h2>

            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="px-4 py-3 rounded-lg text-left font-medium transition"
                  style={{
                    backgroundColor:
                      activeCategory === cat.id ? cat.color : "transparent",
                    color:
                      activeCategory === cat.id ? "white" : "var(--foreground)",
                    opacity: activeCategory === cat.id ? 1 : 0.7,
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </aside>

          {/* CONTENT */}
          <section>
            {/* FILTER BAR */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sessions..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <select
                value={dateFilter}
                onChange={(e) =>
                  setDateFilter(
                    e.target.value as "all" | "2weeks" | "4weeks" | "1month+",
                  )
                }
                className="px-4 py-2 rounded-lg border border-border bg-background"
              >
                <option value="all">All Time</option>
                <option value="2weeks">Last 2 Weeks</option>
                <option value="4weeks">Last 4 Weeks</option>
                <option value="1month+">Above 1 Month</option>
              </select>
            </div>

            {/* GRID */}
            {filteredAndSortedSessions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No sessions found.
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {filteredAndSortedSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
