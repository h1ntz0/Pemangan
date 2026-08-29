import React from 'react';
import { Room, Equipment } from '../../types';
import { Users, Building, Check } from 'lucide-react';

interface StepRoomEquipmentProps {
  rooms: Room[];
  equipmentList: Equipment[];
  selectedRoomId: string;
  onSelectRoom: (roomId: string) => void;
  selectedEquipment: string[];
  onToggleEquipment: (eqName: string) => void;
}

export const StepRoomEquipment: React.FC<StepRoomEquipmentProps> = ({
  rooms,
  equipmentList,
  selectedRoomId,
  onSelectRoom,
  selectedEquipment,
  onToggleEquipment,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Room Selection Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            Pilih Ruangan atau Laboratorium
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pilih 1 dari 13 ruangan fasilitas SMK Negeri 1 Jakarta yang sesuai dengan kapasitas dan kegiatan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
          {rooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`cursor-pointer rounded-xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500 shadow-md ring-2 ring-blue-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      {room.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                      {room.name}
                    </h4>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-700'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {room.capacity} Orang
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    {room.building.split('(')[1]?.replace(')', '') || 'Lantai 1'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment Add-ons Checkboxes */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            Peralatan Tambahan (Opsional)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Centang perangkat multimedia atau kelengkapan yang ingin disiapkan oleh tim Sarpras.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {equipmentList.map((eq) => {
            const isChecked = selectedEquipment.includes(eq.name);
            return (
              <label
                key={eq.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleEquipment(eq.name)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {eq.name}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Kategori: {eq.category}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
