"use client";

import { useState, useMemo } from "react";
import {
  Clock,
  Target,
  Coffee,
  Calendar,
  Timer,
  XCircle,
  PauseCircle,
  Search,
} from "lucide-react";

interface Session {
  name: string;
  duration: string;
  score: number;
  breaks: number;
  startTime: string;
  endTime: string;
  date: string;
  notes: string;
  cancelReason?: string;
  pauseReason?: string;
}

const workSessions: Session[] = [
  {
    name: "Project Planning",
    duration: "2h 30m",
    score: 92,
    breaks: 2,
    startTime: "9:00 AM",
    endTime: "11:30 AM",
    date: "Nov 28, 2024",
    notes: "Outlined Q1 roadmap and prioritized features for the next sprint",
  },
  {
    name: "Code Review",
    duration: "1h 15m",
    score: 88,
    breaks: 1,
    startTime: "2:00 PM",
    endTime: "3:15 PM",
    date: "Nov 27, 2024",
    notes: "Reviewed 3 PRs and provided detailed feedback on architecture",
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
    notes: "Sprint retrospective and planning for next iteration",
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
    notes: "Learned about compound components and render props patterns",
  },
  {
    name: "TypeScript Deep Dive",
    duration: "2h",
    score: 90,
    breaks: 2,
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    date: "Nov 26, 2024",
    notes: "Explored advanced type manipulation and generic constraints",
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
    notes: "Studied distributed systems and load balancing strategies",
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
    notes: "Focused on breathing exercises and mindfulness practice",
  },
  {
    name: "Exercise Routine",
    duration: "1h",
    score: 94,
    breaks: 1,
    startTime: "7:30 AM",
    endTime: "8:30 AM",
    date: "Nov 28, 2024",
    notes: "Full body workout with cardio and strength training",
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
    notes: "Finished chapter 5 of 'Atomic Habits' by James Clear",
    cancelReason: "Felt too tired to continue reading",
  },
];

function SessionCard({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="p-5 rounded-2xl border shadow-sm transition hover:shadow-md hover:border-primary cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-base">{session.name}</h3>
          <span className="text-sm px-2 py-1 rounded font-medium bg-primary text-primary-foreground">
            {session.score}
          </span>
        </div>

        {(session.cancelReason || session.pauseReason) && (
          <div className="mb-3 flex flex-wrap gap-2">
            {session.cancelReason && (
              <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-500/10 text-red-500">
                <XCircle className="w-3 h-3" />
                <span>Canceled</span>
              </div>
            )}
            {session.pauseReason && (
              <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-orange-500/10 text-orange-500">
                <PauseCircle className="w-3 h-3" />
                <span>Paused</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{session.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>Score</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-sm font-medium hover:underline text-primary"
          >
            Read more
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg shadow-lg max-w-md w-full p-6 relative bg-popover text-popover-foreground">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 font-bold text-xl hover:text-gray-300"
            >
              ×
            </button>

            <h2 className="text-2xl font-semibold mb-4">{session.name}</h2>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
              <div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </div>
                <p className="font-medium">{session.date}</p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Duration</span>
                </div>
                <p className="font-medium">{session.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
              <div>
                <div className="flex items-center gap-1">
                  <Timer className="w-4 h-4" />
                  <span>Time Range</span>
                </div>
                <p className="font-medium">{session.startTime} - {session.endTime}</p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Coffee className="w-4 h-4" />
                  <span>Breaks</span>
                </div>
                <p className="font-medium">{session.breaks} {session.breaks === 1 ? "break" : "breaks"}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="w-4 h-4" />
                <span>Score</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg px-3 py-1 rounded font-medium bg-primary text-primary-foreground">
                  {session.score}
                </span>
                <span className="text-muted-foreground text-sm">/ 100</span>
              </div>
            </div>

            {session.cancelReason && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-sm font-medium text-red-500 mb-1">
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Reason</span>
                </div>
                <p className="text-sm">{session.cancelReason}</p>
              </div>
            )}

            {session.pauseReason && (
              <div className="mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-center gap-2 text-sm font-medium text-orange-500 mb-1">
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause Reason</span>
                </div>
                <p className="text-sm">{session.pauseReason}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Notes</p>
              <p className="text-sm mt-1">{session.notes}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function SessionsPage() {
  const [activeCategory, setActiveCategory] = useState<"work" | "study" | "personal">("work");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "2weeks" | "4weeks" | "1month+">("all");

  const categories = [
    { id: "work" as const, label: "Work", sessions: workSessions, color: "var(--chart-1)" },
    { id: "study" as const, label: "Study", sessions: studySessions, color: "var(--chart-2)" },
    { id: "personal" as const, label: "Personal", sessions: personalSessions, color: "var(--chart-3)" },
  ];

  const activeData = categories.find(cat => cat.id === activeCategory);

  const filteredAndSortedSessions = useMemo(() => {
    let sessions = activeData?.sessions || [];

    if (searchQuery) {
      sessions = sessions.filter(session =>
        session.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (dateFilter !== "all") {
      const now = new Date();
      sessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        const diffInDays = Math.floor((now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dateFilter === "2weeks") return diffInDays <= 14;
        if (dateFilter === "4weeks") return diffInDays <= 28;
        if (dateFilter === "1month+") return diffInDays > 28;
        return true;
      });
    }

    return [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeData, searchQuery, dateFilter]);

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-4xl font-bold mb-3">Sessions</h1>
      <p className="text-lg text-muted-foreground mb-6">Track your productivity across categories</p>

      <div className="border border-border rounded-2xl shadow-lg p-6 bg-card">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Categories Sidebar */}
          <div className="p-4 rounded-lg border border-border h-fit bg-background">
            <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
              Categories
            </h2>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="px-4 py-3 rounded-lg text-left font-medium transition-all hover:opacity-90"
                  style={{
                    backgroundColor: activeCategory === cat.id ? cat.color : "transparent",
                    color: activeCategory === cat.id ? "white" : "var(--foreground)",
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
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value as any)}
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
