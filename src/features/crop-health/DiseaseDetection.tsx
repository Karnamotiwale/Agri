import React, { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import { cropService } from "../../services/cropService";
import DiseaseResult from "./DiseaseResult";

export function DiseaseDetection() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null); // Clear previous results
    }
  };

  const clearSelection = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
  };

  const handleDetect = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const response = await cropService.detectCropDisease(image);
      setResult(response);
    } catch (err: any) {
      console.error("Detection failed", err);
      // Construct an error object matching the Result interface
      setResult({ 
        error: err?.response?.data?.error || err.message || "Failed to analyze crop image." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-shrink-0 animate-in slide-in-from-right duration-500">
      <div className="mx-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[2.5rem] p-8 mt-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] shadow-sm border border-blue-100/50">
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-3xl -ml-16 -mb-16" />

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {!preview ? (
          <>
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-200/50">
              <Camera className="w-8 h-8 text-blue-600" />
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-2">Take a picture</h2>
            <p className="text-sm font-medium text-gray-500 mb-8 max-w-[200px] text-center">
              Find out what's wrong with your crop
            </p>

            <button 
              onClick={handleUploadClick}
              className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Camera className="w-4 h-4" />
              Upload Image
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col items-center z-10 w-full">
            <div className="relative w-full max-w-[240px] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 mb-6 border-4 border-white">
              <img src={preview} alt="Crop preview" className="w-full h-full object-cover" />
              {loading && (
                <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center">
                   <div className="flex flex-col items-center gap-3">
                     <Loader2 className="w-8 h-8 text-white animate-spin" />
                     <span className="text-xs font-black text-white px-3 py-1 bg-white/20 rounded-full">ANALYZING</span>
                   </div>
                </div>
              )}
            </div>

            {!result && !loading && (
               <div className="flex gap-3 w-full max-w-[240px]">
                 <button 
                  onClick={clearSelection}
                  className="flex-1 py-3.5 bg-white text-gray-500 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                  onClick={handleDetect}
                  className="flex-[2] py-3.5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all"
                 >
                   Detect Disease
                 </button>
               </div>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="px-6 pb-6">
          <DiseaseResult result={result} />
          <button 
             onClick={clearSelection}
             className="mt-4 w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs hover:bg-gray-200 transition-colors"
          >
            SCAN ANOTHER CROP
          </button>
        </div>
      )}
    </div>
  );
}
