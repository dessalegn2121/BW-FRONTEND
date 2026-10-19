import { FormEvent, useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import type { RestaurantSettings } from '../../types';

export function Settings() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    adminService.getSettings().then(setSettings).catch(console.error).finally(() => setLoading(false));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true); setSuccess(false);
    try {
      const updated = await adminService.updateSettings(settings);
      setSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (e: any) {
      alert(e?.response?.data?.error ?? 'Save failed');
    } finally { setSaving(false); }
  };

  if (loading || !settings) return <div className="grid place-items-center py-12"><Spinner /></div>;

  const set = (k: keyof RestaurantSettings, v: any) => setSettings({ ...settings, [k]: v });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Restaurant Settings</h1>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="card p-6 space-y-3">
          <h2 className="font-semibold">Business</h2>
          <Input label="Business Name" value={settings.businessName} onChange={(e) => set('businessName', e.target.value)} />
          <Input label="Logo URL" value={settings.logo ?? ''} onChange={(e) => set('logo', e.target.value)} />
          <Input label="About Text" value={settings.aboutText ?? ''} onChange={(e) => set('aboutText', e.target.value)} />
        </div>

        <div className="card p-6 space-y-3">
          <h2 className="font-semibold">Contact</h2>
          <Input label="Phone" value={settings.phone} onChange={(e) => set('phone', e.target.value)} />
          <Input label="Email" value={settings.email} onChange={(e) => set('email', e.target.value)} />
          <Input label="Address" value={settings.address} onChange={(e) => set('address', e.target.value)} />
          <Input label="Map Link" value={settings.mapLink ?? ''} onChange={(e) => set('mapLink', e.target.value)} />
        </div>

        <div className="card p-6 space-y-3">
          <h2 className="font-semibold">Order Options</h2>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.enabledOrderTypes.dineIn} onChange={(e) => set('enabledOrderTypes', { ...settings.enabledOrderTypes, dineIn: e.target.checked })} /> Enable Dine-in</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.enabledOrderTypes.takeaway} onChange={(e) => set('enabledOrderTypes', { ...settings.enabledOrderTypes, takeaway: e.target.checked })} /> Enable Takeaway</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.enabledOrderTypes.delivery} onChange={(e) => set('enabledOrderTypes', { ...settings.enabledOrderTypes, delivery: e.target.checked })} /> Enable Delivery</label>
          <Input label="Currency Code" value={settings.currency} onChange={(e) => set('currency', e.target.value)} />
          <Input label="Delivery Fee (cents)" type="number" value={settings.deliveryFee} onChange={(e) => set('deliveryFee', Number(e.target.value))} />
        </div>

        <div className="card p-6 space-y-3">
          <h2 className="font-semibold">Payment Methods</h2>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.paymentMethods.cash} onChange={(e) => set('paymentMethods', { ...settings.paymentMethods, cash: e.target.checked })} /> Cash</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={settings.paymentMethods.mobileTransfer} onChange={(e) => set('paymentMethods', { ...settings.paymentMethods, mobileTransfer: e.target.checked })} /> Mobile Transfer (manual verification)</label>
        </div>

        {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg">Settings saved.</div>}

        <button className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
      </form>
    </div>
  );
}