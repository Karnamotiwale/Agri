import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  Stethoscope, 
  Droplets,
  CheckCircle2,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { healthService, DiagnosisResult } from '../../services/health.service';
import { BottomNav } from '../../components/layout/BottomNav';

export default function DiagnosisResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const uploadedImage = location.state?.image;
  
  const [analyzing, setAnalyzing] = useState(true);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  useEffect(() => {
    if (!uploadedImage) {
      navigate('/dashboard');
      return;
    }

    async function process() {
      const data = await healthService.diagnoseImage(uploadedImage);
      setResult(data);
      setAnalyzing(false);
    }
    process();
  }, [uploadedImage, navigate]);

  if (analyzing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <motion.div 
            className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <Stethoscope className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Analyzing Image...</h2>
        <p className="text-sm font-bold text-gray-400">Our AI Doctor is reviewing your crop data.</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-4 bg-white">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Diagnosis Result</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Uploaded Image Preview */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
           <img src={uploadedImage} className="w-full h-64 object-cover" alt="Captured Crop" />
           <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Captured
           </div>
        </div>

        {/* Diagnosis Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 border border-blue-50">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Detected Disease</h2>
                 <h3 className="text-xl font-black text-gray-900">{result.diseaseName}</h3>
              </div>
              <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-black">
                 {result.confidence}% Confidence
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">Symptoms</h4>
              {result.symptoms.map((s, i) => (
                <div key={i} className="flex gap-3 items-start">
                   <div className="w-5 h-5 rounded-full bg-amber-50 flex items-center justify-center mt-0.5">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                   </div>
                   <p className="text-sm font-bold text-gray-600 leading-tight">{s}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Treatment Tabs Layout (Simpler visual) */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50">
           <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              Treatment Plan
           </h2>
           
           <div className="space-y-6">
              <div>
                 <h4 className="text-xs font-black text-green-600 uppercase tracking-widest mb-4">Organic Control</h4>
                 <div className="space-y-3">
                    {result.organicTreatment.map((t, i) => (
                      <div key={i} className="flex gap-3 items-center p-3 bg-green-50/50 rounded-2xl border border-green-100">
                         <CheckCircle2 className="w-4 h-4 text-green-600" />
                         <span className="text-xs font-bold text-gray-700">{t}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-100">
                 <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-4">Chemical Control</h4>
                 <div className="space-y-3">
                    {result.chemicalTreatment.map((t, i) => (
                      <div key={i} className="flex gap-3 items-center p-3 bg-red-50/50 rounded-2xl border border-red-100">
                         <Droplets className="w-4 h-4 text-red-600" />
                         <span className="text-xs font-bold text-gray-700">{t}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Doctor Review Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-600/30">
           <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                 <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                 <h3 className="text-lg font-black">Doctor Review</h3>
                 <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Certified Specialist Advice</p>
              </div>
           </div>
           
           <p className="text-sm font-bold text-blue-50 leading-relaxed mb-6 italic">
              "{result.doctorAdvice}"
           </p>

           <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
              <Info className="w-5 h-5 text-blue-200" />
              <p className="text-[10px] font-bold text-blue-100">Consult with a local agriculture officer for severe infections.</p>
           </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
