export const convertToMinute = (type: "full" | "short", seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (type === "full") return `${mins} min ${secs < 10 ? "0" + secs : secs} sec`;
  if (type === "short") return `${mins}:${secs < 10 ? "0" + secs : secs}`;
    
};
