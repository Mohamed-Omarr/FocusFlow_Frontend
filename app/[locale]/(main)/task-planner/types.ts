export const CategoryTypes = {
  work: "work",
  study: "study",
  personal: "personal",
} as const;
export const DateTypes = {
  no_date: "no_date",
  single: "single",
  range: "range",
} as const;

// Type for the values of the constants
export type CategoryType = typeof CategoryTypes[keyof typeof CategoryTypes];
export type DateType = typeof DateTypes[keyof typeof DateTypes];

export type TaskType = {
  id: string;// default uuid
  name: string;
  category: CategoryType;  
  date_type: DateType;
  // optionals
  single_date: string | null; //
  date_start: string | null; //
  date_end: string | null; //
  reminder: string | null; //
  //

  postponed: boolean; // default false
  completed: boolean; // default false
}


