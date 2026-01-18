import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plus, Package, MessageCircle, User, Wrench, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/new-booking', icon: Plus, label: 'Neue Buchung' },
  { path: '/my-orders', icon: Package, label: 'Meine Aufträge' },
  { path: '/messages', icon: MessageCircle, label: 'Nachrichten' },
  { path: '/profile', icon: User, label: 'Profil' },
  { path: '/fixer-dashboard', icon: Wrench, label: 'Fixer-Modus', divider: true },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 shadow-lg z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4 mt-2 lg:mt-0">
          {navItems.map((item) => (
            <React.Fragment key={item.path}>
              {item.divider && <div className="h-px bg-slate-200 my-2" />}
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </React.Fragment>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            <p>CampusFix v1.0</p>
            <p className="mt-1">© 2025 TU Darmstadt</p>
          </div>
        </div>
      </aside>
    </>
  );
};
