import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { menuService } from '../services/menuService';
import type { MenuItem, Category } from '../types';
import { MenuCard } from '../components/menu/MenuCard';
import { PageContainer } from '../components/layout/PageContainer';
import { Spinner } from '../components/ui/Spinner';
import { useSettings } from '../context/SettingsContext';

export function Home() {
  const [popular, setPopular] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    (async () => {
      try {
        const [menu, cats] = await Promise.all([
          menuService.list({ limit: 6 }),
          menuService.categories(),
        ]);
        setPopular(menu.items);
        setCategories(cats);
      } catch (e) {
        console.warn('Home load failed:', e);
        setLoadError(e instanceof Error ? e.message : 'Unable to load menu data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative bg-white overflow-hidden">
        {/* Soft pink splash behind the fruit, purely decorative */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-10%] w-[70%] h-[120%] hidden md:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(239,68,68,0.15), rgba(239,68,68,0.06) 60%, transparent 75%)',
            filter: 'blur(6px)',
          }}
        />

        <PageContainer className="relative grid md:grid-cols-2 gap-10 items-center py-12 md:py-20 lg:py-24">
          {/* Left column */}
          <div className="max-w-xl">
            <h1 className="relative font-display font-extrabold text-ink leading-[1.05] tracking-tight text-4xl sm:text-5xl lg:text-6xl">
              Health Starts with
              <br />
              Fresh <span className="text-brand-600">Juice</span>

              {/* Small decorative splashes near the heading */}
              <span aria-hidden className="absolute -top-4 right-24 hidden sm:block">
                <svg width="34" height="26" viewBox="0 0 34 26">
                  <path d="M2 16c4-8 10-12 18-12-2 6-6 10-12 12 4 0 7 1 9 3-6 2-12 0-15-3Z" fill="#ef4444" />
                </svg>
              </span>
            </h1>

            <p className="mt-6 text-[15px] sm:text-base leading-relaxed text-gray-500 max-w-lg">
              Experience the true taste of nature with every sip. At {settings?.businessName ?? 'Juice Bar'},
              we craft our juices from the freshest fruits to bring you health, energy, and pure
              refreshment—straight from nature to your glass.
            </p>

            <div className="mt-8">
              <Link
                to="/menu"
                className="group inline-flex items-center gap-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-full pl-7 pr-2 py-2 transition-colors"
              >
                <span>Shop Now</span>
                <span className="w-9 h-9 rounded-full bg-white/15 grid place-items-center group-hover:bg-white/25 transition-colors">
                  <ArrowUpRight size={18} strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right column — fruit composition */}
          <div className="relative flex justify-center md:justify-end">
            {/* Backing pink splash */}
            <div
              aria-hidden
              className="absolute inset-0 grid place-items-center"
            >
              <div
                className="w-[85%] aspect-square rounded-[45%] bg-brand-100/70"
                style={{ transform: 'rotate(-8deg)' }}
              />
            </div>

            {/* Fruit image */}
            <img
              src="/images/hero-fruits.png"
              alt="Fresh fruit assortment — pineapple, watermelon, orange, banana, berries"
              className="relative w-full max-w-[520px] h-auto object-contain drop-shadow-2xl"
              onError={(e) => {
                // Graceful fallback if the image isn't present yet
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />

            {/* Fallback emoji collage (only visible if image missing) */}
            <div className="hidden md:flex absolute inset-0 items-center justify-center">
              <div className="text-[160px] leading-none select-none opacity-90">🍉🍊🍓</div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ============ CATEGORIES ============ */}
      {categories.length > 0 && (
        <PageContainer>
          <h2 className="text-2xl font-bold mb-4">Browse Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((c) => (
              <Link
                key={c._id}
                to={`/menu?category=${c.slug}`}
                className="card p-4 text-center hover:shadow-md transition"
              >
                <div className="text-4xl mb-2">🍹</div>
                <p className="font-medium text-sm">{c.name}</p>
              </Link>
            ))}
          </div>
        </PageContainer>
      )}

      {/* ============ POPULAR ============ */}
      <PageContainer>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-bold">Popular Items</h2>
          <Link to="/menu" className="text-brand-600 font-medium hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid place-items-center py-12">
            <Spinner />
          </div>
        ) : loadError ? (
          <p role="alert" className="text-red-700">
            {loadError}. Check that the backend is running, then refresh this page.
          </p>
        ) : popular.length === 0 ? (
          <p className="text-gray-500">Menu coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popular.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}