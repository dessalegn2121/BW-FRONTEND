import { api } from './api';
import type { Category, MenuItem, Paginated } from '../types';
import { toCategory, toMenuItem } from './responseAdapters';

type BackendCategory = Parameters<typeof toCategory>[0];
type BackendMenuItem = Parameters<typeof toMenuItem>[0];

export const menuService = {
  async list(params?: { search?: string; category?: string; page?: number; limit?: number }) {
    const { data } = await api.get<{
      items: BackendMenuItem[];
      total: number;
      page?: number;
      pages?: number;
    }>('/menu', { params });
    return {
      items: data.items.map(toMenuItem),
      total: data.total,
      page: data.page ?? params?.page ?? 1,
      pages: data.pages ?? 1,
    } satisfies Paginated<MenuItem>;
  },

  async get(id: string) {
    const { data } = await api.get<{ item: BackendMenuItem }>(`/menu/${id}`);
    return toMenuItem(data.item);
  },

  async categories() {
    const { data } = await api.get<{ categories: BackendCategory[] }>('/menu/categories');
    return data.categories.map(toCategory);
  },
};