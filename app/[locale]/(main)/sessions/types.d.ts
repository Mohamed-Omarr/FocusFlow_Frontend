type Session = {
    id: string; 
    task_id: string; 

    start_time: string; // timestamptz (ISO string)
    end_time: string; // timestamptz (ISO string)

    planned_duration_minutes: number;
    extended_time_minutes: number | null;
    total_pause_minutes: number | null;
    total_break_minutes: number | null;

    is_canceled: boolean;
    cancel_reason: string | null;

   created_at: string; // timestamptz (ISO string)

    task_name: string;
    task_category: string;

    pauses: {
        reason: string;
    }[]; // jsonb
};
