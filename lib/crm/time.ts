export function endOfTodayIn(timeZone: string, now: Date) {
  const calendarDate = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const today = calendarDate.format(now);
  let lower = now.getTime();
  let upper = lower + 48 * 60 * 60 * 1000;

  // Find the next calendar day without assuming a fixed day length or UTC offset.
  while (upper - lower > 1) {
    const middle = lower + Math.floor((upper - lower) / 2);
    if (calendarDate.format(middle) === today) lower = middle;
    else upper = middle;
  }
  return new Date(upper);
}
