import type { LocationHours } from "@coffee-daily/types";

function toMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function isLocationOpenNow(
  hours: LocationHours,
  now: Date = new Date(),
) {
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const range = isWeekend ? hours.weekend : hours.weekday;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return (
    nowMinutes >= toMinutes(range.open) && nowMinutes < toMinutes(range.close)
  );
}
