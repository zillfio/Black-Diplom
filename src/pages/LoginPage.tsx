import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, login, register, isLoading, error, clearError } = useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = isRegister
      ? await register(email, password, name)
      : await login(email, password);
    if (success) navigate('/');
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    clearError();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <span className="login-card__logo">◈</span>
          <h1>{isRegister ? 'Регистрация' : 'Вход в SkillTrack'}</h1>
          <p>
            {isRegister
              ? 'Создайте аккаунт и начните обучение'
              : 'Войдите, чтобы отслеживать прогресс'}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                id="name"
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ваше имя"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••"
              minLength={6}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn btn--primary btn--full" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="login-card__footer">
          <button className="btn btn--ghost" onClick={toggleMode}>
            {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
          </button>
        </div>

        {!isRegister && (
          <div className="login-hint">
            <p>Тестовые аккаунты:</p>
            <code>student@skilltrack.ru / 123456</code>
            <code>admin@skilltrack.ru / admin123</code>
          </div>
        )}
      </div>
    </div>
  );
}
