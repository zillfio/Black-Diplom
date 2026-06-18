import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Header.css';

export function Header() {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="header__logo">
          <span className="header__logo-icon">◈</span>
          SkillTrack
        </Link>

        <nav className="header__nav">
          <Link
            to="/"
            className={`header__link ${location.pathname === '/' ? 'header__link--active' : ''}`}
          >
            Курсы
          </Link>
          {user && (
            <Link
              to="/profile"
              className={`header__link ${location.pathname === '/profile' ? 'header__link--active' : ''}`}
            >
              Личный кабинет
            </Link>
          )}
        </nav>

        <div className="header__actions">
          {user ? (
            <div className="header__user">
              <span className="header__user-name">{user.name}</span>
              <button className="btn btn--ghost btn--sm" onClick={logout}>
                Выйти
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm">
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
