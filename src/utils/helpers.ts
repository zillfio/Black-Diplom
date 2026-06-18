export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
};

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} мин`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} ч ${m} мин` : `${h} ч`;
}

export function getTotalDuration(lessons: { duration: number }[]): number {
  return lessons.reduce((sum, l) => sum + l.duration, 0);
}
