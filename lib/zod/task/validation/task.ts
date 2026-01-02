import { z } from "zod";
export const ValidateCreateTask = z.object({
    name: z.string().min(2, {message: "Must be at  least 2 or more characters long"}).max(20,{message: "Must be less than 30 characters"}),
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
    // id: z.uuid({ message: "Invalid ID format. Must be a valid UUID." }),
    name: z.string().min(2, {message: "Must be at  least 2 or more characters long"}).max(20,{message: "Must be less than 30 characters"}),
    single_date: z.iso.date().nullable().optional(),
    date_start: z.iso.date().nullable().optional(),
    date_end: z.iso.date().nullable().optional(),
    category: z.enum(["work","study","personal"]),
    date_type: z.enum(["no_date","single","range"]),
    reminder: z.iso.time({ precision: -1 }).nullable().optional()
    // 
  })
  .refine(
    data => {
      if (!data.date_start || !data.date_end) return true;
      return new Date(data.date_end) > new Date(data.date_start);
    },
    {
      message: "End date must be after start date ",
      path: ["date_end"], 
    }
  );


