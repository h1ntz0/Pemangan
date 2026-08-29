import React from 'react';
import { BookingStatus, RoomStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'neutral' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-xs font-semibold',
  };

  const variantClasses = {
    primary: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800 font-semibold',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-medium',
    outline: 'bg-transparent text-slate-600 border border-slate-300 dark:text-slate-400 dark:border-slate-700 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md select-none transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: BookingStatus | RoomStatus; size?: 'sm' | 'md' | 'lg' }> = ({ status, size = 'sm' }) => {
  switch (status) {
    case 'approved':
    case 'available':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
          <span>{status === 'approved' ? 'Disetujui' : 'Tersedia'}</span>
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
          <span>Menunggu Review</span>
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>Ditolak</span>
        </span>
      );
    case 'occupied':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
          <span>Sedang Dipakai</span>
        </span>
      );
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>Selesai</span>
        </span>
      );
    case 'maintenance':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>Pemeliharaan</span>
        </span>
      );
    default:
      return <Badge size={size}>{status}</Badge>;
  }
};
