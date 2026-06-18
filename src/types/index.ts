export type UserRole = 'student' | 'admin';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type LessonType = 'video' | 'text';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: number;
  content: string;
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  image: string;
  instructor: string;
  lessons: Lesson[];
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  startedAt: string;
  lastAccessedAt: string;
}

export interface UserProgress {
  userId: string;
  courses: Record<string, CourseProgress>;
}

export interface CourseFilters {
  search: string;
  category: string;
  difficulty: Difficulty | '';
}
