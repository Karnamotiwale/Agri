import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { schemeService, GovernmentScheme } from '../../services/scheme.service';
import { 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  CloudSun, 
  Building,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion } from 'motion/react';

const iconMap: Record<string, any> = {
  ShieldCheck,
  CreditCard,
  Banknote,
  CloudSun,
  Building
};

export default function SchemesPage() {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Insurance' | 'Loan'>('All');

  useEffect(() => {
    async function loadSchemes() {
      setLoading(true);
      const data = activeCategory === 'All' 
        ? await schemeService.getAllSchemes()
        : await schemeService.getSchemesByCategory(activeCategory);
      setSchemes(data);
      setLoading(false);
    }
    loadSchemes();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24">
      <Header title="Govt. Schemes" showBack onBackClick={() => navigate('/dashboard')} />

      <div className="p-6">
        {/* Category Pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Insurance', 'Loan'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-6 py-2.5 rounded-full text-xs font-black transition-all ${
                activeCategory === cat
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                  : 'bg-white text-gray-400 border border-gray-100 hover:border-green-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs font-bold text-gray-400">Loading schemes...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schemes.map((scheme) => {
              const Icon = iconMap[scheme.icon] || ShieldCheck;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={scheme.id}
                  className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-900/5 border border-gray-100 relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 blur-2xl opacity-20 ${
                    scheme.category === 'Insurance' ? 'bg-blue-600' : 'bg-green-600'
                  }`} />
                  
                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`p-4 rounded-2xl ${
                      scheme.category === 'Insurance' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                          scheme.category === 'Insurance' ? 'text-blue-500' : 'text-green-500'
                        }`}>
                          {scheme.category}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
                      </div>
                      <h3 className="text-sm font-black text-gray-900 leading-tight mb-2">
                        {scheme.name}
                      </h3>
                      <p className="text-[11px] font-bold text-gray-500 leading-relaxed line-clamp-2">
                        {scheme.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                    <div className="flex -space-x-1">
                      {scheme.benefits.slice(0, 2).map((_, i) => (
                        <div key={i} className="w-5 h-5 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                        </div>
                      ))}
                    </div>
                    <a 
                      href={scheme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[10px] font-black text-green-600 hover:text-green-700 transition-colors"
                    >
                      APPLY NOW
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-green-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-green-600/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <h3 className="text-lg font-black mb-2 relative z-10">Need Assistance?</h3>
          <p className="text-xs font-bold opacity-80 mb-6 relative z-10">
            Contact your local Gram Panchayat or District Agricultural Office for localized help with these schemes.
          </p>
          <button className="bg-white text-green-600 px-6 py-3 rounded-2xl text-xs font-black shadow-lg relative z-10 active:scale-95 transition-transform">
            FIND NEAREST OFFICE
          </button>
        </div>
      </div>
    </div>
  );
}
