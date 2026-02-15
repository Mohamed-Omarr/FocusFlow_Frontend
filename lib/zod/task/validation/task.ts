import { z } from "zod";


const BaseTaskSchema = z.object({
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
});



const withDateValidation = (schema: typeof BaseTaskSchema) =>
  schema.superRefine((data, ctx) => {
    /* SINGLE */
    if (data.date_type === "single") {
      if (!data.single_date || !data.reminder) {
        ctx.addIssue({
 code: "custom",
           message: "Single date tasks require a date and a reminder",
          path: ["single_date"],
        });
      }
    }

    /* RANGE */
    if (data.date_type === "range") {
      if (!data.date_start || !data.date_end || !data.reminder) {
        ctx.addIssue({
          code: "custom",
          message:
            "Range tasks require start date, end date, and reminder",
          path: ["date_end"],
        });
      }

      if (
        data.date_start &&
        data.date_end &&
        new Date(data.date_end) < new Date(data.date_start)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "End date must be after start date",
          path: ["date_end"],
        });
      }
    }

    /* NO DATE */
    if (data.date_type === "no_date") {
      if (
        data.single_date ||
        data.date_start ||
        data.date_end ||
        data.reminder
      ) {
        ctx.addIssue({
          code:"custom",
          message: "No date tasks cannot have dates or reminders",
          path: ["date_type"],
        });
      }
    }
  });


  export const ValidateCreateTask = withDateValidation(BaseTaskSchema);

export const ValidatePostponeTask = withDateValidation(BaseTaskSchema);
