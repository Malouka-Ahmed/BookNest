// Small fetch helper shared by the pages.
// Auth contract with Person 1: after login, save the JWT with
//   localStorage.setItem('token', token)
// and every request made through apiFetch sends it as a Bearer token.

const API_URL = import.meta.env.VITE_API_URL || ''; // '' = use the Vite proxy (/api -> :5000)

export function getToken() {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}

export async function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return data;
}

// Reading list statuses (must match UserBook.STATUSES on the server)
export const STATUSES = [
  { value: 'want-to-read', label: 'Want to Read' },
  { value: 'reading', label: 'Currently Reading' },
  { value: 'completed', label: 'Completed' },
];
