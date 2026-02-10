import { z } from "zod";
export const ValidateCreateTask = z.object({
    name: z.string().min(0, {message: "Must be at  least 2 or more characters long"}).max(20,{message: "Must be less than 30 characters"}),
    category: z.enum(["work","study","personal"]),
    date_type: z.enum(["no_date","single","range"]),
    single_date: z.iso.date().nullable().optional(),
    date_start: z.iso.date().nullable().optional(),
    date_end: z.iso.date().nullable().optional(),
    reminder: z.iso.time({ precision: -1 }).nullable().optional()
    
}).refine(
    data => {
      if (!data.date_start || !data.date_end) return true;
      return new Date(data.date_end) > new Date(data.date_start);
    },
    {
      message: "End date must be after start date ",
      path: ["date_end"], 
    }
  );

export const ValidatePostponeTask = z
  .object({
    name: z
      .string()
      .min(2, { message: "Must be at least 2 characters long" })
      .max(30, { message: "Must be less than 30 characters" }),

    category: z.enum(["work", "study", "personal"]),

    date_type: z.enum(["no_date", "single", "range"]),

    single_date: z.iso.date().nullable().optional(),
    date_start: z.iso.date().nullable().optional(),
    date_end: z.iso.date().nullable().optional(),

    reminder: z.iso.time({ precision: -1 }).nullable().optional(),
  })

  /* ───────────── SINGLE DATE RULE ───────────── */
  .refine(
    (data) =>
      data.date_type !== "single" ||
      (!!data.single_date && !!data.reminder),
    {
      message: "Single date tasks require a date and a reminder",
      path: ["single_date"],
    }
  )

  /* ───────────── RANGE DATE RULE ───────────── */
  .refine(
    (data) =>
      data.date_type !== "range" ||
      (!!data.date_start && !!data.date_end && !!data.reminder),
    {
      message: "Range tasks require start date, end date, and reminder",
      path: ["date_end"],
    }
  )

  /* ───────────── NO DATE RULE ───────────── */
  .refine(
    (data) =>
      data.date_type !== "no_date" ||
      (!data.single_date &&
        !data.date_start &&
        !data.date_end &&
        !data.reminder),
    {
      message: "No date tasks cannot have dates or reminders",
      path: ["date_type"],
    }
  )

  /* ───────────── RANGE ORDER RULE ───────────── */
  .refine(
    (data) => {
      if (data.date_type !== "range") return true;
      return new Date(data.date_end!) >= new Date(data.date_start!);
    },
    {
      message: "End date must be after start date",
      path: ["date_end"],
    }
  );

