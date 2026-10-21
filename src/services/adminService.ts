import { api } from './api';
import { toCategory, toMenuItem, toOrder, toRestaurantSettings } from './responseAdapters';
import type { AdminCustomer, RestaurantSettings } from '../types';

type ApiMenu = Parameters<typeof toMenuItem>[0];
type ApiCategory = Parameters<typeof toCategory>[0];
type ApiOrder = Parameters<typeof toOrder>[0];

function menuPayload(payload: Record<string, unknown>) {
  const { price, imageUrl, available, ...rest } = payload;
  return {
    ...rest,
    priceCents: price,
    image: imageUrl,
    isAvailable: available,
  };
}

function categoryPayload(payload: Record<string, unknown>) {
  const { active, ...rest } = payload;
  return { ...rest, isActive: active };
}

function statusValue(status: string) {
  return status.toLowerCase();
}

function settingsPayload(settings: RestaurantSettings) {
  return {
    ...settings,
    logoUrl: settings.logo,
    deliveryFeeCents: settings.deliveryFee,
  };
}

export const adminService = {
  async dashboard() {
    const { data } = await api.get<{
      metrics?: {
        totalOrders?: number;
        pendingOrders?: number;
        completedOrders?: number;
        revenueCents?: number;
        popularItems?: unknown[];
        unavailableItems?: number;
      };
    }>('/admin/dashboard');
    const metrics = data.metrics ?? {};
    return {
      todaySales: metrics.revenueCents ?? 0,
      todayOrders: metrics.totalOrders ?? 0,
      pendingOrders: metrics.pendingOrders ?? 0,
      completedOrders: metrics.completedOrders ?? 0,
      popularItems: metrics.popularItems ?? [],
      unavailableItems: metrics.unavailableItems ?? 0,
    };
  },

  async listMenu(params?: { page?: number; limit?: number; search?: string; category?: string }) {
    const { data } = await api.get<{ items: ApiMenu[]; total: number }>('/admin/menu', { params });
    return { ...data, items: data.items.map(toMenuItem) };
  },

  async listCategories() {
    const { data } = await api.get<{ categories: ApiCategory[] }>('/admin/categories');
    return data.categories.map(toCategory);
  },

  async createCategory(payload: Record<string, unknown>) {
    const { data } = await api.post<{ category: ApiCategory }>('/admin/categories', categoryPayload(payload));
    return toCategory(data.category);
  },

  async updateCategory(id: string, payload: Record<string, unknown>) {
    const { data } = await api.patch<{ category: ApiCategory }>(`/admin/categories/${id}`, categoryPayload(payload));
    return toCategory(data.category);
  },

  async deleteCategory(id: string) {
    const { data } = await api.delete(`/admin/categories/${id}`);
    return data;
  },

  async createMenu(payload: Record<string, unknown>) {
    const { data } = await api.post<{ item: ApiMenu }>('/admin/menu', menuPayload(payload));
    return toMenuItem(data.item);
  },

  async updateMenu(id: string, payload: Record<string, unknown>) {
    const { data } = await api.patch<{ item: ApiMenu }>(`/admin/menu/${id}`, menuPayload(payload));
    return toMenuItem(data.item);
  },

  async archiveMenu(id: string) {
    const { data } = await api.delete(`/admin/menu/${id}`);
    return data;
  },

  async listOrders(params?: { status?: string; limit?: number; page?: number }) {
    const { status, ...pagination } = params ?? {};
    const { data } = await api.get<{ orders: ApiOrder[]; total: number }>('/admin/orders', {
      params: { ...pagination, status: status ? statusValue(status) : undefined },
    });
    return { ...data, orders: data.orders.map(toOrder) };
  },

  async getOrder(id: string) {
    const { data } = await api.get<{ order: ApiOrder }>(`/admin/orders/${id}`);
    return toOrder(data.order);
  },

  async updateOrderStatus(id: string, status: string, reason?: string) {
    const { data } = await api.patch<{ order: ApiOrder }>(`/orders/${id}/status`, {
      status: statusValue(status),
      reason,
    });
    return toOrder(data.order);
  },

  async listCustomers() {
    const { data } = await api.get<{ customers: AdminCustomer[] }>('/admin/customers');
    return data.customers;
  },

  async getSettings() {
    const { data } = await api.get<{ settings: Parameters<typeof toRestaurantSettings>[0] }>('/admin/settings');
    return toRestaurantSettings(data.settings);
  },

  async updateSettings(payload: RestaurantSettings) {
    const { data } = await api.patch<{ settings: Parameters<typeof toRestaurantSettings>[0] }>(
      '/admin/settings',
      settingsPayload(payload),
    );
    return toRestaurantSettings(data.settings);
  },

  async salesReport(params: { from: string; to: string }) {
    const { data } = await api.get('/admin/reports/sales', { params });
    return data;
  },
};
