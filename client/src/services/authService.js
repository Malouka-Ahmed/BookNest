import { apiFetch, getToken } from '../api';

export async function register(credentials) {
  const result = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: credentials,
  });
  localStorage.setItem('token', result.token);
  return result.user;
}

export async function login(credentials) {
  const result = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: credentials,
  });
  localStorage.setItem('token', result.token);
  return result.user;
}

export async function getMe() {
  const result = await apiFetch('/api/auth/me');
  return result.user;
}

export function logout() {
  localStorage.removeItem('token');
}

export function isLoggedIn() {
  return Boolean(getToken());
}
