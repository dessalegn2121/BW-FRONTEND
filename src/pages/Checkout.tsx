import { FormEvent, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, MapPin, Phone, User, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { PageContainer } from '../components/layout/PageContainer';
import { CartSummary } from '../components/cart/CartSummary';
import { Input } from '../components/ui/Input';
import { Spinner } from '../components/ui/Spinner';
import { orderService } from '../services/orderService';
import type { OrderType } from '../types';

function toDateInputValue(date: Date): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

export function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const enabled = settings?.enabledOrderTypes ?? { dineIn: true, takeaway: true, delivery: false };
  const today = toDateInputValue(new Date());
  const lastBookingDay = new Date();
  lastBookingDay.setDate(lastBookingDay.getDate() + 30);
  const latestBookingDate = toDateInputValue(lastBookingDay);
  
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    orderType: (enabled.dineIn ? 'dine-in' : enabled.takeaway ? 'takeaway' : 'delivery') as OrderType,
    
    // Dine-in
    tableNumber: '',
    dineInDate: today,
    dineInTime: '',
    waiterNotes: '',
    
    // Takeaway
    pickupName: '',
    pickupPhone: '',
    
    // Delivery
    deliveryStreet: '',
    deliveryCity: '',
    deliveryLandmark: '',
    deliveryNotes: '',
    
    paymentMethod: 'cash',
    notes: '',
  });

  const [paymentReceipt, setPaymentReceipt] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = form.orderType === 'delivery' ? (settings?.deliveryFee ?? 0) : 0;
  const receiptRequired = form.orderType !== 'delivery' || form.paymentMethod === 'mobile';
  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return alert('Please upload an image file');
    if (file.size > 5 * 1024 * 1024) return alert('Image must be smaller than 5MB');

    setUploading(true);
    try {
      const base64Url = await compressImage(file, 800, 0.82);
      setPaymentReceipt(base64Url);
    } catch (err) {
      alert('Failed to read image file');
    } finally {
      setUploading(false);
    }
  };

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (receiptRequired && !paymentReceipt) {
      setError('Please upload a screenshot of your payment receipt.');
      return;
    }
    if ((form.orderType === 'delivery' || form.orderType === 'takeaway') && (!form.deliveryStreet || !form.deliveryCity)) {
      setError(`Please provide your street and city for ${form.orderType === 'takeaway' ? 'pickup' : 'delivery'}.`);
      return;
    }
    if (form.orderType === 'takeaway' && (!form.pickupName.trim() || !form.pickupPhone.trim())) {
      setError('Please provide the pickup person’s name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const fullDeliveryAddress = form.orderType === 'delivery'
        ? `${form.deliveryStreet}, ${form.deliveryCity}${form.deliveryLandmark ? ` (Landmark: ${form.deliveryLandmark})` : ''}`
        : form.orderType === 'takeaway'
          ? `${form.deliveryStreet}, ${form.deliveryCity}`
          : undefined;

      const combinedNotes = [
        form.notes,
        form.orderType === 'dine-in' && form.waiterNotes ? `Waiter Note: ${form.waiterNotes}` : '',
        form.orderType === 'delivery' && form.deliveryNotes ? `Delivery Note: ${form.deliveryNotes}` : '',
      ].filter(Boolean).join(' | ');

      const order = await orderService.create({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        orderType: form.orderType,
        tableNumber: form.orderType === 'dine-in' ? form.tableNumber : undefined,
        dineInDate: form.orderType === 'dine-in' ? form.dineInDate : undefined,
        dineInTime: form.orderType === 'dine-in' ? form.dineInTime : undefined,
        dineInTimezoneOffset: form.orderType === 'dine-in' && form.dineInTime
          ? new Date(`${form.dineInDate}T${form.dineInTime}`).getTimezoneOffset()
          : undefined,
        pickupName: form.orderType === 'takeaway' ? form.pickupName : undefined,
        pickupPhone: form.orderType === 'takeaway' ? form.pickupPhone : undefined,
        deliveryAddress: fullDeliveryAddress,
        paymentMethod: form.paymentMethod,
        notes: combinedNotes || undefined,
        paymentReceipt: paymentReceipt || undefined,
        items: lines.map((l) => ({
          menuItemId: l.menuItemId,
          quantity: l.quantity,
          customizations: l.customizations,
        })),
      });

      clear();
      navigate(`/order-confirmation/${encodeURIComponent(order.orderNumber)}`);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.response?.data?.error ?? 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (lines.length === 0) return <PageContainer><p className="text-center py-20 text-gray-500">Your cart is empty.</p></PageContainer>;

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Your Information</h2>
            <Input label="Full Name" required value={form.customerName} onChange={(e) => set('customerName', e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Phone" required value={form.customerPhone} onChange={(e) => set('customerPhone', e.target.value)} />
              <Input label="Email (optional)" type="email" value={form.customerEmail} onChange={(e) => set('customerEmail', e.target.value)} />
            </div>
          </div>

          {/* Order Type */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Order Details</h2>
            <div className="flex gap-2 flex-wrap">
              {enabled.dineIn && <TypeBtn label="Dine-in" active={form.orderType === 'dine-in'} onClick={() => set('orderType', 'dine-in')} />}
              {enabled.takeaway && <TypeBtn label="Takeaway" active={form.orderType === 'takeaway'} onClick={() => set('orderType', 'takeaway')} />}
              {enabled.delivery && <TypeBtn label="Delivery" active={form.orderType === 'delivery'} onClick={() => set('orderType', 'delivery')} />}
            </div>

            {/* DINE IN */}
            {form.orderType === 'dine-in' && (
              <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 pt-2">
                <div>
                  <label htmlFor="dineInTable" className="label">Table Number</label>
                  <select id="dineInTable" required value={form.tableNumber} onChange={(e) => set('tableNumber', e.target.value)} className="input">
                    <option value="">Choose a table</option>
                    {Array.from({ length: 20 }, (_, index) => index + 1).map((table) => (
                      <option key={table} value={String(table)}>Table {table}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Dine-in Date"
                  type="date"
                  required
                  min={today}
                  max={latestBookingDate}
                  value={form.dineInDate}
                  onChange={(e) => set('dineInDate', e.target.value)}
                />
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-[38px] text-gray-400" />
                  <Input label="Start Time (6-hour booking)" type="time" required value={form.dineInTime} onChange={(e) => set('dineInTime', e.target.value)} className="pl-9" />
                </div>
                
                <div className="sm:col-span-2">
                  <Input label="Notes for Waiter (optional)" value={form.waiterNotes} onChange={(e) => set('waiterNotes', e.target.value)} placeholder="E.g. Extra napkins" />
                </div>
              </div>
            )}

            {/* TAKEAWAY */}
            {form.orderType === 'takeaway' && (
              <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 pt-2">
                <div className="sm:col-span-2"><p className="text-sm text-gray-500 mb-2">Who is picking up this order?</p></div>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-[38px] text-gray-400" />
                  <Input label="Pickup Name" required value={form.pickupName} onChange={(e) => set('pickupName', e.target.value)} placeholder="Person collecting" className="pl-9" />
                </div>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-[38px] text-gray-400" />
                  <Input label="Pickup Phone" required value={form.pickupPhone} onChange={(e) => set('pickupPhone', e.target.value)} placeholder="Contact number" className="pl-9" />
                </div>
                <div className="sm:col-span-2 relative">
                  <MapPin size={16} className="absolute left-3 top-[38px] text-gray-400" />
                  <Input label="Pickup Street Address" required value={form.deliveryStreet} onChange={(e) => set('deliveryStreet', e.target.value)} placeholder="Street, house number" className="pl-9" />
                </div>
                <Input label="City / Subcity" required value={form.deliveryCity} onChange={(e) => set('deliveryCity', e.target.value)} placeholder="City" />
              </div>
            )}

            {/* DELIVERY */}
            {form.orderType === 'delivery' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2">
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-[38px] text-gray-400" />
                  <Input label="Street Address" required value={form.deliveryStreet} onChange={(e) => set('deliveryStreet', e.target.value)} placeholder="Street, House No." className="pl-9" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label="City / Subcity" required value={form.deliveryCity} onChange={(e) => set('deliveryCity', e.target.value)} placeholder="City" />
                  <Input label="Landmark (optional)" value={form.deliveryLandmark} onChange={(e) => set('deliveryLandmark', e.target.value)} placeholder="Near..." />
                </div>
                <Input label="Delivery Notes (optional)" value={form.deliveryNotes} onChange={(e) => set('deliveryNotes', e.target.value)} placeholder="E.g. Call when you arrive" />
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Payment Method</h2>
            <div className="flex gap-2 flex-wrap">
              {settings?.paymentMethods.cash !== false && <TypeBtn label="Cash" active={form.paymentMethod === 'cash'} onClick={() => set('paymentMethod', 'cash')} />}
              {settings?.paymentMethods.mobileTransfer && <TypeBtn label="Mobile Transfer" active={form.paymentMethod === 'mobile'} onClick={() => set('paymentMethod', 'mobile')} />}
            </div>

            {receiptRequired && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <label className="label">Upload Payment Receipt <span className="text-red-500">*</span></label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative rounded-xl border-2 border-dashed p-4 cursor-pointer transition flex flex-col items-center justify-center min-h-[140px] ${dragging ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'}`}
                >
                  {paymentReceipt ? (
                    <div className="relative w-full flex items-center gap-4">
                      <img src={paymentReceipt} alt="Receipt" className="w-20 h-20 rounded-lg object-cover ring-1 ring-gray-200" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-800">Receipt attached</p>
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setPaymentReceipt(''); }} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto w-10 h-10 rounded-full bg-brand-50 text-brand-600 grid place-items-center mb-2">
                        {uploading ? <Spinner size={18} /> : <Upload size={18} />}
                      </div>
                      <p className="text-sm font-medium text-gray-700">{uploading ? 'Processing…' : 'Click to browse or drag & drop'}</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={onFilePick} className="hidden" />
              </div>
            )}
          </div>

          {/* General Notes */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg border-b pb-2">Other Requests</h2>
            <textarea rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} className="input" placeholder="Any allergies or general requests?" />
          </div>

          {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium">{error}</div>}
        </div>

        <div>
          <div className="sticky top-24">
            <CartSummary subtotal={subtotal} deliveryFee={deliveryFee}>
              <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                {submitting ? 'Processing…' : 'Place Order'}
              </button>
            </CartSummary>
          </div>
        </div>
      </form>
    </PageContainer>
  );
}

function TypeBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${active ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-white border-gray-200 hover:border-brand-300 text-gray-700'}`}>
      {label}
    </button>
  );
}

function compressImage(file: File, maxSize = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(1, maxSize / Math.max(width, height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}