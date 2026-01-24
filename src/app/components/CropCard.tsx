import { Calendar, MapPin, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CropCardProps {
  id: string;
  name: string;
  image: string;
  farmName: string;
  sowingDate: string;
  healthStatus: 'healthy' | 'warning' | 'critical';
  sensorsActive: boolean;
}

export function CropCard({
  id,
  name,
  image,
  farmName,
  sowingDate,
  healthStatus,
  sensorsActive,
}: CropCardProps) {
  const navigate = useNavigate();

  const statusColors = {
    healthy: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    critical: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    healthy: 'Healthy',
    warning: 'Needs Attention',
    critical: 'Critical',
  };

  return (
    <div
      onClick={() => navigate(`/crop/${id}/monitoring`)}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[healthStatus]}`}
          >
            {statusLabels[healthStatus]}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{farmName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Sown on {sowingDate}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4 text-gray-400" />
            <span
              className={sensorsActive ? 'text-green-600' : 'text-gray-400'}
            >
              Sensors {sensorsActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
