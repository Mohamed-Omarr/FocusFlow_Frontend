interface Session {
  name: string;
  duration: string;
  score: number;
  breaks: number;
  startTime: string;
  endTime: string;
  date: string;
  cancelReason?: string;
  pauseReason?: string;
}