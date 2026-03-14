import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { marketplaceService, MarketplaceItem } from '../../services/marketplace.service';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ExternalLink, 
  Star, 
  ArrowRight,
  TrendingUp,
  Package,
  Sprout,
  Wrench,
  Beef
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categoryIcons: Record<string, any> = {
  'All': ShoppingBag,
  'Organic Fertilizers': Sprout,
  'Organic Pesticides': Package,
  'Seeds': TrendingUp,
  'Crop Nutrition': Sprout,
  'Cattle Feed': Beef,
  'Tools & Machinery': Wrench
};

export default function MarketPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = marketplaceService.getCategories();

  useEffect(() => {
    async function loadItems() {
      setLoading(true);
      const data = await marketplaceService.getItems(activeCategory);
      setItems(data);
      setLoading(false);
    }
    loadItems();
  }, [activeCategory]);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24">
      <Header title="Marketplace" showBack onBackClick={() => navigate('/dashboard')} />

      <div className="px-6 py-4">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search organic fertilizers, seeds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-4 bg-white border-none rounded-[1.5rem] text-sm font-bold text-gray-900 shadow-xl shadow-gray-200/50 focus:ring-2 focus:ring-green-500 placeholder-gray-400 transition-all"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || ShoppingBag;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-6 py-3 rounded-[1.2rem] flex items-center gap-2.5 transition-all duration-300 ${
                  isActive
                    ? 'bg-green-600 text-white shadow-lg shadow-green-600/30 scale-105'
                    : 'bg-white text-gray-500 hover:bg-green-50 hover:text-green-600 shadow-md shadow-gray-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-green-600'}`} />
                <span className="text-[11px] font-black whitespace-nowrap">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            {activeCategory === 'All' ? 'Popular Items' : activeCategory}
          </h2>
          <span className="text-[10px] font-black text-gray-400">{filteredItems.length} ITEMS FOUND</span>
        </div>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-[11px] font-black text-gray-400 tracking-widest">LOADING SHOP...</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-[2.2rem] p-5 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col group transition-all hover:shadow-2xl hover:shadow-green-600/5 hover:-translate-y-1"
                >
                  {/* Image & Price Tag */}
                  <div className="relative aspect-square mb-5 rounded-[1.8rem] overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg">
                      <span className="text-xs font-black text-green-600">{item.price}</span>
                    </div>
                    <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-black text-white">{item.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 px-1">
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.15em] mb-1.5 block">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-black text-gray-900 mb-2 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-400 leading-relaxed mb-6 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Button */}
                  <a 
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-50 text-green-600 py-4 rounded-[1.2rem] flex items-center justify-center gap-2 text-[11px] font-black group-hover:bg-green-600 group-hover:text-white transition-all shadow-sm"
                  >
                    BUY NOW
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 px-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-sm font-black text-gray-900 mb-2">No items found</h3>
            <p className="text-[11px] font-bold text-gray-500">We couldn't find any items matching your search. Try a different category or search term.</p>
          </div>
        )}

        {/* Future Banner */}
        <div className="mt-12 bg-gray-900 rounded-[2.5rem] p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="flex items-center gap-6">
            <div className="flex-1 pl-4">
              <h3 className="text-base font-black mb-1">Coming Soon! 🚀</h3>
              <p className="text-[10px] font-bold opacity-60">Direct in-app ordering and exclusive KisaanSaathi member discounts.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-[1.5rem]">
              <div className="w-10 h-10 border-2 border-green-500/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
