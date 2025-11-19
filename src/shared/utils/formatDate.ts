const monthsNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const formatDate = (dateInput: Date | string): string => {
  const parsedDate =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (
    new Date().getDate() - parsedDate.getDate() === 1 &&
    new Date().getMonth() === parsedDate.getMonth() &&
    new Date().getFullYear() === parsedDate.getFullYear()
  ) {
    return "Yesterday";
  } else {
    if (
      new Date().getDate() === parsedDate.getDate() &&
      new Date().getMonth() === parsedDate.getMonth() &&
      new Date().getFullYear() === parsedDate.getFullYear()
    ) {
      return `Today`;
    } else {
      const month = monthsNames[parsedDate.getMonth()];
      const result = `${month} ${
        parsedDate.getDate() <= 9
          ? "0" + parsedDate.getDate()
          : parsedDate.getDate()
      }`;

      if (new Date().getFullYear() !== parsedDate.getFullYear()) {
        result.concat(`.${parsedDate.getFullYear()}`);
      }
      return result;
    }
  }
};
