interface Task {
  id: string;
  name: string;
  category: string;
  startDate?: string;
  endDate?: string;
  reminder?: { time: string };
}