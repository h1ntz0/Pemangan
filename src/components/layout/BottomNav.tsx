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

export const BottomNav: React.FC = () => {
  const { isGuruOrAdmin } = useAuth();

  const navItems = [
    { to: '/', label: 'Beranda', icon: <Home className="w-5 h-5" /> },
    { to: '/rooms', label: 'Ruangan', icon: <Building2 className="w-5 h-5" /> },
    { to: '/booking', label: 'Pinjam', icon: <PlusCircle className="w-5 h-5" /> },
    { to: '/timetable', label: 'Jadwal', icon: <Calendar className="w-5 h-5" /> },
    { to: '/tracking', label: 'Lacak', icon: <Search className="w-5 h-5" /> },
    ...(isGuruOrAdmin ? [{ to: '/admin', label: 'Sarpras', icon: <ShieldCheck className="w-5 h-5" /> }] : []),
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 bottom-nav transition-colors no-print">
      <div className="max-w-md mx-auto px-2 py-1 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 rounded-xl min-w-[54px] min-h-[46px] transition-colors select-none ${
                isActive
                  ? 'text-blue-700 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 font-medium">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
