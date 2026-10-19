import { FormEvent, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Category } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';

const empty = { name: '', slug: '', description: '', sortOrder: 0, active: true };

// The 6 default categories for the Juice & Bar
const DEFAULT_CATEGORIES = [
  { name: 'Fresh Juices', slug: 'fresh-juices', description: 'Freshly squeezed natural juices', sortOrder: 1, active: true },
  { name: 'Smoothies & Milkshakes', slug: 'smoothies-milkshakes', description: 'Creamy blends and shakes', sortOrder: 2, active: true },
  { name: 'Coffee & Tea', slug: 'coffee-tea', description: 'Hot and iced coffee, teas, and more', sortOrder: 3, active: true },
  { name: 'Breakfast & Snacks', slug: 'breakfast-snacks', description: 'Light bites and morning meals', sortOrder: 4, active: true },
  { name: 'Meals & Fast Food', slug: 'meals-fast-food', description: 'Hearty meals, sandwiches, and fries', sortOrder: 5, active: true },
  { name: 'Other Beverages', slug: 'other-beverages', description: 'Water, sodas, and extras', sortOrder: 6, active: true },
];

export function ManageCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setCats(await adminService.listCategories()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setModalOpen(true); };
  const openEdit = (c: Category) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description ?? '', sortOrder: c.sortOrder, active: c.active });
    setModalOpen(true);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await adminService.updateCategory(editing._id, form);
      else await adminService.createCategory(form);
      setModalOpen(false);
      load();
    } catch (e: any) {
      alert(e?.response?.data?.error ?? 'Save failed');
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try { await adminService.deleteCategory(id); load(); }
    catch (e: any) { alert(e?.response?.data?.error ?? 'Delete failed'); }
  };

  // Auto-create all 6 defaults if they don't exist
  const seedDefaults = async () => {
    if (!confirm('This will add the 6 default categories to your database. Continue?')) return;
    setSeeding(true);
    try {
      for (const cat of DEFAULT_CATEGORIES) {
        if (!cats.find(c => c.slug === cat.slug)) {
          await adminService.createCategory(cat);
        }
      }
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.error ?? 'Failed to seed categories');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex gap-2">
          <button onClick={seedDefaults} disabled={seeding} className="btn-outline">
            <Sparkles size={16} /> {seeding ? 'Adding…' : 'Seed Defaults'}
          </button>
          <button onClick={openCreate} className="btn-primary">
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center py-12"><Spinner /></div>
      ) : cats.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-4">No categories yet.</p>
          <button onClick={seedDefaults} className="btn-primary">
            <Sparkles size={16} /> Add the 6 Default Categories
          </button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Name</th><th className="p-3">Slug</th>
                <th className="p-3">Order</th><th className="p-3">Status</th><th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-gray-500">{c.slug}</td>
                  <td className="p-3">{c.sortOrder}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => openEdit(c)} className="p-2 hover:bg-gray-100 rounded"><Pencil size={16} /></button>
                    <button onClick={() => remove(c._id)} className="p-2 hover:bg-red-50 text-red-600 rounded"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'New Category'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-outline">Cancel</button>
            <button onClick={onSubmit as any} disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
          </>
        }>
        <form onSubmit={onSubmit} className="space-y-3">
          
          {/* Quick Suggestions - Only show when creating new */}
          {!editing && (
            <div className="mb-4">
              <label className="label text-xs text-gray-500 mb-2">Quick Suggestions:</label>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_CATEGORIES.map(d => (
                  <button
                    key={d.slug}
                    type="button"
                    onClick={() => setForm(d)}
                    className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-brand-100 hover:text-brand-700 text-xs text-gray-600 transition-colors"
                  >
                    {d.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Slug" required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. fresh-juices" />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input 
              type="checkbox" 
              checked={form.active} 
              onChange={(e) => setForm({ ...form, active: e.target.checked })} 
              className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            /> 
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        </form>
      </Modal>
    </div>
  );
}