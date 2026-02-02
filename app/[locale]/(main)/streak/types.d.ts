type UserProgress = {
    current_streak: number;
    longest_streak: number;
    targetStars: number,
    currentStars: number,
};


type WeeklyDay = {
  day: string; // "Mon", "Tue", ...
};

type Milestones = {
  id: string;
  title: string;
  description: string;
  icon: string;
  achieved: boolean;
};
