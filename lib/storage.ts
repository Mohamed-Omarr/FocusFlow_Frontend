// LocalStorage utilities for FocusFlow

const STORAGE_KEYS = {
  USER: "focusflow_user",
  TASKS: "focusflow_tasks",
  SESSIONS: "focusflow_sessions",
  DISTRACTIONS: "focusflow_distractions",
  CHECKINS: "focusflow_checkins",
  GOALS: "focusflow_goals",
  STREAK: "focusflow_streak",
  ANALYTICS: "focusflow_analytics",
  INTERRUPTIONS: "focusflow_interruptions",
}

export const storage = {
  // Generic get/set
  get: (key: string): any | null => {
    if (typeof window === "undefined") return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set: (key: string, value: any): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Storage error:", error)
    }
  },

  // User
  getUser: () => storage.get(STORAGE_KEYS.USER),
  setUser: (user: any) => storage.set(STORAGE_KEYS.USER, user),

  // Tasks
  getTasks: () => storage.get(STORAGE_KEYS.TASKS) || [],
  setTasks: (tasks: any[]) => storage.set(STORAGE_KEYS.TASKS, tasks),
  addTask: (task: any) => {
    const tasks = storage.getTasks()
    storage.setTasks([...tasks, task])
  },

  // Sessions
  getSessions: () => storage.get(STORAGE_KEYS.SESSIONS) || [],
  setSessions: (sessions: any[]) => storage.set(STORAGE_KEYS.SESSIONS, sessions),
  addSession: (session: any) => {
    const sessions = storage.getSessions()
    storage.setSessions([...sessions, session])
  },
  updateSession: (sessionId: string, updates: any) => {
    const sessions = storage.getSessions()
    const updated = sessions.map((s) => (s.id === sessionId ? { ...s, ...updates } : s))
    storage.setSessions(updated)
  },

  // Distractions
  getDistractions: () => storage.get(STORAGE_KEYS.DISTRACTIONS) || [],
  setDistractions: (distractions: any[]) => storage.set(STORAGE_KEYS.DISTRACTIONS, distractions),
  addDistraction: (distraction: any) => {
    const distractions = storage.getDistractions()
    storage.setDistractions([...distractions, distraction])
  },

  // Check-ins
  getCheckins: () => storage.get(STORAGE_KEYS.CHECKINS) || [],
  setCheckins: (checkins: any[]) => storage.set(STORAGE_KEYS.CHECKINS, checkins),
  addCheckin: (checkin: any) => {
    const checkins = storage.getCheckins()
    storage.setCheckins([...checkins, checkin])
  },

  // Goals
  getGoals: () => storage.get(STORAGE_KEYS.GOALS) || [],
  setGoals: (goals: any[]) => storage.set(STORAGE_KEYS.GOALS, goals),
  addGoal: (goal: any) => {
    const goals = storage.getGoals()
    storage.setGoals([...goals, goal])
  },
  updateGoal: (goalId: string, updates: any) => {
    const goals = storage.getGoals()
    const updated = goals.map((g) => (g.id === goalId ? { ...g, ...updates } : g))
    storage.setGoals(updated)
  },

  // Streak
  getStreak: () => storage.get(STORAGE_KEYS.STREAK) || { currentStreak: 0, longestStreak: 0, lastSessionDate: "" },
  setStreak: (streak: any) => storage.set(STORAGE_KEYS.STREAK, streak),

  // Analytics
  getAnalytics: () => storage.get(STORAGE_KEYS.ANALYTICS) || [],
  setAnalytics: (analytics: any[]) => storage.set(STORAGE_KEYS.ANALYTICS, analytics),
  addAnalytic: (analytic: any) => {
    const analytics = storage.getAnalytics()
    storage.setAnalytics([...analytics, analytic])
  },

  // Interruptions
  getInterruptions: () => storage.get(STORAGE_KEYS.INTERRUPTIONS) || [],
  setInterruptions: (interruptions: any[]) => storage.set(STORAGE_KEYS.INTERRUPTIONS, interruptions),
  addInterruption: (interruption: any) => {
    const interruptions = storage.getInterruptions()
    storage.setInterruptions([...interruptions, interruption])
  },
}
