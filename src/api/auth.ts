import type { User } from '../types';
import usersData from './mock/users.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AuthResult {
  success: boolean;
  user?: Omit<User, 'password'>;
  error?: string;
}

export async function login(email: string, password: string): Promise<AuthResult> {
  await delay(400);
  const user = (usersData as User[]).find(
    (u) => u.email === email && u.password === password,
  );

  if (!user) {
    return { success: false, error: 'Неверный email или пароль' };
  }

  const { password: _, ...safeUser } = user;
  return { success: true, user: safeUser };
}

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<AuthResult> {
  await delay(400);
  const exists = (usersData as User[]).some((u) => u.email === email);

  if (exists) {
    return { success: false, error: 'Пользователь с таким email уже существует' };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    role: 'student',
    password,
  };

  (usersData as User[]).push(newUser);
  const { password: _, ...safeUser } = newUser;
  return { success: true, user: safeUser };
}
