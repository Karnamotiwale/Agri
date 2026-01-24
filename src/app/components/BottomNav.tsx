import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Sprout, MapPin, User } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Sprout, label: 'Crops', path: '/dashboard' },
    { icon: MapPin, label: 'Farms', path: '/dashboard' },
    { icon: User, label: 'Profile', path: '/dashboard' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-[100] max-w-md mx-auto">
      <div className="flex justify-around items-center">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
