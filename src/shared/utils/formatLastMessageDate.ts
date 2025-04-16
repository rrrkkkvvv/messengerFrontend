export const formatLastMessageDate = (dateInput: Date | string): string => {
  const parsedDate =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid date:", dateInput);
    return "Invalid date";
  }

  if (
    new Date().getDate() - parsedDate.getDate() === 1 &&
    new Date().getMonth() === parsedDate.getMonth() &&
    new Date().getFullYear() === parsedDate.getFullYear()
  ) {
    return "Yesterday";
  } else if (
    new Date().getDate() === parsedDate.getDate() &&
    new Date().getMonth() === parsedDate.getMonth() &&
    new Date().getFullYear() === parsedDate.getFullYear()
  ) {
    const minutes = parsedDate.getMinutes();
    const hours = parsedDate.getHours();

    const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
    const hoursStr = hours < 10 ? `0${hours}` : hours.toString();

    return `${hoursStr}:${minutesStr}`;
  } else {
    return `${
      parsedDate.getDate() <= 9
        ? "0" + parsedDate.getDate()
        : parsedDate.getDate()
    }.${
      parsedDate.getMonth() + 1 <= 9
        ? "0" + (parsedDate.getMonth() + 1)
        : parsedDate.getMonth() + 1
    }.${parsedDate.getFullYear()}`;
  }
};
