import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  ChevronDown, 
  Sprout, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  Droplets,
  Thermometer,
  Compass
} from 'lucide-react';
import { BottomNav } from '../../components/layout/BottomNav';
import { cropService } from '../../services/crop.service';

export default function SoilAnalysisPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We'll use the latest generated data for current soil state
    const history = cropService.generateMockJourneyData(1);
    setData(history[0]);
    setLoading(false);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Fertility Prediction Logic
  const getFertilityInfo = () => {
    const { nitrogen, phosphorus, potassium, soil_moisture } = data;
    const n = nitrogen;
    const p = phosphorus;
    const k = potassium;
    
    // Simple heuristic for demo
    const score = Math.min(100, Math.round(((n / 50) + (p / 40) + (k / 40)) * 33.3));
    
    if (score > 80) return { score, status: 'Optimal', color: 'text-green-600', bg: 'bg-green-50', message: 'Soil is highly fertile. Trace minerals are well balanced.' };
    if (score > 50) return { score, status: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', message: 'Fertility is stable. Slight adjustment in Phosphorus may increase yield.' };
    return { score, status: 'Needs Improvement', color: 'text-amber-600', bg: 'bg-amber-50', message: 'Low nutrient detected. Consider organic fertilization.' };
  };

  const fertility = getFertilityInfo();

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('/services')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Soil Analysis</h1>
      </div>

      <div className="px-6 mb-8">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <MapPin className="w-4 h-4 text-gray-900" />
          <span className="text-sm font-bold text-gray-900">hehehe, hahaha</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Fertility Prediction Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Fertility Prediction</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">AI Analysis Result</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${fertility.bg} ${fertility.color} text-xs font-black`}>
              {fertility.status}
            </div>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Simple CSS-based Circular Progress Mock */}
              <svg className="w-full h-full -rotate-90">
                <circle cx="96" cy="96" r="80" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                <circle 
                  cx="96" cy="96" r="80" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray="502"
                  strokeDashoffset={502 - (502 * fertility.score) / 100}
                  className={`${fertility.color}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-gray-900">{fertility.score}%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Score</span>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl ${fertility.bg} border border-opacity-20`}>
            <div className="flex gap-3">
              <Sprout className={`w-5 h-5 flex-shrink-0 ${fertility.color}`} />
              <p className={`text-xs font-bold leading-relaxed ${fertility.color}`}>
                {fertility.message}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
           <h2 className="text-lg font-bold text-gray-900 mb-6">Detailed Metrics</h2>
           <div className="grid grid-cols-2 gap-4">
              <MetricBox icon={Thermometer} label="Nitrogen (N)" value={`${data.nitrogen.toFixed(1)}`} unit="mg/kg" color="text-red-500" bg="bg-red-50" />
              <MetricBox icon={Sprout} label="Phosphorus (P)" value={`${data.phosphorus.toFixed(1)}`} unit="mg/kg" color="text-blue-500" bg="bg-blue-50" />
              <MetricBox icon={Compass} label="Potassium (K)" value={`${data.potassium.toFixed(1)}`} unit="mg/kg" color="text-amber-500" bg="bg-amber-50" />
              <MetricBox icon={ShieldCheck} label="pH Level" value="6.8" unit="pH" color="text-purple-500" bg="bg-purple-50" />
              <MetricBox icon={Droplets} label="Moisture" value={`${data.soil_moisture.toFixed(1)}`} unit="%" color="text-cyan-500" bg="bg-cyan-50" />
              <MetricBox icon={Info} label="Organic C" value="1.2" unit="%" color="text-green-500" bg="bg-green-50" />
           </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recommendations</h2>
          <div className="space-y-4">
             <RecommendationItem 
               icon={AlertTriangle} 
               title="Enhance Phosphorus" 
               desc="Add bone meal or rock phosphate to improve root development." 
               color="text-amber-600"
               bg="bg-amber-50"
             />
             <RecommendationItem 
               icon={ShieldCheck} 
               title="Maintain pH" 
               desc="Your pH level is optimal for most cereals. Keep current lime schedule." 
               color="text-green-600"
               bg="bg-green-50"
             />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function MetricBox({ icon: Icon, label, value, unit, color, bg }: any) {
  return (
    <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
       <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}>
          <Icon className="w-5 h-5" />
       </div>
       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
       <div className="flex items-baseline gap-1">
          <span className="text-xl font-black text-gray-900">{value}</span>
          <span className="text-[10px] font-bold text-gray-400">{unit}</span>
       </div>
    </div>
  );
}

function RecommendationItem({ icon: Icon, title, desc, color, bg }: any) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
       <div className={`w-12 h-12 flex-shrink-0 ${bg} ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
       </div>
       <div>
          <h4 className="text-sm font-black text-gray-900 mb-1">{title}</h4>
          <p className="text-xs font-bold text-gray-500 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}
