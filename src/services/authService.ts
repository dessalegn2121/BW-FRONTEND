import { api } from './api';
import type { AuthResponse, User } from '../types';

type BackendUser = Omit<Partial<User>, '_id'> & { id?: string; _id?: string };
type BackendAuthResponse = { token?: string; user?: BackendUser };

function normalizeAuth(response: BackendAuthResponse): AuthResponse {
  if (!response.token || !response.user) {
    throw new Error('The server returned an incomplete authentication response.');
  }
  return {
    token: response.token,
    user: {
      _id: response.user._id ?? response.user.id ?? '',
      name: response.user.name ?? '',
      email: response.user.email ?? '',
      phone: response.user.phone,
      role: response.user.role ?? 'customer',
      status: response.user.status ?? 'active',
    },
  };
}

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<BackendAuthResponse>('/auth/login', { email, password });
    return normalizeAuth(data);
  },

  async register(payload: { name: string; email: string; password: string; phone?: string }) {
    const { data } = await api.post<BackendAuthResponse>('/auth/register', payload);
    return normalizeAuth(data);
  },

  async me() {
    const { data } = await api.get<{ user: BackendUser }>('/auth/me');
    return normalizeAuth({ token: localStorage.getItem('bw_token') ?? undefined, user: data.user }).user;
  },
};
