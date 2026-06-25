export type RecurrencePattern = "daily" | "weekly" | "monthly" | "yearly" | "once";

export interface Timeframe {
  readonly startDate: string;   // ISO 8601 date string
  readonly endDate?: string;    // optional — open-ended goals have no end
  readonly recurrence?: RecurrencePattern;
}

export function timeframe(
  startDate: string,
  endDate?: string,
  recurrence?: RecurrencePattern
): Timeframe {
  return { startDate, endDate, recurrence };
}

export function isActive(tf: Timeframe, now = new Date()): boolean {
  const start = new Date(tf.startDate);
  if (now < start) return false;
  if (tf.endDate && now > new Date(tf.endDate)) return false;
  return true;
}
