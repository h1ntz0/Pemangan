import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout, quickLoginAs } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/rooms', label: 'Ruangan' },
    { to: '/booking', label: 'Reservasi' },
    { to: '/timetable', label: 'Jadwal' },
    { to: '/tracking', label: 'Lacak Resi' },
    { to: '/admin', label: 'Sarpras' },
  ];

  const handleRoleSwitch = (role: UserRole) => {
    quickLoginAs(role);
    setUserDropdownOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/img/logo.png" 
              alt="Logo SMKN 1 Jakarta" 
              className="h-8 sm:h-9 w-auto object-contain shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                  PEMANGAN
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  2.0
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                SMK Negeri 1 Jakarta
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean Text, No Icon Clutter) */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-blue-700 dark:bg-slate-800 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Right Action Controls: Theme Switcher & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle Button (Clean Light/Dark Switcher) */}
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center justify-center cursor-pointer min-w-[34px] min-h-[34px]"
              aria-label={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-slate-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* User Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-md bg-blue-700 dark:bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {currentUser.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg p-2 z-50 animate-fadeIn">
                    <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 capitalize mt-0.5">
                        {currentUser.role} • {currentUser.class}
                      </p>
                    </div>

                    <div className="p-1.5 space-y-1">
                      <p className="text-[10px] font-semibold text-slate-400 px-2 uppercase tracking-wider">
                        Ganti Peran:
                      </p>
                      <button
                        onClick={() => handleRoleSwitch('siswa')}
                        className={`w-full text-left px-2.5 py-1 rounded-md text-xs font-medium ${
                          currentUser.role === 'siswa' ? 'bg-slate-100 text-blue-700 dark:bg-slate-800 dark:text-blue-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Siswa (Arrofi)
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('guru')}
                        className={`w-full text-left px-2.5 py-1 rounded-md text-xs font-medium ${
                          currentUser.role === 'guru' ? 'bg-slate-100 text-blue-700 dark:bg-slate-800 dark:text-blue-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Guru (Pak Amrul)
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('admin')}
                        className={`w-full text-left px-2.5 py-1 rounded-md text-xs font-medium ${
                          currentUser.role === 'admin' ? 'bg-slate-100 text-blue-700 dark:bg-slate-800 dark:text-blue-400 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Admin Sarpras
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              >
                Masuk
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};
