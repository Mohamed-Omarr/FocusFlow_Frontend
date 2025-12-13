export const CategoryTypes = {
  work: "work",
  study: "study",
  personal: "personal",
} as const;
export const DateTypes = {
  no_date: "no-date",
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
  dateType: DateType;
  // optionals
  singleDate?: string; //
  startDate?: string; //
  endDate?: string; //
  reminder?: string; //
  //

  postponed: boolean; // default false
  completed: boolean; // default false
}


