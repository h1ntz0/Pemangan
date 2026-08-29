import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Room } from '../../types';
import { StatusBadge } from '../common/Badge';

interface RoomCardProps {
  room: Room;
  onQuickBook?: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex flex-col">
      {/* Image Header */}
      <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/img/image1.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
        
        {/* Category & Status */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/95 text-slate-900 dark:bg-slate-900/90 dark:text-slate-100 shadow-xs">
            {room.category}
          </span>
          <StatusBadge status={room.status} size="sm" />
        </div>

        {/* Room Name on Image */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
          <p className="text-[10px] text-blue-200 font-medium">
            {room.type}
          </p>
          <h3 className="text-sm sm:text-base font-bold line-clamp-1">
            {room.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Capacity & Operational Hours */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Kapasitas: <strong className="text-slate-800 dark:text-slate-200">{room.capacity} orang</strong></span>
            <span>{room.operationalHours}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {room.description}
          </p>

          {/* Facilities Badges */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {room.facilities.slice(0, 3).map((facility, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 truncate">
            PJ: {room.pic}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <Link
              to={`/rooms/${room.id}`}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
            >
              Detail
            </Link>
            <button
              onClick={() => navigate(`/booking?roomId=${room.id}`)}
              className="px-3 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Pinjam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
