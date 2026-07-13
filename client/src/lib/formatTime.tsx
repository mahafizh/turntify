import { formatDistanceToNowStrict } from "date-fns";

export const formatTime = (date: Date) => {
  const diffInMinutes = Math.floor(
    (new Date().getTime() - date.getTime()) / 60000,
  );

  if (diffInMinutes < 1) return "1m";

  const time = formatDistanceToNowStrict(date);
  return time
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d");
};
