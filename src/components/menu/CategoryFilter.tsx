import type { Category } from '../../types';

interface Props {
  categories: Category[];
  active: string | null;
  onChange: (slug: string | null) => void;
}

export function CategoryFilter({ categories, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
      <button
        onClick={() => onChange(null)}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${
          active === null ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c._id}
          onClick={() => onChange(c.slug)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${
            active === c.slug ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}