import { ArrowLeft, Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBackClick?: () => void;
  showNotification?: boolean;
  hideRightIcon?: boolean;
  titleOnRight?: boolean;
}

export function Header({ title, showBack = false, onBackClick, showNotification = false, hideRightIcon = false, titleOnRight = false }: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-green-600 text-white px-4 py-4 shadow-md">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-1 hover:bg-green-700 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}
          {!titleOnRight && <h1 className="text-xl font-semibold">{title}</h1>}
        </div>
        <div className="flex items-center gap-3">
          {titleOnRight && <h1 className="text-xl font-semibold">{title}</h1>}
          {!hideRightIcon && (
            <button className="p-1 hover:bg-green-700 rounded-lg transition">
              {showNotification ? <Bell className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
