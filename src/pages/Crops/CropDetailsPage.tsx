import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import {
   Droplets,
   FlaskConical,
   Leaf,
   TrendingUp,
   Calendar,
   Sprout,
   BrainCircuit,
   CheckCircle2,
   Activity,
   ArrowRight,
   ShieldCheck,
   Factory,
   MapPin,
   Tag,
   Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';
import { useEffect, useState } from 'react';
import { cropService } from '../../services/crop.service';
import { motion } from 'motion/react';
import { AgronomicForm, AgronomicData } from '../../features/crop/AgronomicForm';

export default function CropFullDetails() {
   const { id } = useParams();
   const navigate = useNavigate();
   const cropId = id || '1';
   const { getCrop } = useApp();
   const crop = getCrop(cropId);
   const sensors = useCropSensors(cropId);

   const [stages, setStages] = useState<any[]>([]);
   const [valves, setValves] = useState({ irrigation: false, fertigation: false });
   const [yieldData, setYieldData] = useState<any>(null);
   const [rotation, setRotation] = useState<any>(null);
   const [organicRecs, setOrganicRecs] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [hasAgronomicData, setHasAgronomicData] = useState(false);

   useEffect(() => {
      async function loadData() {
         try {
            const [stageList, organicInfo] = await Promise.all([
               cropService.getGrowthStages(cropId),
               cropService.getOrganicRecommendations(cropId)
            ]);
            setStages(stageList);
            setOrganicRecs(organicInfo);
         } catch (err) {
            console.error('Failed to load crop details:', err);
         } finally {
            setLoading(false);
         }
      }
      loadData();
   }, [cropId]);

   const handleValveToggle = async (type: 'irrigation' | 'fertigation') => {
      const newStatus = !valves[type];
      const success = await cropService.toggleValve(type, newStatus);
      if (success) {
         setValves(prev => ({ ...prev, [type]: newStatus }));
      }
   };

   const handleAgronomicSubmit = async (data: AgronomicData) => {
      setLoading(true);
      try {
         const [yieldInfo, rotationInfo] = await Promise.all([
             cropService.getYieldPrediction(cropId, data),
             cropService.getRotationRecommendation(cropId, data)
         ]);
         setYieldData(yieldInfo);
         setRotation(rotationInfo);
         setHasAgronomicData(true);
      } catch (err) {
         console.error('Prediction failed', err);
      } finally {
         setLoading(false);
      }
   };

   if (!crop || loading) {
      return (
         <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-[#F8FAFB] pb-24">
         <Header title="Crop Details" showBack onBackClick={() => navigate('/dashboard')} />

         <div className="p-6 space-y-6">
            {/* 0. Crop Info Summary */}
            <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-900/5 border border-gray-100 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

               <div className="flex items-start justify-between relative z-10">
                  <div>
                     <h1 className="text-3xl font-black text-gray-900 mb-1">{crop.name}</h1>
                     <div className="flex items-center gap-2 text-gray-500 font-bold text-sm">
                        <Tag className="w-4 h-4" />
                        <span>{crop.cropVariety} Variety</span>
                     </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-2xl text-green-600 font-black text-xs uppercase tracking-wider border border-green-100">
                     Active Crop
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 mt-8 relative z-10">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                           <Calendar className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sowing Date</div>
                           <div className="text-sm font-bold text-gray-900">{crop.sowingDate}</div>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-xl">
                           <CheckCircle2 className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Est. Harvest</div>
                           <div className="text-sm font-bold text-gray-900">{crop.harvestDate}</div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl">
                           <Database className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Soil Type</div>
                           <div className="text-sm font-bold text-gray-900">{crop.soilType}</div>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-xl">
                           <MapPin className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                           <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</div>
                           <div className="text-sm font-bold text-gray-900">{crop.location}</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 1. Live Sensor Data - Top Priority */}
            <div className="grid grid-cols-2 gap-4">
               {/* Soil Moisture (ESP8266) */}
               <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-blue-900/5 border border-blue-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 blur-2xl opacity-50"></div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-blue-100 rounded-xl">
                        <Droplets className="w-5 h-5 text-blue-600" />
                     </div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Moisture</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                     <span className="text-3xl font-black text-gray-900">{sensors.moisture.toFixed(1)}</span>
                     <span className="text-sm font-bold text-gray-400">%</span>
                  </div>
                  <div className="mt-2 text-[10px] font-bold text-green-600 flex items-center gap-1">
                     <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                     Live from ESP-8266
                  </div>
               </div>

               {/* Soil NPK (ESP8266) */}
               <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-purple-900/5 border border-purple-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-12 -mt-12 blur-2xl opacity-50"></div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-2 bg-purple-100 rounded-xl">
                        <FlaskConical className="w-5 h-5 text-purple-600" />
                     </div>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Soil NPK</span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">{sensors.npk}</div>
                  <div className="mt-2 text-[10px] font-bold text-purple-600">Optimal levels detected</div>
               </div>
            </div>

            {/* 2. 5 Growing Stages Tracking */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50">
               <h3 className="text-lg font-black text-gray-900 mb-8 flex items-center justify-between">
                  Growth Progress
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Vegetative</span>
               </h3>

               <div className="flex justify-between relative mb-4">
                  {/* Connector Line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 -z-0"></div>
                  <div
                     className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-1000 -z-0"
                     style={{ width: '25%' }}
                  ></div>

                  {stages.map((stage, idx) => (
                     <div key={stage.id} className="flex flex-col items-center gap-3 relative z-10 w-1/5">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${stage.status === 'completed' ? 'bg-blue-600 border-blue-100' :
                              stage.status === 'current' ? 'bg-white border-blue-600' :
                                 'bg-white border-gray-100'
                           }`}>
                           {stage.status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                           ) : (
                              <span className={`text-xs font-black ${stage.status === 'current' ? 'text-blue-600' : 'text-gray-300'}`}>
                                 {stage.id}
                              </span>
                           )}
                        </div>
                        <span className={`text-[8px] font-black uppercase text-center tracking-tighter ${stage.status === 'current' ? 'text-blue-600' : 'text-gray-400'
                           }`}>
                           {stage.name}
                        </span>
                     </div>
                  ))}
               </div>

               <div className="bg-blue-50/50 rounded-2xl p-4 mt-6 border border-blue-100">
                  <p className="text-xs font-bold text-gray-600 leading-relaxed">
                     <span className="font-black text-blue-600">Current Phase:</span> {stages.find(s => s.status === 'current')?.description}
                  </p>
               </div>
            </div>

            {/* 3. Valve Control Hub (ESP32) */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                     <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <h3 className="text-lg font-black text-gray-900">Valve Control Hub</h3>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Edge Processing via ESP-32</p>
                  </div>
               </div>

               <div className="space-y-4">
                  {/* Irrigation Valve */}
                  <div className="flex items-center justify-between p-6 bg-blue-50/30 rounded-3xl border border-blue-100">
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${valves.irrigation ? 'bg-blue-600 shadow-lg shadow-blue-600/30' : 'bg-white shadow-sm border border-blue-100'}`}>
                           <Droplets className={`w-6 h-6 ${valves.irrigation ? 'text-white' : 'text-blue-600'}`} />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-gray-900">Irrigation Valve</h4>
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Main Field Sector</p>
                        </div>
                     </div>
                     <button
                        onClick={() => handleValveToggle('irrigation')}
                        className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${valves.irrigation
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                           }`}
                     >
                        {valves.irrigation ? 'STOP' : 'START'}
                     </button>
                  </div>

                  {/* Fertigation Valve */}
                  <div className="flex items-center justify-between p-6 bg-purple-50/30 rounded-3xl border border-purple-100">
                     <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${valves.fertigation ? 'bg-purple-600 shadow-lg shadow-purple-600/30' : 'bg-white shadow-sm border border-purple-100'}`}>
                           <FlaskConical className={`w-6 h-6 ${valves.fertigation ? 'text-white' : 'text-purple-600'}`} />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-gray-900">Fertigation Valve</h4>
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Nutrient Injector</p>
                        </div>
                     </div>
                     <button
                        onClick={() => handleValveToggle('fertigation')}
                        className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${valves.fertigation
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20'
                           }`}
                     >
                        {valves.fertigation ? 'STOP' : 'START'}
                     </button>
                  </div>
               </div>
            </div>

            {/* 3.5 Organic Fertilizer & Pest Recommendations */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/30">
                     <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                     <h3 className="text-lg font-black text-gray-900">Organic Fertilizer & Pest Recommendations</h3>
                     <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Natural & Eco-friendly</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {/* Fertilizer */}
                  <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 flex gap-4">
                     <div className="p-3 bg-white rounded-2xl shadow-sm h-fit">
                        <Sprout className="w-6 h-6 text-emerald-600" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-gray-900 mb-1">{organicRecs?.fertilizer.name}</h4>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed">
                           {organicRecs?.fertilizer.details}
                        </p>
                     </div>
                  </div>

                  {/* Pest Control */}
                  <div className="p-6 bg-teal-50/50 rounded-3xl border border-teal-100 flex gap-4">
                     <div className="p-3 bg-white rounded-2xl shadow-sm h-fit">
                        <ShieldCheck className="w-6 h-6 text-teal-600" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-gray-900 mb-1">{organicRecs?.pestControl.name}</h4>
                        <p className="text-xs font-bold text-gray-500 leading-relaxed">
                           {organicRecs?.pestControl.details}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* AI Calculations Block */}
            {!hasAgronomicData ? (
               <AgronomicForm 
                   onSubmit={handleAgronomicSubmit} 
                   initialData={{
                       cropType: crop.name,
                       sowingDate: crop.sowingDate,
                       soilType: crop.soilType?.toLowerCase().includes('loam') ? 'loam' : 'sandy',
                       moisture: Math.round(sensors.moisture || 40)
                   }}
               />
            ) : (
               <>
                  {/* 4. Yield Prediction Analysis */}
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-amber-600/30">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                              <TrendingUp className="w-6 h-6 text-white" />
                           </div>
                           <h3 className="text-lg font-black">Dynamic Yield Prediction</h3>
                        </div>
                        <button 
                           onClick={() => setHasAgronomicData(false)}
                           className="px-4 py-2 bg-black/10 hover:bg-black/20 text-white rounded-xl text-xs font-black backdrop-blur-md transition-all border border-white/10"
                        >
                           Make Adjustments
                        </button>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-baseline gap-2">
                           <span className="text-5xl font-black">{yieldData?.estimatedYield?.split(" ")[0]}</span>
                           <span className="text-sm font-bold opacity-80">{yieldData?.estimatedYield?.split(" ").slice(1).join(" ")} expected</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                              <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Confidence</p>
                              <p className="text-xl font-black">{yieldData?.confidence}%</p>
                           </div>
                           <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                              <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Harvest Window</p>
                              <p className="text-xs font-black">{yieldData?.harvestWindow}</p>
                           </div>
                        </div>

                        {/* Explainability factors */}
                        <div className="pt-4 border-t border-white/20">
                           <p className="text-xs font-bold opacity-90 leading-relaxed mb-3">
                              {yieldData?.explainability?.reason}
                           </p>
                           <div className="flex flex-wrap gap-2 mt-2">
                               {yieldData?.factors?.map((f: any, idx: number) => (
                                   <div key={idx} className="bg-white/10 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase text-white/90">
                                       {f.name} {f.impact === 'POSITIVE' ? '↑' : '↓'}
                                   </div>
                               ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* 5. Crop Rotation Recommendation */}
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                           <Factory className="w-6 h-6" />
                        </div>
                        <div>
                           <h3 className="text-lg font-black text-gray-900">Next Rotation</h3>
                           <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Optimized for Field Health</p>
                        </div>
                     </div>

                     <div className="bg-green-50/50 rounded-3xl p-6 border border-green-100">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-3xl">
                              🌱
                           </div>
                           <div>
                              <h4 className="text-base font-black text-gray-900">{rotation?.recommendedCrop}</h4>
                              <p className="text-xs font-bold text-gray-500">Suggested follow-up crop</p>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <p className="text-sm font-bold text-gray-700 leading-relaxed">
                              {rotation?.reason}
                           </p>
                           <div className="flex flex-wrap gap-2">
                              {rotation?.benefits?.map((benefit: string, i: number) => (
                                 <span key={i} className="px-3 py-1 bg-white text-[10px] font-black text-green-600 rounded-full border border-green-100">
                                    {benefit}
                                 </span>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            )}
         </div>
      </div>
   );
}
