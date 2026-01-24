import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Sun } from 'lucide-react';
import mapImage from '../../assets/33bf725052eafa258f512dc9b6e87fb9ded80757.png';

export function MapView() {
  const navigate = useNavigate();

  const handleSelectLocation = () => navigate('/action-selection');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow active:scale-95"
          >
            <div className="w-6 h-1 bg-gray-700 rounded" />
            <div className="w-6 h-1 bg-gray-700 rounded mt-1" />
            <div className="w-6 h-1 bg-gray-700 rounded mt-1" />
          </button>
          <h1 className="text-lg font-medium text-white drop-shadow-lg">
            Home
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Map Image */}
      <div className="relative h-screen">
        <img
          src={mapImage}
          alt="Farm Map"
          className="w-full h-full object-cover"
        />

        {/* Location Pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-white rounded-t-3xl shadow-2xl p-6 mx-2">
          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Task Instructions
            </h2>
            <p className="text-sm text-gray-600">
              Maecen habitant sem, ut vir posuere sit ullamcorp aman nunc.
              Lorem ipsum.
            </p>
          </div>
          <button onClick={handleSelectLocation} className="w-full bg-green-500 text-white py-4 rounded-2xl font-medium hover:bg-green-600 transition">
            Select Location
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-100 pt-4">
          <div className="max-w-md mx-auto px-6 pb-6">
            <div className="flex items-center justify-around">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex flex-col items-center gap-1 text-gray-400"
              >
                <div className="w-6 h-6 rounded-lg bg-current opacity-20" />
                <span className="text-xs">Home</span>
              </button>
              <button onClick={() => navigate('/my-farm')} className="flex flex-col items-center gap-1 text-gray-400">
                <Calendar className="w-6 h-6" />
                <span className="text-xs">Calendar</span>
              </button>
              <button onClick={() => navigate('/action-selection')} className="flex flex-col items-center gap-1 text-gray-400">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center -mt-6">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </button>
              <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-gray-400">
                <Sun className="w-6 h-6" />
                <span className="text-xs">Weather</span>
              </button>
              <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-gray-400">
                <div className="w-6 h-6 rounded-full bg-current opacity-20" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
