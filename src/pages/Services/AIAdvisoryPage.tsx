import React from 'react';
import { ArrowLeft, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AIChat } from '../../features/ai-advisory/AIChat';

export default function AIAdvisoryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI Advisory</h1>
              <p className="text-xs text-emerald-600 font-medium tracking-wide uppercase">Farm Assistant Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 p-4 max-w-3xl w-full mx-auto" style={{ height: 'calc(100vh - 100px)' }}>
          <AIChat />
      </div>
    </div>
  );
}
