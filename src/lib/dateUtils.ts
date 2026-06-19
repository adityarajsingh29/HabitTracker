import { format, subDays, eachDayOfInterval, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, getDaysInMonth } from 'date-fns';

export function getMonthDays(date: Date = new Date()) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  
  // To make a proper calendar grid, we might need to pad the start and end
  // with days from previous/next months depending on the startOfWeek.
  // But for a simple GitHub heatmap (rolling 30 days or similar), we can just get last 30 days:
  return eachDayOfInterval({
    start: start,
    end: end,
  });
}

export function getRollingDays(days: number = 30) {
  const today = new Date();
  return eachDayOfInterval({
    start: subDays(today, days - 1),
    end: today,
  });
}

export function generateCalendarGrid(date: Date = new Date()) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
}

export function isSameDayString(date1: Date | string, date2: Date | string) {
  return isSameDay(new Date(date1), new Date(date2));
}

export function formatDateString(date: Date) {
  return format(date, 'yyyy-MM-dd');
}
