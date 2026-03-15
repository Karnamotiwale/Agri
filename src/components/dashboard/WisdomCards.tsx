import React, { useState } from 'react';
import { 
  Sprout, 
  FlaskConical,
  X,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Droplets,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { farmingWisdomService } from '../../services/farmingWisdom.service';

export function WisdomCards() {
  const [selectedFertilizer, setSelectedFertilizer] = useState<any>(null);
  const [showCultivation, setShowCultivation] = useState(false);

  const tips = farmingWisdomService.getCultivationTips()[0].stages;
  const fertilizer = farmingWisdomService.getFertilizerGuides()[0];

  return (
    <div className="space-y-4 px-1 pb-6">
      
      {/* 2-Column Grid matching user's requested style */}
      <h2 className="text-2xl font-black mb-2 mt-4 px-1" style={{ color: '#1B3A1B' }}>📚 Library</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Cultivation Tips Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCultivation(true)}
          className="rounded-[1.5rem] p-5 cursor-pointer flex flex-col justify-between min-h-[160px] shadow-sm relative overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #C7E76C, #8CD867)' }}
        >
          <h3 className="text-lg font-bold leading-tight max-w-[80%]" style={{ color: '#0F5132' }}>
            🌱 Cultivation<br/>Tips
          </h3>
          <div className="absolute right-4 bottom-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Sprout className="w-5 h-5" style={{ color: '#2E7D32' }} />
            </div>
          </div>
        </motion.div>

        {/* Organic Fertilizer Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedFertilizer(fertilizer)}
          className="rounded-[1.5rem] p-5 cursor-pointer flex flex-col justify-between min-h-[160px] shadow-sm relative overflow-hidden group"
          style={{ background: 'linear-gradient(135deg, #FFE27A, #F6C945)' }}
        >
          <h3 className="text-lg font-bold leading-tight max-w-[80%]" style={{ color: '#5A3800' }}>
            🧪 Organic<br/>Fertilizer
          </h3>
          <div className="absolute right-4 bottom-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <FlaskConical className="w-5 h-5" style={{ color: '#8B6500' }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Deep-Dive Modals */}
      <AnimatePresence>
        
        {/* CULTIVATION MODAL */}
        {showCultivation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCultivation(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 max-h-[85vh] flex flex-col"
            >
              <div className="bg-[#e2e6fa] p-8 text-[#081a4a] relative">
                <button 
                  onClick={() => setShowCultivation(false)}
                  className="absolute top-6 right-6 p-2 bg-white/50 rounded-xl hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-2">Guide</h3>
                <h2 className="text-2xl font-black">Cultivation Roadmap</h2>
              </div>
              <div className="p-8 overflow-y-auto space-y-8 relative">
                <div className="absolute left-10 top-8 bottom-8 w-0.5 bg-gray-100" />
                {tips.map((stage: any, i: number) => (
                  <div key={i} className="flex gap-4 group relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-gray-100 flex items-center justify-center shrink-0">
                      {i === 0 && <Sprout className="w-5 h-5 text-gray-400 group-hover:text-green-600" />}
                      {i === 1 && <Droplets className="w-5 h-5 text-gray-400 group-hover:text-green-600" />}
                      {i === 2 && <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-green-600" />}
                      {i === 3 && <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-black text-gray-900">{stage.name}</h4>
                        <span className="text-[9px] font-black bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                          {stage.period}
                        </span>
                      </div>
                      <ul className="space-y-1.5 mt-2">
                        {stage.tasks.map((task: string, j: number) => (
                          <li key={j} className="text-[11px] font-bold text-gray-500 flex gap-2 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0 mt-1" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button onClick={() => setShowCultivation(false)} className="w-full bg-[#081a4a] text-white py-3.5 rounded-2xl text-xs font-black">
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* FERTILIZER MODAL */}
        {selectedFertilizer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFertilizer(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 max-h-[85vh] flex flex-col"
            >
              <div className="bg-[#e2e6fa] p-8 text-[#081a4a] relative">
                <button 
                  onClick={() => setSelectedFertilizer(null)}
                  className="absolute top-6 right-6 p-2 bg-white/50 rounded-xl hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-2">Masterclass</h3>
                <h2 className="text-2xl font-black">{selectedFertilizer.name}</h2>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                       <BookOpen className="w-4 h-4 text-orange-500" />
                    </div>
                    <h4 className="text-sm font-black text-gray-900 flex-1">Stage 1: Ingredients</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedFertilizer.ingredients.map((ing: string, i: number) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                         <span className="text-[11px] font-bold text-gray-700">{ing}</span>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                       <FlaskConical className="w-4 h-4 text-blue-500" />
                    </div>
                    <h4 className="text-sm font-black text-gray-900 flex-1">Stage 2: Preparation</h4>
                  </div>
                  <div className="space-y-4">
                    {selectedFertilizer.preparation.map((step: string, i: number) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-xs font-black text-blue-300 shrink-0">0{i+1}</span>
                        <p className="text-[11px] font-bold text-gray-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <h4 className="text-sm font-black text-gray-900 flex-1">Stage 3: Application</h4>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                    <ul className="space-y-2">
                      {selectedFertilizer.application.map((app: string, i: number) => (
                        <li key={i} className="text-[10px] font-bold text-green-800 flex gap-2">
                           <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-green-400" />
                           {app}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <button onClick={() => setSelectedFertilizer(null)} className="w-full bg-[#081a4a] text-white py-3.5 rounded-2xl text-xs font-black">
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
