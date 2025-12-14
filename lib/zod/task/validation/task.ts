import { z } from "zod";
export const ValidateCreateTask = z.object({
    name: z.string().min(2, {message: "Must be at  least 2 or more characters long"}).max(20,{message: "Must be less than 30 characters"}),
    category: z.enum(["work","study","personal"]),
    dateType: z.enum(["no-date","single","range"]),
    singleDate: z.iso.date().optional(),
    startDate: z.iso.date().optional(),
    endDate: z.iso.date().optional(),
    reminder: z.iso.time({ precision: -1 }).optional(),
    
}).refine(
    data => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) > new Date(data.startDate);
    },
    {
      message: "End date must be after start date ",
      path: ["endDate"], 
    }
  );


export const ValidatePostponeTask = z
  .object({
    singleDate: z.iso.date().optional(),
    startDate: z.iso.date().optional(),
    endDate: z.iso.date().optional(),
  })
  .refine(
    data => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) > new Date(data.startDate);
    },
    {
      message: "End date must be after start date ",
      path: ["endDate"], 
    }
  );


