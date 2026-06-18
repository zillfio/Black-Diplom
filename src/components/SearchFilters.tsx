import type { Difficulty } from '../types';
import { DIFFICULTY_LABELS } from '../utils/helpers';
import './SearchFilters.css';

interface SearchFiltersProps {
  search: string;
  category: string;
  difficulty: Difficulty | '';
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDifficultyChange: (value: Difficulty | '') => void;
}

export function SearchFilters({
  search,
  category,
  difficulty,
  categories,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
}: SearchFiltersProps) {
  return (
    <div className="search-filters">
      <div className="search-filters__search">
        <svg className="search-filters__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          className="input search-filters__input"
          placeholder="Поиск курсов..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="select"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Все категории</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        className="select"
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as Difficulty | '')}
      >
        <option value="">Все уровни</option>
        {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
          <option key={d} value={d}>{DIFFICULTY_LABELS[d]}</option>
        ))}
      </select>
    </div>
  );
}
