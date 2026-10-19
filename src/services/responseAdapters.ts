import type { Category, MenuItem, Order, OrderStatus, OrderType, PaymentStatus, RestaurantSettings } from '../types';

type ApiCategory = Partial<Category> & { id?: string; isActive?: boolean };
type ApiMenuItem = Omit<Partial<MenuItem>, 'price' | 'category' | 'customizations'> & {
  id?: string;
  price?: number;
  priceCents?: number;
  image?: string;
  isAvailable?: boolean;
  customizations?: string[] | MenuItem['customizations'];
  category?: string | ApiCategory;
};
type ApiOrder = Omit<Partial<Order>, 'items'> & {
  id?: string;
  phone?: string;
  email?: string;
  subtotalCents?: number;
  deliveryFeeCents?: number;
  totalCents?: number;
  status?: string;
  orderType?: string;
  dineInDate?: string;
  dineInTime?: string;
  dineInTimezoneOffset?: number;
  pickupName?: string;
  pickupPhone?: string;
  paymentReceipt?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  items?: Array<{
    menuItem?: string;
    productId?: string;
    name?: string;
    unitPrice?: number;
    unitPriceCents?: number;
    quantity?: number;
    customizations?: Order['items'][number]['customizations'];
  }>;
};

export function toCategory(category: ApiCategory): Category {
  return {
    _id: category._id ?? category.id ?? '',
    name: category.name ?? '',
    slug: category.slug ?? '',
    description: category.description ?? '',
    image: category.image,
    sortOrder: category.sortOrder ?? 0,
    active: category.active ?? category.isActive ?? true,
  };
}

export function toMenuItem(item: ApiMenuItem): MenuItem {
  const category = item.category;
  return {
    _id: item._id ?? item.id ?? '',
    name: item.name ?? '',
    description: item.description ?? '',
    category: typeof category === 'object' && category !== null ? toCategory(category) : category ?? '',
    price: item.priceCents ?? item.price ?? 0,
    imageUrl: item.imageUrl ?? item.image ?? '',
    customizations: item.customizations?.every((customization) => typeof customization !== 'string')
      ? item.customizations
      : [],
    available: item.available ?? item.isAvailable ?? true,
    archived: item.archived ?? false,
  };
}

const orderStatuses: Record<string, OrderStatus> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

function toOrderType(value: string | undefined): OrderType {
  if (value === 'dine_in') return 'dine-in';
  return value === 'delivery' ? 'delivery' : 'takeaway';
}

function toPaymentStatus(value: string | undefined): PaymentStatus {
  if (value === 'paid') return 'paid';
  if (value === 'refunded') return 'refunded';
  if (value === 'pending' || value === 'unverified') return 'pending-verification';
  return 'unpaid';
}

export function toOrder(order: ApiOrder): Order {
  return {
    _id: order._id ?? order.id ?? '',
    orderNumber: order.orderNumber ?? '',
    customerName: order.customerName ?? '',
    customerPhone: order.customerPhone ?? order.phone ?? '',
    customerEmail: order.customerEmail ?? order.email ?? '',
    items: (order.items ?? []).map((item) => ({
      menuItem: item.menuItem ?? item.productId ?? '',
      name: item.name ?? '',
      unitPrice: item.unitPriceCents ?? item.unitPrice ?? 0,
      quantity: item.quantity ?? 0,
      customizations: item.customizations,
    })),
    orderType: toOrderType(order.orderType),
    tableNumber: order.tableNumber ?? '',
    dineInDate: order.dineInDate,
    dineInTime: order.dineInTime,
    dineInTimezoneOffset: order.dineInTimezoneOffset,
    pickupName: order.pickupName,
    pickupPhone: order.pickupPhone,
    deliveryAddress: order.deliveryAddress ?? '',
    paymentReceipt: order.paymentReceipt,
    subtotal: order.subtotalCents ?? order.subtotal ?? 0,
    deliveryFee: order.deliveryFeeCents ?? order.deliveryFee ?? 0,
    discount: order.discount ?? 0,
    total: order.totalCents ?? order.total ?? 0,
    orderStatus: orderStatuses[order.status ?? ''] ?? order.orderStatus ?? 'Pending',
    paymentMethod: order.paymentMethod === 'mobile_transfer' ? 'mobile' : order.paymentMethod ?? 'cash',
    paymentStatus: toPaymentStatus(order.paymentStatus),
    notes: order.notes ?? '',
    cancellationReason: order.cancellationReason,
    createdAt: order.createdAt ?? new Date().toISOString(),
    updatedAt: order.updatedAt ?? order.createdAt ?? new Date().toISOString(),
  };
}

export function toRestaurantSettings(value: Omit<Partial<RestaurantSettings>, 'enabledOrderTypes' | 'openingHours'> & {
  logoUrl?: string;
  deliveryFeeCents?: number;
  enabledOrderTypes?: RestaurantSettings['enabledOrderTypes'] | string[];
  openingHours?: Array<RestaurantSettings['openingHours'][number] | string>;
}): RestaurantSettings {
  const orderTypes = value.enabledOrderTypes;
  return {
    _id: value._id,
    businessName: value.businessName ?? 'BW Juice & Bar Restaurant',
    logo: value.logo ?? value.logoUrl ?? '',
    phone: value.phone ?? '',
    email: value.email ?? '',
    address: value.address ?? '',
    mapLink: value.mapLink ?? '',
    socialLinks: value.socialLinks ?? [],
    openingHours: (value.openingHours ?? []).map((hours) => typeof hours === 'string'
      ? { day: hours, open: '', close: '', closed: false }
      : hours),
    enabledOrderTypes: Array.isArray(orderTypes)
      ? {
        dineIn: orderTypes.includes('dine_in') || orderTypes.includes('dine-in'),
        takeaway: orderTypes.includes('takeaway'),
        delivery: orderTypes.includes('delivery'),
      }
      : orderTypes ?? { dineIn: true, takeaway: true, delivery: false },
    currency: value.currency ?? 'USD',
    deliveryFee: value.deliveryFee ?? value.deliveryFeeCents ?? 0,
    paymentMethods: value.paymentMethods ?? { cash: true, mobileTransfer: false },
    aboutText: value.aboutText ?? '',
  };
}
