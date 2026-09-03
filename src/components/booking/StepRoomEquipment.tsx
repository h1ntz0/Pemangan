import React, { useState, useMemo } from 'react';
import { Room, Equipment } from '../../types';
import { Users, Building, Check, Search, Plus, Minus, Sparkles } from 'lucide-react';

export interface EquipmentSelection {
  name: string;
  quantity: number;
}

interface StepRoomEquipmentProps {
  rooms: Room[];
  equipmentList: Equipment[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  selectedEquipment: string[];
  equipmentQuantities: Record<string, number>;
  onUpdateEquipmentQuantity: (eqName: string, delta: number) => void;
  onToggleEquipment: (eqName: string) => void;
}

export const StepRoomEquipment: React.FC<StepRoomEquipmentProps> = ({
  rooms,
  equipmentList,
  selectedRoomId,
  onSelectRoom,
  selectedEquipment,
  equipmentQuantities,
  onUpdateEquipmentQuantity,
  onToggleEquipment,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(rooms.map(r => r.category)));
    return ['Semua', ...unique];
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchCat = categoryFilter === 'Semua' || room.category === categoryFilter;
      const matchQuery =
        searchQuery.trim() === '' ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [rooms, categoryFilter, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step 1: Ruangan */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-900 dark:bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                1
              </span>
              Pilih Ruangan atau Laboratorium
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pilih fasilitas SMKN 1 Jakarta sesuai kapasitas dan jenis kegiatan Anda.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            {filteredRooms.length} Ruangan Tersedia
          </span>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama lab, gedung, atau fasilitas..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-900 text-white dark:bg-blue-600 shadow-xs'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredRooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between group ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 shadow-md ring-2 ring-blue-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider bg-blue-100/60 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                      {room.category}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-700 group-hover:border-slate-400'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mt-2">
                    {room.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {room.type}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {room.capacity} Orang
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {room.building.split('(')[1]?.replace(')', '') || 'Lantai 1'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Peralatan Tambahan & Kuantitas */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-900 dark:bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                2
              </span>
              Peralatan Tambahan & Kuantitas (Opsional)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pilih dan atur jumlah unit peralatan multimedia yang ingin disiapkan oleh tim Sarpras.
            </p>
          </div>

          {selectedEquipment.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-900 self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5" />
              {selectedEquipment.length} Peralatan Dipilih
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {equipmentList.map((eq) => {
            const isChecked = selectedEquipment.includes(eq.name);
            const qty = equipmentQuantities[eq.name] || 1;

            return (
              <div
                key={eq.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isChecked
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => onToggleEquipment(eq.name)}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 pointer-events-none"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                      {eq.name}
                    </p>
                    <span className="inline-block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Kategori: {eq.category}
                    </span>
                  </div>
                </div>

                {/* Interactive Quantity Stepper */}
                {isChecked && (
                  <div className="pt-2 border-t border-blue-100 dark:border-slate-800 flex items-center justify-between animate-fadeIn">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Jumlah Unit:
                    </span>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateEquipmentQuantity(eq.name, -1);
                        }}
                        disabled={qty <= 1}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent"
                        title="Kurangi"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-white">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateEquipmentQuantity(eq.name, 1);
                        }}
                        disabled={qty >= 10}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent"
                        title="Tambah"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

