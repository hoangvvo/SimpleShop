export const dayStartOf = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0);
  return d;
};

export const dayEndOf = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59);
  return d;
};
