import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Search, 
  PlusCircle, 
  ShieldCheck,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStorage } from '../../context/StorageContext';

export const BottomNav: React.FC = () => {
  const { isGuruOrAdmin } = useAuth();
  const { analytics } = useStorage();

  const navItems = [
    { to: '/', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { to: '/rooms', label: 'Ruangan', icon: <Building2 className="w-5 h-5" /> },
    { to: '/booking', label: 'Pinjam', icon: <PlusCircle className="w-5 h-5" /> },
    { to: '/timetable', label: 'Jadwal', icon: <Calendar className="w-5 h-5" /> },
    { to: '/tracking', label: 'Lacak', icon: <Search className="w-5 h-5" /> },
    ...(isGuruOrAdmin
      ? [
          {
            to: '/admin',
            label: 'Sarpras',
            icon: <ShieldCheck className="w-5 h-5" />,
            badge: analytics.pending > 0 ? analytics.pending : undefined
          }
        ]
      : []),
  ];

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-50 no-print">
      <nav className="max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[50px] min-h-[44px] transition-all select-none ${
                isActive
                  ? 'text-blue-700 dark:text-blue-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <div
                    className={`p-1.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 shadow-2xs'
                        : 'bg-transparent'
                    }`}
                  >
                    {item.icon}
                  </div>
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 font-medium leading-none">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-700 dark:bg-blue-400 mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
