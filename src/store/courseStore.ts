import { create } from 'zustand';
import type { Course, CourseFilters } from '../types';
import * as coursesApi from '../api/courses';

interface CourseState {
  courses: Course[];
  categories: string[];
  filters: CourseFilters;
  isLoading: boolean;
  error: string | null;
  loadCourses: () => Promise<void>;
  setFilters: (filters: Partial<CourseFilters>) => void;
  getFilteredCourses: () => Course[];
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  categories: [],
  filters: { search: '', category: '', difficulty: '' },
  isLoading: false,
  error: null,

  loadCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const courses = await coursesApi.fetchCourses();
      set({
        courses,
        categories: coursesApi.getCategories(courses),
        isLoading: false,
      });
    } catch {
      set({ error: 'Не удалось загрузить курсы', isLoading: false });
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  getFilteredCourses: () => {
    const { courses, filters } = get();
    return coursesApi.filterCourses(courses, filters);
  },
}));
