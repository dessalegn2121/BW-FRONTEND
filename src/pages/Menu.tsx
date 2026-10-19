import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuService } from '../services/menuService';
import type { Category, MenuItem } from '../types';
import { MenuCard } from '../components/menu/MenuCard';
import { CategoryFilter } from '../components/menu/CategoryFilter';
import { MenuSearch } from '../components/menu/MenuSearch';
import { PageContainer } from '../components/layout/PageContainer';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useDebounce } from '../hooks/useDebounce';

export function Menu() {
  const [params, setParams] = useSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const activeCategory = params.get('category');

  useEffect(() => {
    menuService.categories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setError(null);
    setLoading(true);
    menuService
      .list({
        search: debouncedSearch || undefined,
        category: activeCategory
          ? categories.find((c) => c.slug === activeCategory)?._id
          : undefined,
        limit: 50,
      })
      .then((res) => setItems(res.items))
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unable to load the menu. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, activeCategory, categories]);

  const setCategory = (slug: string | null) => {
    if (!slug) setParams({});
    else setParams({ category: slug });
  };

  return (
    <PageContainer>
      <h1 className="text-3xl font-bold mb-2">Our Menu</h1>
      <p className="text-gray-600 mb-6">Freshly made for you</p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <CategoryFilter categories={categories} active={activeCategory} onChange={setCategory} />
        </div>
        <MenuSearch value={search} onChange={setSearch} />
      </div>

      {error ? (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}. Check that the backend is running, then refresh this page.
        </div>
      ) : loading ? (
        <div className="grid place-items-center py-12"><Spinner /></div>
      ) : items.length === 0 ? (
        <EmptyState title="No items found" description="Try another category or search term." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => <MenuCard key={item._id} item={item} />)}
        </div>
      )}
    </PageContainer>
  );
}