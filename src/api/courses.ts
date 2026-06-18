import type { Course, CourseFilters } from '../types';
import coursesData from './mock/courses.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let coursesCache: Course[] | null = null;

export async function fetchCourses(): Promise<Course[]> {
  if (coursesCache) return coursesCache;
  await delay(300);
  coursesCache = coursesData as Course[];
  return coursesCache;
}

export async function fetchCourseById(id: string): Promise<Course | undefined> {
  const courses = await fetchCourses();
  return courses.find((c) => c.id === id);
}

export function filterCourses(courses: Course[], filters: CourseFilters): Course[] {
  return courses.filter((course) => {
    const matchesSearch =
      !filters.search ||
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesCategory = !filters.category || course.category === filters.category;
    const matchesDifficulty = !filters.difficulty || course.difficulty === filters.difficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });
}

export function getCategories(courses: Course[]): string[] {
  return [...new Set(courses.map((c) => c.category))].sort();
}

export function invalidateCoursesCache(): void {
  coursesCache = null;
}
