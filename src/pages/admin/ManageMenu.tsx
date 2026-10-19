import { FormEvent, useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Pencil, Upload, ImageIcon, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Category, MenuItem } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency } from '../../utils/format';

const emptyForm = {
  name: '',
  description: '',
  category: '',
  price: 0,
  imageUrl: '',
  available: true,
};

export function ManageMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);
  
  // New states for image handling
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [menu, cats] = await Promise.all([
        adminService.listMenu({ limit: 100 }),
        adminService.listCategories(),
      ]);
      setItems(menu.items);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, category: categories[0]?._id ?? '' });
    setModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      category: typeof item.category === 'string' ? item.category : item.category._id,
      price: item.price / 100,
      imageUrl: item.imageUrl ?? '',
      available: item.available,
    });
    setModalOpen(true);
  };

  // --- Image Handling Logic ---
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Compress the image to keep Base64 size small for MongoDB
      const base64Url = await compressImage(file, 800, 0.82);
      setForm((prev: any) => ({ ...prev, imageUrl: base64Url }));
    } catch (err) {
      alert('Failed to read image file');
    } finally {
      setUploading(false);
    }
  };

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ''; // reset input
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.imageUrl) {
      // Optional: Enforce image? You can remove this if images are optional.
      // alert('Please upload an image for this item.');
      // return;
    }

    setSaving(true);
    const payload = {
      ...form,
      price: Math.round(Number(form.price) * 100),
      imageUrl: form.imageUrl || undefined,
    };
    try {
      if (editing) await adminService.updateMenu(editing._id, payload);
      else await adminService.createMenu(payload);
      setModalOpen(false);
      load();
    } catch (e: any) {
      alert(e?.response?.data?.error ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const archive = async (id: string) => {
    if (!confirm('Archive this item?')) return;
    await adminService.archiveMenu(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Menu</h1>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} /> Add Item
        </button>
      </div>

      {loading ? (
        <div className="grid place-items-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3 w-16">Image</th> {/* New Image Column */}
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">
                    <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden grid place-items-center shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={16} className="text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">
                    {typeof item.category === 'object' ? (item.category as Category).name : '—'}
                  </td>
                  <td className="p-3">{formatCurrency(item.price)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-100 rounded">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => archive(item._id)} className="p-2 hover:bg-red-50 text-red-600 rounded">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Menu Item' : 'New Menu Item'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-outline">
              Cancel
            </button>
            <button onClick={onSubmit as any} disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          
          {/* ================= IMAGE UPLOAD ZONE ================= */}
          <div>
            <label className="label">Item Image</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-xl border-2 border-dashed p-4 cursor-pointer transition flex flex-col items-center justify-center min-h-[140px] ${
                dragging ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
              }`}
            >
              {form.imageUrl ? (
                <div className="relative group w-full flex items-center gap-4">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover ring-1 ring-gray-200 shadow-sm"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium text-gray-800">Image selected</p>
                    <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setForm({ ...form, imageUrl: '' });
                    }}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 transition"
                    title="Remove image"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto w-10 h-10 rounded-full bg-brand-50 text-brand-600 grid place-items-center mb-2">
                    {uploading ? <Spinner size={18} /> : <Upload size={18} />}
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {uploading ? 'Processing image…' : 'Click to browse or drag & drop'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={onFilePick}
              className="hidden"
            />
          </div>
          {/* ===================================================== */}

          <Input
            label="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div>
            <label className="label">Description</label>
            <textarea
              rows={3}
              className="input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Price"
            type="number"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-gray-700">Available for ordering</span>
          </label>
        </form>
      </Modal>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Image Compression Logic                                           */
/*  Prevents huge Base64 strings by resizing and compressing the file */
/* ------------------------------------------------------------------ */
function compressImage(file: File, maxSize = 800, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(1, maxSize / Math.max(width, height));
        const w = Math.round(width * scale);
        const h = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas not supported'));
        
        // Draw and compress as JPEG
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}