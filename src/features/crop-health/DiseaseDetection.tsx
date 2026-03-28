import React, { useState, useRef } from "react";
import { Camera, Image as ImageIcon, Loader2, Leaf, AlertTriangle } from "lucide-react";

interface PredictionResult {
  crop: string;
  disease: string;
  confidence: number;
  organic_remedies?: string[];
  prevention?: string[];
}

export function DiseaseDetection() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setResult(null);
      setError(null);
    }
  };

  const clearSelection = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDetect = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      // The Flask backend expects the key 'image' for the crop image upload
      formData.append("image", image); 

      // Send a direct POST request to the Flask backend's detect-disease endpoint
      const response = await fetch("http://localhost:5000/api/v1/crops/detect-disease", {
        method: "POST",
        body: formData,
        // Do NOT set Content-Type to multipart/form-data manually, 
        // fetch will automatically set it along with the correct boundary!
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Disease API Response:", data);

      setResult({
        crop: data.crop,
        disease: data.disease,
        confidence: data.confidence,
        organic_remedies: data.organic_remedies,
        prevention: data.prevention,
      });
    } catch (err: any) {
      console.error("Detection failed:", err);
      setError(err.message || "Failed to analyze crop image. Check if the Flask backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-shrink-0 animate-in slide-in-from-right duration-500">
      <div className="mx-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-[2.5rem] p-8 mt-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] shadow-sm border border-green-100/50">
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl -ml-16 -mb-16" />

        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {!preview ? (
          <>
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-green-200/50">
              <Camera className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-2">Disease Scanner</h2>
            <p className="text-sm font-medium text-gray-500 mb-8 max-w-[200px] text-center">
              Upload a clear photo of the affected crop leaf
            </p>

            <button 
              onClick={handleUploadClick}
              className="px-8 py-3.5 bg-green-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Camera className="w-4 h-4" />
              Upload Image
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col items-center z-10 w-full">
            <div className="relative w-full max-w-[240px] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-green-900/10 mb-6 border-4 border-white">
              <img src={preview} alt="Crop preview" className="w-full h-full object-cover" />
              {loading && (
                <div className="absolute inset-0 bg-green-900/40 backdrop-blur-sm flex items-center justify-center">
                   <div className="flex flex-col items-center gap-3">
                     <Loader2 className="w-8 h-8 text-white animate-spin" />
                     <span className="text-xs font-black text-white px-3 py-1 bg-white/20 rounded-full">ANALYZING</span>
                   </div>
                </div>
              )}
            </div>

            {!result && !loading && !error && (
               <div className="flex gap-3 w-full max-w-[240px]">
                 <button 
                  onClick={clearSelection}
                  className="flex-1 py-3.5 bg-white text-gray-500 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                  onClick={handleDetect}
                  className="flex-[2] py-3.5 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-600/30 hover:bg-green-700 active:scale-[0.98] transition-all"
                 >
                   Detect Disease
                 </button>
               </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="px-6 mt-6">
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black text-red-900">Analysis Failed</h4>
              <p className="text-xs font-bold text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <button 
             onClick={clearSelection}
             className="mt-4 w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs hover:bg-gray-200 transition-colors"
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {result && (
        <div className="px-6 mt-6 pb-6 animate-in slide-in-from-bottom flex flex-col gap-4">
          <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/40">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-green-100">Confirmed Crop</h3>
                  <h2 className="text-lg font-black">{result.crop}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-green-200">Confidence</p>
                <p className="text-lg font-black">{result.confidence.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="p-5 bg-gray-50/50">
              <div className={`p-4 rounded-2xl border shadow-sm ${result.disease.toLowerCase() === 'healthy' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <h4 className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-2 mb-1 ${result.disease.toLowerCase() === 'healthy' ? 'text-green-900' : 'text-red-900'}`}>
                  {result.disease.toLowerCase() === 'healthy' ? <Leaf className="w-3.5 h-3.5 text-green-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                  Diagnosis Result
                </h4>
                <p className={`text-sm font-bold ${result.disease.toLowerCase() === 'healthy' ? 'text-green-800' : 'text-red-800'}`}>{result.disease}</p>
              </div>

              {result.organic_remedies && result.organic_remedies.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-800 mb-2 flex items-center gap-2">
                    <Leaf className="w-3 h-3" />
                    Organic Remedies & Treatment
                  </h4>
                  <ul className="space-y-2">
                    {result.organic_remedies.map((remedy, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm font-medium text-gray-700 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm shadow-emerald-50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {remedy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.prevention && result.prevention.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-blue-800 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-blue-500" />
                    Prevention Strategies
                  </h4>
                  <ul className="space-y-2">
                    {result.prevention.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm font-medium text-gray-700 bg-white p-3 rounded-xl border border-blue-100 shadow-sm shadow-blue-50">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <button 
             onClick={clearSelection}
             className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-xs hover:bg-gray-200 transition-colors"
          >
            SCAN ANOTHER CROP
          </button>
        </div>
      )}
    </div>
  );
}
