import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Calendar, Sun } from 'lucide-react';

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export function WeatherScreen() {
  const navigate = useNavigate();
  const [activeDay, setActiveDay] = useState('today');
  const [activeProduct, setActiveProduct] = useState(3);
  const [hum, setHum] = useState(72);
  const [temp, setTemp] = useState(28);
  const [wind, setWind] = useState(18);
  const [rain, setRain] = useState(45);

  useEffect(() => {
    const t = setInterval(() => {
      setHum((h) => clamp(h + (Math.random() - 0.5) * 6, 40, 95));
      setTemp((x) => clamp(x + (Math.random() - 0.5) * 2, 15, 38));
      setWind((w) => clamp(w + (Math.random() - 0.5) * 4, 2, 35));
      setRain((r) => clamp(r + (Math.random() - 0.5) * 10, 0, 100));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const weatherMetrics = [
    { label: 'Humidity', value: `${Math.round(hum)}%`, icon: '💧' },
    { label: 'Temperature', value: `${Math.round(temp)}°C`, icon: '🌡️' },
    { label: 'Wind Speed', value: `${Math.round(wind)} km/h`, icon: '💨' },
    { label: 'Rainfall', value: `${Math.round(rain)}%`, icon: '🌧️' },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-8">
          <button className="w-10 h-10 flex items-center justify-center">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">Home</h1>
          <div className="w-10" />
        </div>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-light text-gray-900 mb-1">
            Weather Forecast
          </h2>
          <p className="text-sm text-gray-500">Today's conditions</p>
        </div>

        {/* Day Tabs */}
        <div className="flex gap-4 mb-8">
          {['yesterday', 'today', 'next week'].map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-full text-sm capitalize transition ${
                activeDay === day
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Current Condition */}
        <div className="mb-8 p-6 bg-gray-50 rounded-3xl">
          <p className="text-gray-900 mb-4">Now in good condition for spraying</p>
          <p className="text-xs text-gray-500 mb-6">
            ⚠️ At quis massa lobortum, accumsam quis vel. At
            accumsan vel tempor vel tempt nisi vitae.
          </p>

          {/* Weather Grid */}
          <div className="grid grid-cols-4 gap-4">
            {weatherMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-2">{metric.icon}</div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Products</h3>
            <button className="text-sm text-green-500">Products</button>
          </div>

          {/* Product Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setActiveProduct(num)}
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium transition ${
                  activeProduct === num
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {String(num).padStart(2, '0')}
                <br />
                <span className="text-xs">pm</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-[100] shadow-lg">
        <div className="max-w-md mx-auto px-6 py-4">
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
            <button className="flex flex-col items-center gap-1 text-green-500">
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
  );
}
