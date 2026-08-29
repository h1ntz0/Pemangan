import React, { useState, useMemo } from 'react';
import { useStorage } from '../context/StorageContext';
import { RoomCard } from '../components/rooms/RoomCard';
import { RoomFilter } from '../components/rooms/RoomFilter';

export const RoomsPage: React.FC = () => {
  const { rooms } = useStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(rooms.map(r => r.category));
    return Array.from(set);
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.pic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.facilities.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [rooms, searchQuery, selectedCategory]);

  return (
    <div className="space-y-5 sm:space-y-6 py-4 sm:py-6 animate-fadeIn">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Katalog Ruangan & Laboratorium
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Daftar 13 fasilitas laboratorium komputer, teater audio visual, studio podcast, dan aula serbaguna SMKN 1 Jakarta.
        </p>
      </div>

      {/* Filter Bar */}
      <RoomFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        totalResults={filteredRooms.length}
      />

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Tidak ada ruangan yang cocok
          </p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Coba gunakan kata kunci lain atau pilih filter "Semua".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-3 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
