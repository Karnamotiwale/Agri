import React, { useState } from 'react';
import { 
  Sprout, 
  Droplets, 
  ShieldCheck, 
  ChevronRight,
  BookOpen,
  FlaskConical,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { farmingWisdomService } from '../../services/farmingWisdom.service';

export function WisdomCards() {
  const [selectedFertilizer, setSelectedFertilizer] = useState<any>(null);
  const tips = farmingWisdomService.getCultivationTips()[0].stages;
  const fertilizer = farmingWisdomService.getFertilizerGuides()[0];

  return (
    <div className="space-y-4 px-1 pb-2">
      {/* Cultivation Knowledge Section */}
      <div className="bg-white rounded-[2.2rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-2xl">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                Cultivation Roadmap
              </h3>
              <p className="text-[10px] font-bold text-gray-400">Step-by-step crop management</p>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-50" />

          <div className="space-y-8 relative">
            {tips.map((stage, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-white border-2 border-gray-50 flex items-center justify-center shrink-0 group-hover:border-green-100 group-hover:bg-green-50 transition-all duration-300">
                  {i === 0 && <Sprout className="w-5 h-5 text-gray-400 group-hover:text-green-600" />}
                  {i === 1 && <Droplets className="w-5 h-5 text-gray-400 group-hover:text-green-600" />}
                  {i === 2 && <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-green-600" />}
                  {i === 3 && <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-[11px] font-black text-gray-900">{stage.name}</h4>
                    <span className="text-[9px] font-black bg-gray-50 text-gray-400 px-2.5 py-1 rounded-full group-hover:bg-green-100 group-hover:text-green-700 transition-colors">
                      {stage.period}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {stage.tasks.map((task, j) => (
                      <li key={j} className="text-[10px] font-bold text-gray-500 flex gap-2 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-green-300 shrink-0 mt-1.5" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Organic Manufacturing Section */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => setSelectedFertilizer(fertilizer)}
        className="bg-gradient-to-br from-green-600 to-green-700 rounded-[2.2rem] p-6 shadow-xl shadow-green-600/20 text-white relative overflow-hidden cursor-pointer group"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-110 transition-transform duration-500" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                Organic Manufacturing
              </h3>
              <p className="text-[10px] font-bold text-green-100 opacity-80">Make fertilizer at home</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            7 DAYS PROCESS
          </div>
        </div>

        <div className="flex items-end justify-between relative z-10">
          <div className="space-y-1">
            <h4 className="text-xl font-black">{fertilizer.name}</h4>
            <p className="text-[11px] font-bold text-green-50 max-w-[200px]">
              The complete manual on making liquid gold for your crops.
            </p>
          </div>
          <div className="p-3 bg-white text-green-600 rounded-2xl shadow-lg shadow-green-800/20 group-hover:translate-x-1 transition-transform">
             <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </motion.div>

      {/* Deep-Dive Modal */}
      <AnimatePresence>
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
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white relative">
                <button 
                  onClick={() => setSelectedFertilizer(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-2">Fertilizer Masterclass</h3>
                <h2 className="text-2xl font-black">{selectedFertilizer.name} Guide</h2>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto space-y-8">
                {/* Ingredients */}
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

                {/* Preparation */}
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

                {/* Application */}
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

              {/* Modal Footer */}
              <div className="p-8 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedFertilizer(null)}
                  className="w-full bg-white border border-gray-200 py-3.5 rounded-2xl text-xs font-black text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  GOT IT, THANKS!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
