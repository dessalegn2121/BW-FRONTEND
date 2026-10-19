import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { RestaurantSettings } from '../types';
import { api } from '../services/api';
import { toRestaurantSettings } from '../services/responseAdapters';

interface SettingsContextValue {
  settings: RestaurantSettings | null;
  loading: boolean;
  reload: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const DEFAULT: RestaurantSettings = {
  businessName: 'BW JUICE AND BAR RESTAURANT',
  phone: '',
  email: '',
  address: '',
  socialLinks: [],
  openingHours: [],
  enabledOrderTypes: { dineIn: true, takeaway: true, delivery: false },
  currency: 'USD',
  deliveryFee: 0,
  paymentMethods: { cash: true, mobileTransfer: false },
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<RestaurantSettings | null>(DEFAULT);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    try {
      const { data } = await api.get<{ settings: Parameters<typeof toRestaurantSettings>[0] }>('/settings');
      setSettings(toRestaurantSettings(data.settings));
    } catch (error) {
      console.error('Unable to load restaurant settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, reload }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}