import api from './axios.js';
import { setStoredToken } from './tokenStorage.js';

export { getStoredToken, setStoredToken } from './tokenStorage.js';

function apiOrigin() {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
  return base.replace(/\/api\/v1\/?$/, '');
}

export async function getAuthProviders() {
  const { data } = await api.get('/auth/providers');
  return data.data;
}

export function getSocialAuthUrl(provider) {
  return `${apiOrigin()}/auth/${provider}/redirect`;
}

export async function register(payload) {
  const { data } = await api.post('/register', payload);
  setStoredToken(data.token);
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/login', { email, password });
  setStoredToken(data.token);
  return data;
}

export async function fetchMe() {
  const { data } = await api.get('/me');
  return data.user;
}

export async function logout() {
  try {
    await api.post('/logout');
  } finally {
    setStoredToken(null);
  }
}

export function isAdminRole(role) {
  return role === 'admin';
}

export function isCustomerRole(role) {
  return role === 'customer';
}

export function getPostLoginPath(role) {
  return isAdminRole(role) ? '/admin' : '/products';
}
