import React from 'react';
import { Search } from 'lucide-react';

interface RoomFilterProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  categories: string[];
  totalResults: number;
}

export const RoomFilter: React.FC<RoomFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  totalResults
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama ruangan, gedung, lab SIJA, aula..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* Results Counter */}
        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
          <span>Ditemukan <strong className="text-slate-900 dark:text-slate-100">{totalResults}</strong> Ruangan</span>
        </div>
      </div>

      {/* Category Pills (Smooth Mobile Horizontal Scroll) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none no-scrollbar">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-blue-900 text-white dark:bg-blue-600 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-900 text-white dark:bg-blue-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
