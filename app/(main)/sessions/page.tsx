"use client";

import { useState, useMemo } from "react";
import {
  Search,
} from "lucide-react";
import SessionCard from "./component/SessionCard";

const workSessions: Session[] = [
  {
    name: "Project Planning",
    duration: "2h 30m",
    score: 92,
    breaks: 2,
    startTime: "9:00 AM",
    endTime: "11:30 AM",
    date: "Nov 28, 2024",
  },
  {
    name: "Code Review",
    duration: "1h 15m",
    score: 88,
    breaks: 1,
    startTime: "2:00 PM",
    endTime: "3:15 PM",
    date: "Nov 27, 2024",
    pauseReason: "Team asked for quick input on urgent bug",
  },
  {
    name: "Team Meeting",
    duration: "45m",
    score: 85,
    breaks: 0,
    startTime: "10:00 AM",
    endTime: "10:45 AM",
    date: "Nov 27, 2024",
    cancelReason: "Meeting rescheduled due to client emergency",
  },
];

const studySessions: Session[] = [
  {
    name: "React Advanced Patterns",
    duration: "3h",
    score: 95,
    breaks: 3,
    startTime: "7:00 PM",
    endTime: "10:00 PM",
    date: "Nov 28, 2024",
  },
  {
    name: "TypeScript Deep Dive",
    duration: "2h",
    score: 90,
    breaks: 2,
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    date: "Nov 26, 2024",
    pauseReason: "Phone call from family member",
  },
  {
    name: "System Design",
    duration: "1h 30m",
    score: 87,
    breaks: 1,
    startTime: "8:00 PM",
    endTime: "9:30 PM",
    date: "Nov 25, 2024",
  },
];

const personalSessions: Session[] = [
  {
    name: "Morning Meditation",
    duration: "30m",
    score: 100,
    breaks: 0,
    startTime: "6:30 AM",
    endTime: "7:00 AM",
    date: "Nov 28, 2024",
  },
  {
    name: "Exercise Routine",
    duration: "1h",
    score: 94,
    breaks: 1,
    startTime: "7:30 AM",
    endTime: "8:30 AM",
    date: "Nov 28, 2024",
    pauseReason: "Needed water break due to intense workout",
  },
  {
    name: "Reading Time",
    duration: "45m",
    score: 89,
    breaks: 0,
    startTime: "9:00 PM",
    endTime: "9:45 PM",
    date: "Nov 27, 2024",
    cancelReason: "Felt too tired to continue reading",
  },
];


export default function SessionsPage() {
  const [activeCategory, setActiveCategory] = useState<
    "work" | "study" | "personal"
  >("work");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<
    "all" | "2weeks" | "4weeks" | "1month+"
  >("all");

  const categories = [
    {
      id: "work" as const,
      label: "Work",
      sessions: workSessions,
      color: "var(--chart-1)",
    },
    {
      id: "study" as const,
      label: "Study",
      sessions: studySessions,
      color: "var(--chart-2)",
    },
    {
      id: "personal" as const,
      label: "Personal",
      sessions: personalSessions,
      color: "var(--chart-3)",
    },
  ];

  const activeData = categories.find((cat) => cat.id === activeCategory);

  const filteredAndSortedSessions = useMemo(() => {
    let sessions = activeData?.sessions || [];

    if (searchQuery) {
      sessions = sessions.filter((session) =>
        session.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();
      sessions = sessions.filter((session) => {
        const sessionDate = new Date(session.date);
        const diffInDays = Math.floor(
          (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (dateFilter === "2weeks") return diffInDays <= 14;
        if (dateFilter === "4weeks") return diffInDays <= 28;
        if (dateFilter === "1month+") return diffInDays > 28;
        return true;
      });
    }

    return [...sessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [activeData, searchQuery, dateFilter]);

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div
        className="
    mb-6
    border border-border/50
    backdrop-blur-xl
    bg-background/60
    rounded-full
    px-6
    py-3
  "
      >
        <h1 className="text-2xl font-bold text-foreground">
          Sessions
          <br />
          <span className="text-sm font-normal text-muted-foreground">
            Track your productivity across categories
          </span>
        </h1>
      </div>

      <div className="border border-border rounded-2xl shadow-lg p-6 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Categories Sidebar */}
          <div className="p-4 rounded-lg border border-border h-fit bg-background">
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
              Categories
            </h2>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="px-4 py-3 rounded-lg text-left font-medium transition-all hover:opacity-90"
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
          </div>

          {/* Sessions Content */}
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Time</option>
                <option value="2weeks">Last 2 Weeks</option>
                <option value="4weeks">Last 4 Weeks</option>
                <option value="1month+">Above 1 Month</option>
              </select>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {filteredAndSortedSessions.map((session, index) => (
                <SessionCard key={index} session={session} />
              ))}
            </div>

            {filteredAndSortedSessions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No sessions found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
