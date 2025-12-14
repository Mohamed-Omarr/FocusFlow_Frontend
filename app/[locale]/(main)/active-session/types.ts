export type TaskData = {
  name: string;
  duration: number;
  breakMode: "auto" | "manual";
};

export type InterruptionType = "pause" | "cancel";