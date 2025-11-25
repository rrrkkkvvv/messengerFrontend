export const formatTime = (dateInput: Date | string | number): string => {
  if (typeof dateInput === "number") {
    const minutes = Math.floor(dateInput / 60);
    const seconds = Math.round(dateInput) % 60;

    const hours = Math.floor(dateInput / 3600);

    if (hours) {
      return `${minutes < 10 ? `0${minutes}` : minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
      }`;
    } else {
      return `${minutes < 10 ? `0${minutes}` : minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
      }`;
    }
  } else if (typeof dateInput === "string" || dateInput instanceof Date) {
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
  }
  return "";
};
