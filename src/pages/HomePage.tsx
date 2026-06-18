import { useEffect } from 'react';
import { useCourseStore } from '../store/courseStore';
import { useAuthStore } from '../store/authStore';
import { useProgressStore } from '../store/progressStore';
import { CourseCard } from '../components/CourseCard';
import { SearchFilters } from '../components/SearchFilters';
import './HomePage.css';

export function HomePage() {
  const { loadCourses, filters, setFilters, categories, isLoading, getFilteredCourses } =
    useCourseStore();
  const user = useAuthStore((s) => s.user);
  const { loadProgress, getProgressPercent } = useProgressStore();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (user) loadProgress(user.id);
  }, [user, loadProgress]);

  const filteredCourses = getFilteredCourses();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1 className="hero__title">
            Учись. Расти. <span className="hero__accent">Достигай целей.</span>
          </h1>
          <p className="hero__subtitle">
            SkillTrack — платформа онлайн-курсов с отслеживанием прогресса в реальном времени
          </p>
        </div>
      </section>

      <section className="container home-page__content">
        <SearchFilters
          search={filters.search}
          category={filters.category}
          difficulty={filters.difficulty}
          categories={categories}
          onSearchChange={(v) => setFilters({ search: v })}
          onCategoryChange={(v) => setFilters({ category: v })}
          onDifficultyChange={(v) => setFilters({ difficulty: v })}
        />

        {isLoading ? (
          <div className="loading">Загрузка курсов...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state">
            <p>Курсы не найдены. Попробуйте изменить фильтры.</p>
          </div>
        ) : (
          <div className="course-grid">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={
                  user
                    ? getProgressPercent(course.id, course.lessons.length)
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
