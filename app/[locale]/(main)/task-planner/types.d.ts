
interface Task {
  id: string;
  name: string;
  category: string;
  dateType:"no-date"|"single"|"range";
  startDate?: string;
  endDate?: string;
  reminder?: { time: string };
  postponed?: boolean
}
