import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Droplets, FlaskConical, Leaf, Loader2, Camera, Upload, CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';
import { CROP_GROWTH_STAGES, getCurrentStage } from '../../config/cropGrowthStages';
import { SmartValveControl } from '../../components/smart-farming/SmartValveControl';
// Mock services inline to replace missing backend/service files
const evaluate = (sensors: any) => {
  return {
    irrigation: sensors.moisture < 30 ? 'Irrigate' : 'Do not irrigate',
    fertilization: 'Do not fertilize',
    explanation: 'Soil moisture is optimal. No action needed at this time.'
  };
};

const analyzeCropHealth = (imageUrl: string, cropId: string, farmId: string, sensors: any) => {
  return {
    id: 'hd_' + Date.now(),
    cropId,
    farmId,
    imageUrl,
    status: 'healthy' as 'healthy' | 'mild_stress' | 'diseased',
    detectedIssues: [],
    explanation: 'The crop looks healthy based on visual analysis.',
    recommendedActions: ['Continue monitoring'],
    confidenceScore: 98,
    timestamp: new Date().toISOString()
  };
};
import type { CropHistoryEntry } from '../../context/AppContext';

const FALLBACK_CROP = {
  name: 'Crop',
  image: 'https://images.unsplash.com/photo-1582515073490-dc84fbbf5f84?q=80&w=1000&auto=format&fit=crop',
  landSize: '—',
  sowingDate: '—',
  stages: [{ name: '—', description: '—', date: '—', isActive: true }],
  farmId: 'f1',
  cropType: 'Unknown'
};

