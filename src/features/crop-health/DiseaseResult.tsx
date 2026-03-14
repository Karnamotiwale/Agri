import React from "react";
import { AlertTriangle, Info, Sprout, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface DiseaseResultProps {
  result: {
    analysis?: {
      disease: string;
      confidence: number | string;
      symptoms?: string | string[];
      treatment?: string | string[];
      prevention?: string | string[];
      remedy?: string;
    };
    error?: string;
  };
}

export default function DiseaseResult({ result }: DiseaseResultProps) {
  if (!result) return null;

  if (result.error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-black text-red-900">Analysis Failed</h4>
          <p className="text-xs font-bold text-red-700 mt-1">{result.error}</p>
        </div>
      </motion.div>
    );
  }

  const data = result.analysis;
  if (!data) return null;

  // Handle potential nested or direct structures from the AI
  const diseaseName = data.disease || "Unknown Condition";
  const confidenceStr = data.confidence ? `${(Number(data.confidence) * 100).toFixed(1)}%` : "N/A";
  const treatmentObj = data.treatment || data.remedy || "No specific treatment advised.";
  
  // Format arrays to strings if the AI returns them as arrays
  const treatment = Array.isArray(treatmentObj) ? treatmentObj.join(", ") : treatmentObj;
  const symptoms = Array.isArray(data.symptoms) ? data.symptoms.join(", ") : data.symptoms;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mt-6 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xl shadow-gray-200/40"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-100">Diagnosis Details</h3>
            <h2 className="text-lg font-black">{diseaseName}</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-blue-200">Confidence</p>
          <p className="text-lg font-black">{confidenceStr}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4 bg-gray-50/50">
        
        {/* Symptoms (if any) */}
        {symptoms && (
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              Identified Symptoms
            </h4>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">{symptoms}</p>
          </div>
        )}

        {/* Treatment / Remedy */}
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm">
          <h4 className="text-[11px] font-black text-green-900 uppercase tracking-widest flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            Recommended Treatment
          </h4>
          <p className="text-xs font-bold text-green-800 leading-relaxed">{treatment}</p>
        </div>
        
        {/* Prevention (if any) */}
        {data.prevention && (
          <div className="px-1 pt-2">
            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Prevention Focus</h4>
            <p className="text-[11px] font-bold text-gray-400 leading-relaxed">
              {Array.isArray(data.prevention) ? data.prevention.join(", ") : data.prevention}
            </p>
          </div>
        )}

      </div>
    </motion.div>
  );
}
