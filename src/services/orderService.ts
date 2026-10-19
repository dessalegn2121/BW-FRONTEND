import { api } from './api';
import type { Order } from '../types';
import { toOrder } from './responseAdapters';

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  tableNumber?: string;
  dineInDate?: string;
  dineInTime?: string;
  dineInTimezoneOffset?: number;
  pickupName?: string;
  pickupPhone?: string;
  deliveryAddress?: string;
  paymentReceipt?: string;
  paymentMethod?: string;
  notes?: string;
  items: {
    menuItemId: string;
    quantity: number;
    customizations?: { name: string; option: string; extraPrice: number }[];
  }[];
}

export const orderService = {
  async create(payload: CreateOrderPayload) {
    const { data } = await api.post<{ order: Parameters<typeof toOrder>[0] }>('/orders', {
      customerName: payload.customerName,
      phone: payload.customerPhone,
      email: payload.customerEmail,
      orderType: payload.orderType === 'dine-in' ? 'dine_in' : payload.orderType,
      tableNumber: payload.tableNumber,
      dineInDate: payload.dineInDate,
      dineInTime: payload.dineInTime,
      dineInTimezoneOffset: payload.dineInTimezoneOffset,
      pickupName: payload.pickupName,
      pickupPhone: payload.pickupPhone,
      deliveryAddress: payload.deliveryAddress,
      paymentReceipt: payload.paymentReceipt,
      paymentMethod: payload.paymentMethod === 'mobile' ? 'mobile_transfer' : payload.paymentMethod,
      notes: payload.notes,
      items: payload.items.map((item) => ({
        productId: item.menuItemId,
        quantity: item.quantity,
      })),
    });
    return toOrder(data.order);
  },
  async get(id: string) {
    const { data } = await api.get<{ order: Parameters<typeof toOrder>[0] }>(`/orders/${id}`);
    return toOrder(data.order);
  },
  async lookup(orderNumber: string, phone: string) {
    const { data } = await api.get<{ order: Parameters<typeof toOrder>[0] }>('/orders/lookup', {
      params: { orderNumber, phone },
    });
    return toOrder(data.order);
  },
};