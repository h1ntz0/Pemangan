import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStorage } from '../context/StorageContext';
import { RoomCard } from '../components/rooms/RoomCard';
import { RoomFilter } from '../components/rooms/RoomFilter';
import { Building2 } from 'lucide-react';

export const RoomsPage: React.FC = () => {
  const { rooms } = useStorage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('cat') || 'all');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearchQuery(q);
    const cat = searchParams.get('cat');
    if (cat !== null) setSelectedCategory(cat);
  }, [searchParams]);

  const categories = useMemo(() => {
    const set = new Set(rooms.map(r => r.category));
    return Array.from(set);
  }, [rooms]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const params: Record<string, string> = {};
    if (val.trim()) params.search = val.trim();
    if (selectedCategory !== 'all') params.cat = selectedCategory;
    setSearchParams(params, { replace: true });
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const params: Record<string, string> = {};
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (cat !== 'all') params.cat = cat;
    setSearchParams(params, { replace: true });
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        room.name.toLowerCase().includes(q) ||
        room.building.toLowerCase().includes(q) ||
        room.description.toLowerCase().includes(q) ||
        room.pic.toLowerCase().includes(q) ||
        room.facilities.some(f => f.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [rooms, searchQuery, selectedCategory]);

  return (
    <div className="space-y-5 sm:space-y-6 py-4 sm:py-6 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
          <Building2 className="w-4 h-4" />
          <span>Fasilitas & Sarana Prasarana</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Katalog Ruangan & Laboratorium
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Daftar 13 laboratorium komputer SIJA/RPL, workstation, studio podcast, smart classroom, teater, dan aula serbaguna SMKN 1 Jakarta.
        </p>
      </div>

      {/* Filter Bar */}
      <RoomFilter
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        totalResults={filteredRooms.length}
      />

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Tidak ada ruangan yang sesuai dengan pencarian "{searchQuery}"
          </p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Coba gunakan kata kunci fasilitas lain atau reset filter kategori ke semua.
          </p>
          <button
            onClick={() => {
              handleSearchChange('');
              handleCategoryChange('all');
            }}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      )}
    </div>
  );
};
