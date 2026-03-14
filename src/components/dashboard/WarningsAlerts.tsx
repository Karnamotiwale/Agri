import { useState } from 'react';
import { ThumbsUp, AlertTriangle, Bug, CloudSun, ShieldAlert } from 'lucide-react';

type AlertType = 'all' | 'weather' | 'pests' | 'disease';

export function WarningsAlerts() {
  const [activeFilter, setActiveFilter] = useState<AlertType>('all');

  const filters: { id: AlertType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'weather', label: 'Weather' },
    { id: 'pests', label: 'Pests' },
    { id: 'disease', label: 'Disease Risk' },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Warnings and Alerts</h2>
      
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === filter.id
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p className="text-gray-400 text-sm mb-12">Data Source: VisualCrossing, Devices</p>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 flex items-center justify-center mb-4">
          <ThumbsUp className="w-10 h-10 text-gray-900" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">All clear</h3>
        <p className="text-gray-500 text-base text-center max-w-[280px]">
          No warnings for your plantations at the moment. If something comes up, it will appear here.
        </p>
      </div>
    </div>
  );
}
