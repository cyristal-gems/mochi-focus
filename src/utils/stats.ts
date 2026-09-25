export interface StudyDay {
  seconds: number;
  sessions: number;
}
export type History = Record<string, StudyDay>;
export function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function summarize(history: History, now = new Date()) {
  const days = Object.keys(history)
    .filter((k) => history[k].seconds >= 1)
    .sort();
  let longest = 0,
    run = 0,
    previous = "";
  for (const day of days) {
    const d = new Date(`${day}T12:00:00`);
    d.setDate(d.getDate() - 1);
    run = dateKey(d) === previous ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = day;
  }
  let streak = 0;
  const cursor = new Date(now);
  if (!days.includes(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (days.includes(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return {
    total: Object.values(history).reduce((a, d) => a + d.seconds, 0),
    sessions: Object.values(history).reduce((a, d) => a + d.sessions, 0),
    today: history[dateKey(now)]?.seconds || 0,
    streak,
    longest,
  };
}
export function duration(s: number) {
  const m = Math.floor(s / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}
