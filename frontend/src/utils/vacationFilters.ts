import type { Vacation, VacationFilter } from "../models/vacation";

export const applyVacationFilter = (
  vacations: Vacation[],
  filter: VacationFilter,
  myLikedIds: number[]
): Vacation[] => {
  const now = new Date();

  if (filter === "MY_LIKES") {
    return vacations.filter((v) => myLikedIds.includes(v.VacationID));
  }

  if (filter === "ACTIVE") {
    return vacations.filter((v) => {
      const start = new Date(v.StartDate);
      const end = new Date(v.EndDate);
      return start <= now && end >= now;
    });
  }

  if (filter === "FUTURE") {
    return vacations.filter((v) => new Date(v.StartDate) > now);
  }

  return vacations;
};
