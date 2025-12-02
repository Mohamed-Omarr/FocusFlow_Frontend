// Analytics calculation utilities

import { storage } from "./storage"

export const analyticsEngine = {
  // Calculate daily focus score (0-100)
  calculateFocusScore: (
    sessions,
    distractions,
    checkins,
  ): number => {
    // Fetch data from storage if not provided
    const _sessions = sessions ?? storage.getSessions() ?? []
    const _distractions = distractions ?? storage.getDistractions() ?? []
    const _checkins = checkins ?? storage.getCheckins() ?? []

    if (_sessions.length === 0) return 0

    const totalMinutes = _sessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0)
    const totalDistractions = _distractions.length
    const avgEnergyScore =
      _checkins.length > 0
        ? _checkins.reduce((sum, c) => {
            const energyMap = { low: 1, medium: 2, high: 3 }
            return sum + energyMap[c.energyLevel]
          }, 0) /
          _checkins.length /
          3
        : 0.5

    // Weighted scoring: 40% duration, 30% low distractions, 30% energy
    const durationScore = Math.min(totalMinutes / 120, 1) * 40 // Cap at 2 hours
    const distractionScore = Math.max(0, 1 - totalDistractions / 10) * 30
    const energyScore = avgEnergyScore * 30

    return Math.round(durationScore + distractionScore + energyScore)
  },

  // Find productive time patterns
  findPeakHours: (sessions): { hour: number; count: number }[] => {
    const _sessions = sessions ?? storage.getSessions() ?? []
    const hourCounts: Record<number, number> = {}

    _sessions.forEach((session) => {
      const hour = new Date(session.startTime).getHours()
      hourCounts[hour] = (hourCounts[hour] || 0) + 1
    })

    return Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: Number.parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  },

  // Analyze distraction patterns
  analyzeDistractions: (distractions): { type: string; count: number; avgDuration: number }[] => {
    const _distractions = distractions ?? storage.getDistractions() ?? []
    const grouped: Record<string, { count: number; totalDuration: number }> = {}

    _distractions.forEach((d) => {
      if (!grouped[d.type]) {
        grouped[d.type] = { count: 0, totalDuration: 0 }
      }
      grouped[d.type].count++
      grouped[d.type].totalDuration += d.duration
    })

    return Object.entries(grouped)
      .map(([type, data]) => ({
        type,
        count: data.count,
        avgDuration: data.totalDuration / data.count,
      }))
      .sort((a, b) => b.count - a.count)
  },

  // Generate AI insights
  generateInsights: (): string[] => {
    const sessions = storage.getSessions()
    const distractions = storage.getDistractions()
    const checkins = storage.getCheckins()
    const insights: string[] = []

    if (sessions.length < 5) {
      insights.push("Keep building your focus habit! Complete more sessions to unlock personalized insights.")
      return insights
    }

    // Peak time insight
    const peakHours = analyticsEngine.findPeakHours(sessions)
    if (peakHours.length > 0) {
      const topHour = peakHours[0].hour
      const period = topHour < 12 ? "morning" : topHour < 17 ? "afternoon" : "evening"
      insights.push(`You focus best in the ${period} around ${topHour % 12 || 12}${topHour < 12 ? "AM" : "PM"}`)
    }

    // Distraction analysis
    const distractionAnalysis = analyticsEngine.analyzeDistractions(distractions)
    if (distractionAnalysis.length > 0) {
      const topDistraction = distractionAnalysis[0]
      insights.push(`${topDistraction.type} is your most common distraction (${topDistraction.count} times)`)
    }

    // Session length optimization
    const avgDuration = sessions.reduce((sum, s) => sum + (s.actualDuration || 0), 0) / sessions.length
    if (avgDuration < 25) {
      insights.push("Try longer sessions (25-50 min) for deeper focus")
    } else if (avgDuration > 50) {
      insights.push("Consider shorter sessions with breaks to maintain peak performance")
    }

    // Energy patterns
    const lowEnergyCount = checkins.filter((c) => c.energyLevel === "low").length
    if (lowEnergyCount > checkins.length * 0.4) {
      insights.push("Your energy dips often. Schedule challenging tasks during your peak hours")
    }

    return insights
  },

  // Update streak
  updateStreak: (): void => {
    const streak = storage.getStreak()
    const sessions = storage.getSessions()
    const today = new Date().toDateString()

    if (sessions.length === 0) return

    const todaySessions = sessions.filter((s) => new Date(s.startTime).toDateString() === today)

    if (todaySessions.length > 0) {
      const lastDate = new Date(streak.lastSessionDate).toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()

      if (lastDate === today) {
        // Already counted today
        return
      } else if (lastDate === yesterday) {
        // Continue streak
        streak.currentStreak++
      } else {
        // Reset streak
        streak.currentStreak = 1
      }

      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak)
      streak.lastSessionDate = today

      storage.setStreak(streak)
    }
  },
}
