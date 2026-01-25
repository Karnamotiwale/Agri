import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Activity, Zap, CheckCircle2, Home, Sprout, Landmark, MapPin, BarChart2, Cpu } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function SensorGuide() {
  const navigate = useNavigate();
  const { setSystemReady, setOnboardingComplete } = useApp();

  // Initialize system when component mounts
  useEffect(() => {
    setSystemReady();
    setOnboardingComplete();
  }, [setSystemReady, setOnboardingComplete]);

  const steps = [
    {
      icon: Droplets,
      title: 'Soil Moisture Sensor',
      description: 'Place sensors 6-8 inches deep in the root zone',
      tips: [
        'Install in representative areas of each field',
        'Keep 15-20 feet away from irrigation lines',
        'Ensure good soil contact for accurate readings',
      ],
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Activity,
      title: 'NPK & pH Sensors',
      description: 'Install at multiple depths for comprehensive analysis',
      tips: [
        'Place at 6", 12", and 18" depths',
        'Calibrate before first use',
        'Avoid areas with heavy fertilizer application',
      ],
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Zap,
      title: 'Power & Connectivity',
      description: 'Connect sensors to the power supply and network',
      tips: [
        'Use solar panels for remote areas',
        'Ensure stable internet connectivity',
        'Test all connections before finalizing',
      ],
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Device Setup</h1>
        </div>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto">
        {/* Introduction */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Setup your Farm
          </h2>
          <p className="text-gray-500">
            Follow these 3 simple steps to connect your farm to the cloud.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-green-900/5 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 transition-transform group-hover:scale-110 ${step.color.replace('text-', 'bg-')}`} />

                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-4 transition-transform group-hover:-translate-y-1`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="w-full bg-gray-50 rounded-xl p-4 text-left">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Key Tips</p>
                    <div className="space-y-3">
                      {step.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start gap-3">
                          <div className="mt-0.5 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation - Static */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 px-6 py-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between max-w-md mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Home</span>
          </button>

          <button
            onClick={() => {
              navigate('/dashboard');
            }}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <BarChart2 className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Analytics</span>
          </button>



          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Landmark className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Schemes</span>
          </button>

          <button
            onClick={() => navigate('/sensor-guide')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Activity className="w-6 h-6 text-green-600" />
            <span className="text-[10px] font-medium text-green-600">Sensors</span>
          </button>

          <button
            onClick={() => navigate('/my-farm')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <MapPin className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Crops</span>
          </button>

          <button
            onClick={() => navigate('/ai-engine')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Cpu className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">AI Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
}
