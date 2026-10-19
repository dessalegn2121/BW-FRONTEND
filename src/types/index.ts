export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  active: boolean;
}

export interface Customization {
  name: string;
  options: { label: string; extraPrice: number }[];
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: Category | string;
  price: number;
  imageUrl?: string;
  customizations?: Customization[];
  available: boolean;
  archived: boolean;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type PaymentStatus = 'unpaid' | 'pending-verification' | 'paid' | 'refunded';

export interface OrderItem {
  menuItem: string;
  name: string;
  unitPrice: number;
  quantity: number;
  customizations?: { name: string; option: string; extraPrice: number }[];
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  orderType: OrderType;
  tableNumber?: string;
  dineInDate?: string;
  dineInTime?: string;
  dineInTimezoneOffset?: number;
  pickupName?: string;
  pickupPhone?: string;
  deliveryAddress?: string;
  paymentReceipt?: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  orderStatus: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartLine {
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
  customizations?: { name: string; option: string; extraPrice: number }[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
  status: 'active' | 'disabled';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RestaurantSettings {
  _id?: string;
  businessName: string;
  logo?: string;
  phone: string;
  email: string;
  address: string;
  mapLink?: string;
  socialLinks: { platform: string; url: string }[];
  openingHours: { day: string; open: string; close: string; closed: boolean }[];
  enabledOrderTypes: { dineIn: boolean; takeaway: boolean; delivery: boolean };
  currency: string;
  deliveryFee: number;
  paymentMethods: { cash: boolean; mobileTransfer: boolean };
  aboutText?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}