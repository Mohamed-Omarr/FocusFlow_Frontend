export const addOneDay = (date?: string) => {
  if (!date) return undefined;
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};


