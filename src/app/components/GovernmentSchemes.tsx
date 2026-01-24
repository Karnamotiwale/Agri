import { useState } from 'react';
import { Landmark, Filter, TrendingUp, ShieldCheck, Droplets, Tractor, ArrowRight, CheckCircle, FileText } from 'lucide-react';

export function GovernmentSchemes() {
    const [activeFilter, setActiveFilter] = useState('recommended');
    const [selectedSchemeId, setSelectedSchemeId] = useState<number | null>(null);

    const schemes = [
        {
            id: 1,
            name: 'PM-KISAN Samman Nidhi',
            description: 'Find financial support of ₹6,000/year for landholding farmers.',
            type: 'Subsidy',
            eligibility: 'All landholding farmers',
            status: 'Eligible',
            icon: Landmark,
            color: 'blue'
        },
        {
            id: 2,
            name: 'Pradhan Mantri Fasal Bima',
            description: 'Crop insurance scheme for yield loss due to non-preventable risks.',
            type: 'Insurance',
            eligibility: 'Wheat, Mustard',
            status: 'Check Eligibility',
            icon: ShieldCheck,
            color: 'green'
        }
    ];

    const prices = [
        { crop: 'Wheat', price: '₹2,275', unit: '/quintal', trend: 'up' },
        { crop: 'Mustard', price: '₹5,650', unit: '/quintal', trend: 'stable' },
        { crop: 'Paddy', price: '₹2,183', unit: '/quintal', trend: 'up' },
    ];

    const supports = [
        {
            id: 1,
            title: 'Micro Irrigation Fund',
            benefit: '40-50% Subsidy',
            hint: 'For Drip/Sprinkler systems',
            icon: Droplets,
            bg: 'bg-cyan-50',
            text: 'text-cyan-600'
        },
        {
            id: 2,
            title: 'Agri Mechanization',
            benefit: 'Low Interest Loans',
            hint: 'Tractors & Harvesters',
            icon: Tractor,
            bg: 'bg-orange-50',
            text: 'text-orange-600'
        }
    ];

    return (
        <div className="flex-1 overflow-y-auto pb-32 bg-gradient-to-b from-green-50/20 via-white to-white">
            <div className="px-6 pt-6 pb-2">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Government Schemes</h2>
                    <p className="text-sm text-gray-600 font-medium">Benefits available for your crops & land</p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveFilter('recommended')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeFilter === 'recommended' ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Filter className="w-4 h-4" />
                        Recommended
                    </button>
                    <button
                        onClick={() => setActiveFilter('crop')}
                        className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeFilter === 'crop' ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        By Crop
                    </button>
                    <button
                        onClick={() => setActiveFilter('loan')}
                        className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeFilter === 'loan' ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        Loan Support
                    </button>
                    <button
                        onClick={() => setActiveFilter('subsidies')}
                        className={`px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeFilter === 'subsidies' ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/30' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        Subsidies
                    </button>
                </div>

                {/* Market Prices */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        Market Prices (MSP)
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                        {prices.map((item, idx) => (
                            <div key={idx} className="bg-gradient-to-br from-white to-blue-50/30 border border-blue-100 p-4 rounded-2xl shadow-md shadow-gray-900/5 min-w-[140px] flex-shrink-0 hover:shadow-lg transition-shadow">
                                <p className="text-gray-600 text-xs font-bold uppercase mb-1.5">{item.crop}</p>
                                <p className="text-2xl font-bold text-gray-900 mb-0.5">{item.price}</p>
                                <p className="text-xs text-gray-500 font-medium">{item.unit}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Available Schemes */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                        Available Schemes
                    </h3>
                    <div className="space-y-4">
                        {schemes.map((scheme) => {
                            const Icon = scheme.icon;
                            const colorClasses = scheme.color === 'blue' 
                                ? { bg: 'from-blue-50 to-blue-100', iconBg: 'bg-blue-100', iconText: 'text-blue-600', accent: 'bg-blue-50' }
                                : { bg: 'from-green-50 to-green-100', iconBg: 'bg-green-100', iconText: 'text-green-600', accent: 'bg-green-50' };
                            return (
                                <div key={scheme.id} className={`bg-gradient-to-br ${colorClasses.bg} border border-gray-200/50 p-5 rounded-3xl shadow-lg shadow-gray-900/5 relative overflow-hidden hover:shadow-xl transition-shadow`}>
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${colorClasses.accent} rounded-bl-full opacity-30`} />

                                    <div className="flex items-start justify-between mb-3 relative z-10">
                                        <div className={`w-12 h-12 rounded-xl ${colorClasses.iconBg} flex items-center justify-center shadow-sm`}>
                                            <Icon className={`w-6 h-6 ${colorClasses.iconText}`} />
                                        </div>
                                        {scheme.status === 'Eligible' && (
                                            <span className="px-2.5 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-[10px] font-bold uppercase rounded-lg flex items-center gap-1 border border-green-200 shadow-sm">
                                                <CheckCircle className="w-3 h-3" /> Eligible
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="font-bold text-gray-900 mb-1.5 relative z-10 text-base">{scheme.name}</h4>
                                    <p className="text-sm text-gray-600 mb-4 leading-relaxed relative z-10 font-medium">{scheme.description}</p>

                                    {selectedSchemeId === scheme.id && (
                                        <p className="text-xs text-gray-600 mb-4 relative z-10">
                                            Eligibility: {scheme.eligibility}. {scheme.type === 'Subsidy' ? 'Apply at your block office or through the PM-KISAN portal.' : 'Enroll during the notified enrollment window for your area.'}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between relative z-10">
                                        <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">{scheme.type}</span>
                                        <button
                                            onClick={() => setSelectedSchemeId(selectedSchemeId === scheme.id ? null : scheme.id)}
                                            className="text-green-600 text-xs font-bold flex items-center gap-1 hover:underline"
                                        >
                                            {selectedSchemeId === scheme.id ? 'Hide' : 'View Details'} <ArrowRight className={`w-3 h-3 ${selectedSchemeId === scheme.id ? 'rotate-90' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Investment & Support */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
                        Investment Support
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {supports.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.id} className={`bg-gradient-to-br from-white to-${item.bg.replace('bg-', '')}/20 border border-gray-200/50 p-4 rounded-3xl shadow-md shadow-gray-900/5 flex flex-col gap-3 hover:shadow-lg transition-shadow`}>
                                    <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                                        <Icon className={`w-6 h-6 ${item.text}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                                        <p className="text-green-600 font-bold text-xs mb-1">{item.benefit}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">{item.hint}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
