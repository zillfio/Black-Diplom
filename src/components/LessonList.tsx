import type { Lesson } from '../types';
import { formatDuration } from '../utils/helpers';
import './LessonList.css';

interface LessonListProps {
  lessons: Lesson[];
  activeLessonId?: string;
  completedLessons: string[];
  onSelectLesson: (lessonId: string) => void;
  onCompleteLesson: (lessonId: string) => void;
  isAuthenticated: boolean;
}

export function LessonList({
  lessons,
  activeLessonId,
  completedLessons,
  onSelectLesson,
  onCompleteLesson,
  isAuthenticated,
}: LessonListProps) {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);

  return (
    <div className="lesson-list">
      {sorted.map((lesson, index) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const isActive = lesson.id === activeLessonId;

        return (
          <div
            key={lesson.id}
            className={`lesson-item ${isActive ? 'lesson-item--active' : ''} ${isCompleted ? 'lesson-item--completed' : ''}`}
          >
            <button
              className="lesson-item__main"
              onClick={() => onSelectLesson(lesson.id)}
            >
              <span className="lesson-item__number">
                {isCompleted ? '✓' : index + 1}
              </span>
              <div className="lesson-item__info">
                <span className="lesson-item__title">{lesson.title}</span>
                <span className="lesson-item__meta">
                  {lesson.type === 'video' ? '▶ Видео' : '📄 Текст'}
                  {' · '}
                  {formatDuration(lesson.duration)}
                </span>
              </div>
            </button>

            {isActive && isAuthenticated && !isCompleted && (
              <button
                className="btn btn--primary btn--sm lesson-item__complete"
                onClick={() => onCompleteLesson(lesson.id)}
              >
                Завершить
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
