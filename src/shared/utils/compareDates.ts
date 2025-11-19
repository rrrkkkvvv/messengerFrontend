export const compareDates = (
  firstDate: string | Date,
  secondDate: string | Date
): boolean => {
  const parsedFirstDate =
    typeof firstDate === "string" ? new Date(firstDate) : firstDate;
  const parsedSecondDate =
    typeof secondDate === "string" ? new Date(secondDate) : secondDate;

  return (
    parsedFirstDate.getDate() === parsedSecondDate.getDate() &&
    parsedFirstDate.getMonth() === parsedSecondDate.getMonth() &&
    parsedFirstDate.getFullYear() === parsedSecondDate.getFullYear()
  );
};
