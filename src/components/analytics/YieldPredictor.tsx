import { Zap, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export function YieldPredictor() {
    const prediction = {
        current: 4.2, // Tons/Ha
        potential: 5.5,
        confidence: 89,
        factors: [
            { name: 'Soil Moisture', status: 'Optimal', impact: '+0.4', color: 'text-green-600', bg: 'bg-green-100' },
            { name: 'Pest Risk', status: 'Low Risk', impact: '+0.2', color: 'text-green-600', bg: 'bg-green-100' },
            { name: 'N-Deficiency', status: 'Attention', impact: '-0.5', color: 'text-amber-600', bg: 'bg-amber-100' },
        ]
    };

    const percentage = (prediction.current / prediction.potential) * 100;

    return (
        <div className="bg-gradient-to-br from-emerald-900 to-green-900 rounded-3xl p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden h-full flex flex-col">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        AI Yield Prediction
                    </h3>
                    <p className="text-emerald-200/80 text-sm mt-1">Based on live sensor data</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-xs font-semibold text-emerald-100">Confidence: {prediction.confidence}%</span>
                </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center items-center mb-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Circular Progress Placeholder - CSS Conic Gradient */}
                    <div className="absolute inset-0 rounded-full"
                        style={{
                            background: `conic-gradient(#34d399 ${percentage}%, #064e3b ${percentage}%)`,
                            maskImage: 'radial-gradient(transparent 60%, black 61%)',
                            WebkitMaskImage: 'radial-gradient(transparent 60%, black 61%)'
                        }}>
                    </div>
                    <div className="text-center">
                        <span className="text-4xl font-bold block">{prediction.current}</span>
                        <span className="text-xs font-medium text-emerald-200 uppercase tracking-widest">Tons / Ha</span>
                    </div>
                </div>
                <p className="text-sm text-emerald-200/70 mt-2">Potential: <span className="text-white font-bold">{prediction.potential} Tons/Ha</span></p>
            </div>

            <div className="relative z-10 space-y-3">
                <p className="text-xs font-bold uppercase text-emerald-200/50 mb-2">Key Influencing Factors</p>
                {prediction.factors.map((factor, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                            {factor.status === 'Attention' ?
                                <AlertCircle className="w-4 h-4 text-amber-400" /> :
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            }
                            <div>
                                <p className="text-sm font-semibold text-white">{factor.name}</p>
                                <p className={`text-[10px] ${factor.status === 'Attention' ? 'text-amber-200' : 'text-emerald-200'}`}>{factor.status}</p>
                            </div>
                        </div>
                        <span className={`text-sm font-bold ${factor.impact.startsWith('-') ? 'text-amber-400' : 'text-emerald-400'}`}>
                            {factor.impact}
                        </span>
                    </div>
                ))}
            </div>

            <button className="mt-6 w-full py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4" />
                View Full Report
            </button>
        </div>
    );
}
