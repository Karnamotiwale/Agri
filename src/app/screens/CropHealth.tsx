import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Scan, CheckCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/ai.service';

export function CropHealth() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCrop } = useApp();
  const crop = getCrop(id || '1');
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [result, setResult] = useState<null | 'healthy' | 'issue'>(null);

  const handleAnalysis = async () => {
    if (!id) return;
    setAnalysisLoading(true);
    try {
      const dummyFile = new File([""], "crop.jpg", { type: "image/jpeg" });
      const res = await aiService.detectCropHealth(id, dummyFile);
      setDetectionResult(res);
      setResult('issue');
    } catch (err) {
      console.error(err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-6">
      <Header title="AI Health Check" showBack onBackClick={() => navigate('/dashboard')} />

      <div className="px-6 py-6">
        {/* Upload / Scan Area */}
        <div
          onClick={handleAnalysis}
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl h-64 flex flex-col items-center justify-center mb-8 cursor-pointer active:scale-95 transition-all hover:bg-gray-100"
        >
          {analysisLoading ? (
            <div className="flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Scan className="w-8 h-8 text-green-600 animate-spin" />
              </div>
              <p className="font-medium text-gray-500">Analyzing leaf patterns...</p>
            </div>
          ) : result ? (
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1599525420377-50a30b2c1f4c?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Scanned Leaf" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-gray-800">Scan Complete</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-green-600" />
              </div>
              <p className="font-bold text-gray-900 mb-1">Upload Leaf Photo</p>
              <p className="text-sm text-gray-500">Tap to scan or select image</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result === 'issue' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{detectionResult?.issue || 'Potential Issue'}</h3>
                  <p className="text-yellow-700 font-medium text-sm">Confidence: {detectionResult?.confidence || 90}%{crop?.name ? ` • ${crop.name}` : ''}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {detectionResult?.description || 'Detected potential signs of stress. Please review recommendations.'}
              </p>

              <div className="bg-white rounded-xl p-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Recommended Actions</h4>
                <ul className="space-y-3">
                  {detectionResult?.recommendations?.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 mt-0.5">{idx + 1}</div>
                      <span className="text-sm text-gray-700 font-medium">{rec}</span>
                    </li>
                  )) || (
                      <li className="text-sm text-gray-500 italic">No specific recommendations available.</li>
                    )}
                </ul>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700"
            >
              Order Treatment
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
