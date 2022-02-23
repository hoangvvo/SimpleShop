import type { Dispatch, SetStateAction } from "react";

export const thisMonthDateInit = () => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(0, 0, 0, 0);
  return {
    from: startDate,
    to: endDate,
  };
};

export type RangeProps = {
  range: {
    from: Date;
    to: Date;
  };
  setRange: Dispatch<
    SetStateAction<{
      from: Date;
      to: Date;
    }>
  >;
};
