export type ActiveSessionData = {
  id: string;
  task_name: string;
  planned_duration_minutes: number;
  is_on_break: boolean;
  allowed_break_count: number;
  breaktime_type: string;
  break_duration_minutes: number;
  breaks_taken: number;
  session_status: string;
  is_paused: boolean;
  extended_time_minutes: number;
};


export type ActiveSessionResponse = {
  session: ActiveSessionData;
  remaining_seconds: number;
};

export type InterruptionType = "pause" | "cancel";