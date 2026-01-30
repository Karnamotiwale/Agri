import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, Crop } from '../../context/AppContext';
import { cropService } from '../../services/crop.service';
import { Header } from '../components/Header';
import { Loader2 } from 'lucide-react';

// Upgraded AI Components
import { FieldPhotoHeader } from '../../components/crop/FieldPhotoHeader';
import { FieldMetaSummary } from '../../components/crop/FieldMetaSummary';
import { GrowthStageTimeline } from '../../components/crop/GrowthStageTimeline';
import { LiveFieldStatus } from '../../components/crop/LiveFieldStatus';
import { HealthDetectionHub } from '../../components/crop/HealthDetectionHub';
import { CropHistoryLearning } from '../../components/crop/CropHistoryLearning';

export function CropDetails() {
  const navigate = useNavigate();
  const { id: cropId } = useParams();
  const { crops } = useApp();
  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const findCrop = useCallback(() => {
    const found = crops.find(c => c.id === cropId);
    if (found) setCrop(found);
  }, [crops, cropId]);

  useEffect(() => {
    findCrop();
    setLoading(false);
  }, [findCrop]);

  // AUTO-REFRESH RULE: Refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Background Refresh: Syncing crop intelligence...");
      setRefreshKey(prev => prev + 1); // Triggers re-render of child components that fetch data
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!cropId || (!crop && !loading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Header title="Back" showBack onBackClick={() => navigate('/dashboard')} />
        <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-4" />
        <p className="text-gray-500">Retrieving crop data...</p>
      </div>
    );
  }

  if (loading || !crop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* STICKY HEADER */}
      <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
        <Header title={crop.name} showBack onBackClick={() => navigate('/dashboard')} />
      </div>

      <div className="space-y-10">
        {/* 1. FIELD PHOTO HEADER */}
        <FieldPhotoHeader
          cropId={cropId}
          imageUrl={crop.image}
          onImageUpdate={(url) => setCrop(prev => prev ? { ...prev, image: url } : null)}
        />

        {/* 2. FIELD META SUMMARY */}
        <FieldMetaSummary crop={crop} />

        <hr className="border-gray-50 mx-6" />

        {/* 3. LIVE CROP GROWTH STAGES */}
        <GrowthStageTimeline key={`stages-${refreshKey}`} cropId={cropId} />

        {/* 4. LIVE FIELD STATUS */}
        <LiveFieldStatus key={`status-${refreshKey}`} cropId={cropId} />

        <div className="h-4 bg-gray-50" />

        {/* 5, 6. CROP HEALTH DETECTION & RECOMMENDED SOLUTIONS */}
        <HealthDetectionHub cropId={cropId} />

        <div className="h-4 bg-gray-50" />

        {/* 7. CROP HISTORY & AI LEARNING */}
        <CropHistoryLearning key={`history-${refreshKey}`} cropId={cropId} />

        {/* FOOTER UX4G */}
        <div className="py-10 text-center space-y-2">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">
            AI Intelligence Hub
          </p>
          <p className="text-[9px] text-gray-300 font-bold uppercase">
            Sync Interval: 10m • Connected to RL Engine
          </p>
        </div>
      </div>
    </div>
  );
}
