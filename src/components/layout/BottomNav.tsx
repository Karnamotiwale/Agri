import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Diamond, Landmark, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home,       label: '🏠 Home',    path: '/dashboard' },
    { icon: Landmark,   label: '🏛️ Schemes', path: '/schemes' },
    { icon: ShoppingBag, label: '🛒 Market', path: '/market' },
    { icon: Diamond,    label: '🧑‍🌾 Services',path: '/services' },
    { icon: LayoutGrid, label: '🗺️ Lands',   path: '/farms' },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] max-w-md mx-auto"
      style={{
        background: '#ffffff',
        borderTop: '1px solid #E6F4EA',
        boxShadow: '0 -4px 20px rgba(46,125,50,0.08)',
      }}
    >
      <div className="flex justify-around items-center px-2 py-3">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <motion.button
              key={label}
              whileTap={{ scale: 0.85 }}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: isActive ? '#F2FBEF' : 'transparent',
              }}
            >
              <Icon
                className="w-5 h-5 transition-colors"
                style={{ color: isActive ? '#2E7D32' : '#9CA3AF' }}
              />
              <span
                className="text-[10px] font-bold transition-colors whitespace-nowrap"
                style={{ color: isActive ? '#2E7D32' : '#9CA3AF' }}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
