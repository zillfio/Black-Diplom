import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';
import { useProgressStore } from '../store/progressStore';
import { CourseCard } from '../components/CourseCard';
import { ProgressBar } from '../components/ProgressBar';
import './ProfilePage.css';

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { courses, loadCourses } = useCourseStore();
  const { loadProgress, getProgressPercent, isCourseCompleted, courseProgress } =
    useProgressStore();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (user) loadProgress(user.id);
  }, [user, loadProgress]);

  if (!user) return <Navigate to="/login" replace />;

  const startedCourseIds = Object.keys(courseProgress);
  const myCourses = courses.filter((c) => startedCourseIds.includes(c.id));
  const activeCourses = myCourses.filter(
    (c) => !isCourseCompleted(c.id, c.lessons.length),
  );
  const completedCourses = myCourses.filter((c) =>
    isCourseCompleted(c.id, c.lessons.length),
  );

  const totalLessons = myCourses.reduce((sum, c) => sum + c.lessons.length, 0);
  const completedLessons = myCourses.reduce(
    (sum, c) => sum + (courseProgress[c.id]?.completedLessons.length ?? 0),
    0,
  );
  const overallProgress = totalLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : 0;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-header__avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="profile-header__name">{user.name}</h1>
            <p className="profile-header__email">{user.email}</p>
            <span className="profile-header__role">
              {user.role === 'admin' ? 'Администратор' : 'Ученик'}
            </span>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-card__value">{myCourses.length}</span>
            <span className="stat-card__label">Мои курсы</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{completedCourses.length}</span>
            <span className="stat-card__label">Завершено</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{completedLessons}</span>
            <span className="stat-card__label">Уроков пройдено</span>
          </div>
          <div className="stat-card stat-card--wide">
            <span className="stat-card__label">Общий прогресс</span>
            <ProgressBar value={overallProgress} size="md" />
          </div>
        </div>

        {activeCourses.length > 0 && (
          <section className="profile-section">
            <h2 className="section-title">Текущие курсы</h2>
            <div className="course-grid">
              {activeCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={getProgressPercent(course.id, course.lessons.length)}
                />
              ))}
            </div>
          </section>
        )}

        {completedCourses.length > 0 && (
          <section className="profile-section">
            <h2 className="section-title">Завершённые курсы</h2>
            <div className="course-grid">
              {completedCourses.map((course) => (
                <CourseCard key={course.id} course={course} progress={100} />
              ))}
            </div>
          </section>
        )}

        {myCourses.length === 0 && (
          <div className="empty-state">
            <p>Вы ещё не начали ни одного курса.</p>
            <Link to="/" className="btn btn--primary">Выбрать курс</Link>
          </div>
        )}
      </div>
    </div>
  );
}
