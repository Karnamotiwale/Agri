import { useNavigate } from 'react-router-dom';
import {
  Droplets,
  Thermometer,
  Leaf,
  Sprout,
  Wheat,
  BrainCircuit,
  ChevronRight,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface CropCardProps {
  id: string;
  name: string;
  image: string;
  farmName: string;
  sowingDate: string;
  healthStatus: 'healthy' | 'warning' | 'critical';
  sensorsActive: boolean;
  stage: string;
  progress: number;
}

export function CropCard({
  id,
  name,
  image,
  farmName,
  sowingDate,
  healthStatus,
  sensorsActive,
  stage,
  progress
}: CropCardProps) {
  const navigate = useNavigate();

  const getCropIcon = (cropName: string) => {
    const lower = cropName.toLowerCase();
    if (lower.includes('wheat')) return Wheat;
    if (lower.includes('corn') || lower.includes('maize')) return Sprout;
    if (lower.includes('rice')) return Sprout;
    return Leaf;
  };

  const CropIcon = getCropIcon(name);

  // Mock data for UI demo purposes (would come from props/backend in real app)
  const moisture = 28 + Math.floor(Math.random() * 30);
  const temp = 24 + Math.floor(Math.random() * 10);

  const statusConfig = {
    healthy: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-100',
      badge: 'bg-green-100 text-green-700',
      icon: CheckCircle2
    },
    warning: {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      badge: 'bg-amber-100 text-amber-700',
      icon: AlertCircle
    },
    critical: {
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      badge: 'bg-rose-100 text-rose-700',
      icon: AlertCircle
    }
  };

  const status = statusConfig[healthStatus] || statusConfig.healthy;
  const StatusIcon = status.icon;

  return (
    <div
      onClick={() => navigate(`/crop/${id}/details`)}
      className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
    >
      {/* Top Section: Header */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 overflow-hidden shadow-inner">
              <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${status.bg} ${status.color}`}>
              <CropIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-green-700 transition-colors">{name}</h3>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{farmName}</p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${status.badge}`}>
          {healthStatus}
        </span>
      </div>

      {/* Middle Section: Metrics */}
      <div className="px-5 py-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50/50 rounded-2xl p-3 border border-blue-100/50">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Moisture</span>
            </div>
            <p className="text-lg font-black text-gray-800">{moisture}%</p>
          </div>
          <div className="bg-orange-50/50 rounded-2xl p-3 border border-orange-100/50">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-orange-500" />
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Temp</span>
            </div>
            <p className="text-lg font-black text-gray-800">{temp}°C</p>
          </div>
        </div>
      </div>

      {/* Growth Progress */}
      <div className="px-5 py-4">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-bold text-gray-700">{stage}</span>
          <span className="text-[10px] font-semibold text-gray-400">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Section: AI & Actions */}
      <div className="mt-auto bg-gray-50/50 p-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-purple-600">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <p className="text-xs font-medium text-gray-600">
            <span className="font-bold text-gray-900 block">AI Insight</span>
            {healthStatus === 'healthy' ? 'Optimal growth detected' : 'Check irrigation schedule'}
          </p>
        </div>

        <button className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-green-600 hover:border-green-200 transition-colors shadow-sm">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
