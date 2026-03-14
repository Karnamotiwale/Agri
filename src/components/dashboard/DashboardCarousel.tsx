import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Smartphone, 
  Search, 
  ShieldCheck, 
  AlertCircle,
  Stethoscope
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SliderContent {
  id: number;
  title: string;
  image: string;
  buttonText: string;
  icon: any;
  color: string;
}

const slides: SliderContent[] = [
  {
    id: 0,
    title: 'Take a picture',
    image: 'https://images.unsplash.com/photo-1592330363412-1f417f7c4613?auto=format&fit=crop&q=80&w=600',
    buttonText: 'Take a picture',
    icon: Camera,
    color: 'from-blue-500/20 to-blue-600/20'
  },
  {
    id: 1,
    title: 'See diagnosis',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=600',
    buttonText: 'See diagnosis',
    icon: Stethoscope,
    color: 'from-green-500/20 to-green-600/20'
  },
  {
    id: 2,
    title: 'Get medicine',
    image: 'https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=600',
    buttonText: 'Get medicine',
    icon: ShieldCheck,
    color: 'from-amber-500/20 to-amber-600/20'
  }
];

export function DashboardCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Auto-play logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate navigate to result with image
      const reader = new FileReader();
      reader.onloadend = () => {
        navigate('/diagnosis-result', { state: { image: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-cyan-50 to-white py-12 px-6 rounded-b-[4rem]">
      <div className="flex flex-col items-center">
        {/* Animated Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Main Illustration Placeholder */}
            <div className="relative mb-8">
              <div className={`absolute inset-0 blur-3xl rounded-full opacity-30 bg-gradient-to-br ${slides[currentSlide].color}`}></div>
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Simulated Illustration with Icon */}
                <div className="relative z-10 p-6 bg-white shadow-2xl rounded-3xl border border-white/50 animate-pulse-subtle">
                   {/* Capitalize icon for React component usage */}
                   {(() => {
                      const SlideIcon = slides[currentSlide].icon;
                      return <SlideIcon className="w-20 h-20 text-blue-600" />;
                   })()}
                </div>
                {/* Decorative dots/stars */}
                <div className="absolute -top-4 -right-4 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-4 w-3 h-3 bg-indigo-400 rotate-45"></div>
              </div>
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-6">{slides[currentSlide].title}</h2>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleCaptureClick}
          className="w-full max-w-[280px] bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-3xl font-black text-lg shadow-xl shadow-blue-600/30 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Camera className="w-6 h-6" />
          {slides[currentSlide].buttonText}
        </button>

        {/* Hidden Camera/File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
