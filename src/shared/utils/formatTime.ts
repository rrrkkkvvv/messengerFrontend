export const formatTime = (dateInput: Date | string): string => {
  const parsedDate =
    typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(parsedDate.getTime())) {
    console.error("Invalid date:", dateInput);
    return "Invalid date";
  }

  const minutes = parsedDate.getMinutes();
  const hours = parsedDate.getHours();

  const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
  const hoursStr = hours < 10 ? `0${hours}` : hours.toString();

  return `${hoursStr}:${minutesStr}`;
};
