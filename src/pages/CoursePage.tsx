import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchCourseById } from '../api/courses';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import type { Course } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { LessonList } from '../components/LessonList';
import { DIFFICULTY_LABELS, formatDuration, getTotalDuration } from '../utils/helpers';
import './CoursePage.css';

export function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    loadProgress,
    startCourse,
    completeLesson,
    getProgressPercent,
    courseProgress,
  } = useProgressStore();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetchCourseById(id).then((data) => {
      setCourse(data ?? null);
      if (data?.lessons.length) {
        setActiveLessonId(data.lessons[0].id);
      }
      setIsLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (user) loadProgress(user.id);
  }, [user, loadProgress]);

  const handleStart = () => {
    if (!user || !course) {
      navigate('/login');
      return;
    }
    startCourse(user.id, course.id);
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (!user || !course) return;
    completeLesson(user.id, course.id, lessonId);

    const sorted = [...course.lessons].sort((a, b) => a.order - b.order);
    const currentIndex = sorted.findIndex((l) => l.id === lessonId);
    if (currentIndex < sorted.length - 1) {
      setActiveLessonId(sorted[currentIndex + 1].id);
    }
  };

  if (isLoading) {
    return <div className="loading container">Загрузка курса...</div>;
  }

  if (!course) {
    return (
      <div className="empty-state container">
        <p>Курс не найден.</p>
        <Link to="/" className="btn btn--primary">На главную</Link>
      </div>
    );
  }

  const progress = user
    ? getProgressPercent(course.id, course.lessons.length)
    : 0;
  const hasStarted = !!courseProgress[course.id];
  const activeLesson = course.lessons.find((l) => l.id === activeLessonId);
  const completedLessons = courseProgress[course.id]?.completedLessons ?? [];

  return (
    <div className="course-page">
      <div className="container">
        <div className="course-page__header">
          <div className="course-page__info">
            <span className="course-page__category">{course.category}</span>
            <h1 className="course-page__title">{course.title}</h1>
            <p className="course-page__description">{course.description}</p>
            <div className="course-page__meta">
              <span className={`badge badge--${course.difficulty}`}>
                {DIFFICULTY_LABELS[course.difficulty]}
              </span>
              <span>{course.lessons.length} уроков</span>
              <span>·</span>
              <span>{formatDuration(getTotalDuration(course.lessons))}</span>
              <span>·</span>
              <span>{course.instructor}</span>
            </div>

            {user && hasStarted && (
              <div className="course-page__progress">
                <span className="course-page__progress-label">Ваш прогресс</span>
                <ProgressBar value={progress} size="lg" />
              </div>
            )}

            {user && !hasStarted && (
              <button className="btn btn--primary btn--lg" onClick={handleStart}>
                Начать обучение
              </button>
            )}

            {!user && (
              <Link to="/login" className="btn btn--primary btn--lg">
                Войти, чтобы начать
              </Link>
            )}
          </div>

          <img
            src={course.image}
            alt={course.title}
            className="course-page__image"
          />
        </div>

        <div className="course-page__content">
          <div className="course-page__lessons">
            <h2 className="section-title">Уроки</h2>
            <LessonList
              lessons={course.lessons}
              activeLessonId={activeLessonId ?? undefined}
              completedLessons={completedLessons}
              onSelectLesson={setActiveLessonId}
              onCompleteLesson={handleCompleteLesson}
              isAuthenticated={!!user && hasStarted}
            />
          </div>

          {activeLesson && (
            <div className="course-page__viewer">
              <h2 className="section-title">{activeLesson.title}</h2>
              <div className="lesson-viewer">
                {activeLesson.type === 'video' ? (
                  <div className="lesson-viewer__video-placeholder">
                    <div className="lesson-viewer__play">▶</div>
                    <p>Видеоурок · {formatDuration(activeLesson.duration)}</p>
                  </div>
                ) : null}
                <div className="lesson-viewer__content">
                  <p>{activeLesson.content}</p>
                </div>
                {user && hasStarted && !completedLessons.includes(activeLesson.id) && (
                  <button
                    className="btn btn--primary"
                    onClick={() => handleCompleteLesson(activeLesson.id)}
                  >
                    Отметить как завершённый
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
