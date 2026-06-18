import type { CourseProgress, UserProgress } from '../types';

const STORAGE_KEY = 'skilltrack_progress';

function loadAll(): Record<string, UserProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAll(data: Record<string, UserProgress>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getUserProgress(userId: string): UserProgress {
  const all = loadAll();
  return all[userId] ?? { userId, courses: {} };
}

export function saveUserProgress(progress: UserProgress): void {
  const all = loadAll();
  all[progress.userId] = progress;
  saveAll(all);
}

export function getCourseProgress(
  userId: string,
  courseId: string,
): CourseProgress | undefined {
  const userProgress = getUserProgress(userId);
  return userProgress.courses[courseId];
}

export function startCourse(userId: string, courseId: string): CourseProgress {
  const userProgress = getUserProgress(userId);
  const now = new Date().toISOString();

  if (!userProgress.courses[courseId]) {
    userProgress.courses[courseId] = {
      courseId,
      completedLessons: [],
      startedAt: now,
      lastAccessedAt: now,
    };
    saveUserProgress(userProgress);
  }

  return userProgress.courses[courseId];
}

export function completeLesson(
  userId: string,
  courseId: string,
  lessonId: string,
): CourseProgress {
  const userProgress = getUserProgress(userId);
  const now = new Date().toISOString();

  if (!userProgress.courses[courseId]) {
    userProgress.courses[courseId] = {
      courseId,
      completedLessons: [],
      startedAt: now,
      lastAccessedAt: now,
    };
  }

  const courseProgress = userProgress.courses[courseId];
  if (!courseProgress.completedLessons.includes(lessonId)) {
    courseProgress.completedLessons.push(lessonId);
  }
  courseProgress.lastAccessedAt = now;

  saveUserProgress(userProgress);
  return courseProgress;
}

export function calculateProgress(
  totalLessons: number,
  completedLessons: string[],
): number {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons.length / totalLessons) * 100);
}
