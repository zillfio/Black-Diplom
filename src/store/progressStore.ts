import { create } from 'zustand';
import type { CourseProgress } from '../types';
import * as progressApi from '../api/progress';

interface ProgressState {
  courseProgress: Record<string, CourseProgress>;
  loadProgress: (userId: string) => void;
  startCourse: (userId: string, courseId: string) => void;
  completeLesson: (userId: string, courseId: string, lessonId: string) => void;
  getProgressPercent: (courseId: string, totalLessons: number) => number;
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;
  isCourseCompleted: (courseId: string, totalLessons: number) => boolean;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  courseProgress: {},

  loadProgress: (userId) => {
    const userProgress = progressApi.getUserProgress(userId);
    set({ courseProgress: userProgress.courses });
  },

  startCourse: (userId, courseId) => {
    const progress = progressApi.startCourse(userId, courseId);
    set((state) => ({
      courseProgress: { ...state.courseProgress, [courseId]: progress },
    }));
  },

  completeLesson: (userId, courseId, lessonId) => {
    const progress = progressApi.completeLesson(userId, courseId, lessonId);
    set((state) => ({
      courseProgress: { ...state.courseProgress, [courseId]: progress },
    }));
  },

  getProgressPercent: (courseId, totalLessons) => {
    const progress = get().courseProgress[courseId];
    if (!progress) return 0;
    return progressApi.calculateProgress(totalLessons, progress.completedLessons);
  },

  isLessonCompleted: (courseId, lessonId) => {
    const progress = get().courseProgress[courseId];
    return progress?.completedLessons.includes(lessonId) ?? false;
  },

  isCourseCompleted: (courseId, totalLessons) => {
    return get().getProgressPercent(courseId, totalLessons) === 100;
  },
}));