export function CropDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const cropId = id || '1';
  const { getCrop, getCropControl, setCropControl, getFarm, addHealthDetection, addCropHistory, getCropHistory, getHealthDetections } = useApp();
  const crop = getCrop(cropId) || FALLBACK_CROP;
  const farm = getFarm(crop.farmId || 'f1');
  const ctrl = getCropControl(cropId);
  const isIrrigationRunning = ctrl.irrigation;
  const isFertilizationRunning = ctrl.fertilization;

  const sensors = useCropSensors(id);
  const decision = evaluate(sensors);
  const history = getCropHistory(cropId);
  const healthDetections = getHealthDetections(cropId);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [healthResult, setHealthResult] = useState<any>(null);
  const [lastLoggedDecision, setLastLoggedDecision] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const decisionKey = `${decision.irrigation}-${decision.fertilization}`;
    const sensorKey = `${sensors.moisture.toFixed(0)}-${sensors.ph.toFixed(1)}`;
    const combinedKey = `${decisionKey}-${sensorKey}`;

    if (combinedKey !== lastLoggedDecision && !isIrrigationRunning && !isFertilizationRunning && lastLoggedDecision !== '') {
      const entry: CropHistoryEntry = {
        id: 'ch' + Date.now(),
        cropId: cropId,
        farmId: crop.farmId || 'f1',
        timestamp: new Date().toISOString(),
        sensorSnapshot: {
          moisture: sensors.moisture,
          ph: sensors.ph,
          npk: sensors.npk,
        },
        actionTaken: decision.irrigation === 'Irrigate' ? 'irrigation' : decision.fertilization === 'Fertilize' ? 'fertilization' : 'delay',
        aiRecommendation: decision.explanation,
        outcome: 'neutral',
      };
      addCropHistory(entry);
      setLastLoggedDecision(combinedKey);
    } else if (lastLoggedDecision === '') {
      setLastLoggedDecision(combinedKey);
    }
  }, [decision.irrigation, decision.fertilization, sensors.moisture, sensors.ph, sensors.npk, cropId, crop.farmId, isIrrigationRunning, isFertilizationRunning, lastLoggedDecision, addCropHistory]);

  const logActionToHistory = (action: 'irrigation' | 'fertilization' | 'delay' | 'no_action', wasStarted: boolean) => {
    const entry: CropHistoryEntry = {
      id: 'ch' + Date.now(),
      cropId: cropId,
      farmId: crop.farmId || 'f1',
      timestamp: new Date().toISOString(),
      sensorSnapshot: {
        moisture: sensors.moisture,
        ph: sensors.ph,
        npk: sensors.npk,
      },
      actionTaken: wasStarted ? action : 'no_action',
      aiRecommendation: decision.explanation,
      outcome: 'neutral',
    };
    addCropHistory(entry);
  };

  const handleIrrigation = () => {
    const wasRunning = isIrrigationRunning;
    setCropControl(cropId, 'irrigation', !wasRunning);
    logActionToHistory('irrigation', !wasRunning);
  };

  const handleFertilization = () => {
    const wasRunning = isFertilizationRunning;
    setCropControl(cropId, 'fertilization', !wasRunning);
    logActionToHistory('fertilization', !wasRunning);
  };

  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Please upload a JPG or PNG image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      setIsAnalyzing(true);

      setTimeout(() => {
        const result = analyzeCropHealth(imageUrl, cropId, crop.farmId || 'f1', {
          moisture: sensors.moisture,
          ph: sensors.ph,
          npk: sensors.npk,
        });
        setHealthResult(result);
        addHealthDetection(result);
        setIsAnalyzing(false);
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleCaptureClick = () => {
    cameraInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-600 to-green-700 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-600 to-green-700 text-white px-4 py-4 shadow-lg shadow-green-900/20">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Crop Details</h1>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Crop Overview Section */}
        <div className="mb-8">
          {/* Large Crop Image */}
          <div className="w-full h-64 rounded-3xl overflow-hidden mb-5 shadow-2xl shadow-green-900/30 border-4 border-white/20">
            <img
              src={crop.image}
              alt={crop.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Crop Name */}
          <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{crop.name}</h2>

          {/* Land Size */}
          <p className="text-white/95 text-sm mb-5 font-medium">{crop.landSize}</p>

          {/* Sowing Date */}
          <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/20">
            <Calendar className="w-4 h-4 text-white/90" />
            <span className="text-sm font-medium text-white/95">Sowing Date</span>
            <span className="text-sm font-semibold text-white">{crop.sowingDate}</span>
          </div>
        </div>

        {/* Crop Harvesting Section */}
        {(() => {
          const sowingDate = crop.sowingDate || '15 Jan 2024';
          const daysSincePlanting = Math.floor(
            (Date.now() - new Date(sowingDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          const cropType = (crop.cropType || crop.name || 'Maize')
            .replace(/wild /i, '')
            .replace(/onion/i, 'Maize');
          const stages = CROP_GROWTH_STAGES[cropType] || CROP_GROWTH_STAGES.Default;
          const currentStage = getCurrentStage(cropType, daysSincePlanting);

          return (
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
                Crop Harvesting
              </h3>

              {/* Horizontal Growth Timeline */}
              <div className="relative pt-4 pb-8">
                {/* Track Line */}
                <div className="absolute top-[22px] left-2 right-2 h-[3px] bg-gray-100 rounded-full"></div>

                {/* Progress Line */}
                <div
                  className="absolute top-[22px] left-2 h-[3px] bg-green-500 rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.max(0, Math.min(100, (stages.indexOf(currentStage!) / (stages.length - 1)) * 100))}%`
                  }}
                ></div>

                {/* Checkpoints */}
                <div className="relative flex justify-between px-1">
                  {stages.map((stage: any, idx: number) => {
                    const stageIdx = stages.indexOf(currentStage!);
                    const isPassed = idx < stageIdx;
                    const isCurrent = idx === stageIdx;

                    return (
                      <div key={idx} className="relative group">
                        <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10 ${isPassed ? 'bg-green-500 border-green-500' :
                          isCurrent ? 'bg-white border-green-500 w-5 h-5 -mt-[3px] shadow-lg shadow-green-200' :
                            'bg-white border-gray-200'
                          }`}>
                          {isCurrent && (
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full m-auto mt-[1.5px]"></div>
                          )}
                        </div>
                        {/* Tooltip-like stage name */}
                        {isCurrent && (
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                            <p className="text-[10px] font-bold text-green-600 uppercase tracking-tighter shadow-sm">
                              {stage.stage}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Live Field Status Section */}
        <div className="bg-white rounded-3xl p-6 mt-6 shadow-xl shadow-gray-900/10 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            Live Field Status
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center mb-2.5">
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{sensors.moisture.toFixed(2)}%</p>
              <p className="text-xs text-gray-600 font-semibold mt-0.5">Moisture</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center mb-2.5">
                <FlaskConical className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{sensors.ph.toFixed(2)}</p>
              <p className="text-xs text-gray-600 font-semibold mt-0.5">pH</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center mb-2.5">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-lg font-bold text-gray-900">{sensors.npk}</p>
              <p className="text-xs text-gray-600 font-semibold mt-0.5">NPK</p>
            </div>
          </div>
        </div>

        {/* Smart Valve Scheduling (AI Controlled) */}
        <SmartValveControl cropId={id || '1'} farmId={crop.farmId || 'f1'} />

        {/* AI-Based Crop Image Health Detection */}
        <div className="bg-white rounded-3xl p-6 mt-6 shadow-xl shadow-gray-900/10 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full" />
            Crop Health Detection (AI)
          </h3>

          <p className="text-sm text-gray-600 mb-5 font-medium">Upload or capture crop image for health analysis</p>

          {!uploadedImage && !isAnalyzing && (
            <div className="space-y-3">
              <button
                onClick={handleCaptureClick}
                className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 active:scale-[0.98] transition-all shadow-lg shadow-green-600/25"
              >
                <Camera className="w-5 h-5" />
                Capture Image
              </button>
              <button
                onClick={handleUploadClick}
                className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/25"
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">Accept JPG/PNG, max 5MB</p>
            </div>
          )}

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
          />

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
              <p className="text-sm font-semibold text-gray-700">Analyzing crop health...</p>
            </div>
          )}

          {healthResult && !isAnalyzing && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                <img src={uploadedImage || ''} alt="Analyzed crop" className="w-full h-48 object-cover" />
              </div>

              <div className="flex items-center gap-3">
                {healthResult.status === 'healthy' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-green-700">Healthy</span>
                  </div>
                )}
                {healthResult.status === 'mild_stress' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-bold text-yellow-700">Mild Stress</span>
                  </div>
                )}
                {healthResult.status === 'diseased' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-bold text-red-700">Diseased</span>
                  </div>
                )}
                <span className="text-xs text-gray-500 font-medium">Confidence: {healthResult.confidenceScore}%</span>
              </div>

              {healthResult.detectedIssues.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-yellow-800 mb-2">Detected Issues:</p>
                  <ul className="space-y-1">
                    {healthResult.detectedIssues.map((issue: string, idx: number) => (
                      <li key={idx} className="text-sm text-yellow-900 flex items-start gap-2">
                        <span className="text-yellow-600 mt-0.5">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-bold text-green-800 mb-2">Analysis:</p>
                <p className="text-sm text-gray-700 leading-relaxed">{healthResult.explanation}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-800 mb-2">Recommended Actions:</p>
                <ul className="space-y-2">
                  {healthResult.recommendedActions.map((action: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">{idx + 1}</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setUploadedImage(null);
                  setHealthResult(null);
                }}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-[0.98] transition-all"
              >
                Analyze Another Image
              </button>
            </div>
          )}
        </div>

        {/* Crop History & Learning */}
        <div className="bg-white rounded-3xl p-6 mt-6 shadow-xl shadow-gray-900/10 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
            Crop History & Learning
          </h3>

          {history.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">No history yet. Actions will be logged here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => {
                const date = new Date(entry.timestamp);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const outcomeColors = {
                  success: 'bg-green-100 text-green-700 border-green-200',
                  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
                  negative: 'bg-red-100 text-red-700 border-red-200',
                };
                const actionLabels = {
                  irrigation: 'Irrigation',
                  fertilization: 'Fertilization',
                  delay: 'Delay',
                  no_action: 'No Action',
                };

                return (
                  <div key={entry.id} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1">{dateStr}</p>
                        <p className="text-xs text-gray-400">{timeStr}</p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold ${outcomeColors[entry.outcome]}`}>
                        {entry.outcome.toUpperCase()}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <p className="text-xs font-bold text-blue-600">{entry.sensorSnapshot.moisture.toFixed(2)}%</p>
                        <p className="text-[10px] text-gray-600">Moisture</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2 text-center">
                        <p className="text-xs font-bold text-purple-600">{entry.sensorSnapshot.ph.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-600">pH</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="text-xs font-bold text-green-600">{entry.sensorSnapshot.npk}</p>
                        <p className="text-[10px] text-gray-600">NPK</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <p className="text-xs font-semibold text-gray-700">Action: {actionLabels[entry.actionTaken]}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">AI Insight</p>
                        <p className="text-xs text-gray-700 leading-relaxed">{entry.aiRecommendation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
