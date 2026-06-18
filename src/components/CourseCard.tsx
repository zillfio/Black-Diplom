import { Link } from 'react-router-dom';
import type { Course } from '../types';
import { ProgressBar } from './ProgressBar';
import { DIFFICULTY_LABELS, formatDuration, getTotalDuration } from '../utils/helpers';
import './CourseCard.css';

interface CourseCardProps {
  course: Course;
  progress?: number;
}

export function CourseCard({ course, progress }: CourseCardProps) {
  const totalDuration = formatDuration(getTotalDuration(course.lessons));

  return (
    <Link to={`/course/${course.id}`} className="course-card">
      <div className="course-card__image-wrap">
        <img
          src={course.image}
          alt={course.title}
          className="course-card__image"
          loading="lazy"
        />
        <span className={`course-card__badge course-card__badge--${course.difficulty}`}>
          {DIFFICULTY_LABELS[course.difficulty]}
        </span>
      </div>

      <div className="course-card__body">
        <span className="course-card__category">{course.category}</span>
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__description">{course.description}</p>

        <div className="course-card__meta">
          <span>{course.lessons.length} уроков</span>
          <span>·</span>
          <span>{totalDuration}</span>
        </div>

        {progress !== undefined && progress > 0 && (
          <div className="course-card__progress">
            <ProgressBar value={progress} size="sm" />
          </div>
        )}
      </div>
    </Link>
  );
}
