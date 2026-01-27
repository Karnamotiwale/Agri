import { useState, useEffect } from 'react';
import { Landmark, Filter, TrendingUp, ShieldCheck, Droplets, Tractor, ArrowRight, CheckCircle, FileText, Shield } from 'lucide-react';
import { insuranceService, InsurancePolicy, InsuranceRecommendation } from '../../services/insurance.service';
import { InsuranceCard } from '../../components/insurance/InsuranceCard';
import { CalamityAlert } from '../../components/insurance/CalamityAlert';
import { useApp } from '../../context/AppContext';

export function GovernmentSchemes() {
    const [activeFilter, setActiveFilter] = useState('recommended');
    const [selectedSchemeId, setSelectedSchemeId] = useState<number | null>(null);
    const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>([]);
    const [recommendations, setRecommendations] = useState<InsuranceRecommendation[]>([]);
    const [calamities, setCalamities] = useState<string[]>([]);
    const [showCalamityAlert, setShowCalamityAlert] = useState(true);
    const { getAllCrops } = useApp();

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

    // Crop-specific schemes
    const cropSchemes = [
        {
            id: 1,
            crop: 'Wheat',
            schemes: [
                { name: 'MSP Support', benefit: '₹2,275/quintal', description: 'Minimum Support Price guarantee' },
                { name: 'Wheat Procurement', benefit: 'Direct purchase', description: 'Government procurement at MSP' },
                { name: 'Seed Subsidy', benefit: '50% subsidy', description: 'On certified wheat seeds' }
            ],
            icon: '🌾'
        },
        {
            id: 2,
            crop: 'Rice',
            schemes: [
                { name: 'Paddy MSP', benefit: '₹2,183/quintal', description: 'Minimum Support Price for paddy' },
                { name: 'Direct Benefit Transfer', benefit: 'Cash support', description: 'For paddy farmers' },
                { name: 'Quality Seeds', benefit: '40% subsidy', description: 'High-yielding variety seeds' }
            ],
            icon: '🌾'
        },
        {
            id: 3,
            crop: 'Cotton',
            schemes: [
                { name: 'Cotton MSP', benefit: '₹6,620/quintal', description: 'Support price for cotton' },
                { name: 'Technology Mission', benefit: 'Free training', description: 'Modern cotton farming techniques' },
                { name: 'Pest Management', benefit: '75% subsidy', description: 'Integrated pest management' }
            ],
            icon: '🌱'
        },
        {
            id: 4,
            crop: 'Sugarcane',
            schemes: [
                { name: 'Fair Price', benefit: '₹315/quintal', description: 'Fair and remunerative price' },
                { name: 'Mill Assistance', benefit: 'Soft loans', description: 'For sugar mill payments' },
                { name: 'Drip Irrigation', benefit: '60% subsidy', description: 'Water-saving irrigation' }
            ],
            icon: '🎋'
        }
    ];

    // Loan and credit schemes
    const loanSchemes = [
        {
            id: 1,
            name: 'Kisan Credit Card (KCC)',
            limit: 'Up to ₹3 lakh',
            interest: '4% (with subsidy)',
            features: ['Flexible repayment', 'Crop insurance included', 'No collateral for small loans'],
            icon: '💳',
            color: 'blue'
        },
        {
            id: 2,
            name: 'Agriculture Term Loan',
            limit: 'Up to ₹2 crore',
            interest: '7-9% per annum',
            features: ['For farm equipment', 'Land development', 'Irrigation infrastructure'],
            icon: '🚜',
            color: 'green'
        },
        {
            id: 3,
            name: 'NABARD Refinance Scheme',
            limit: 'Based on project',
            interest: 'Concessional rates',
            features: ['Long-term loans', 'Farm mechanization', 'Warehouse construction'],
            icon: '🏦',
            color: 'purple'
        },
        {
            id: 4,
            name: 'PM-KUSUM (Solar Pump)',
            limit: '90% subsidy',
            interest: 'Subsidy-based',
            features: ['Solar water pumps', 'Grid-connected systems', 'Standalone pumps'],
            icon: '☀️',
            color: 'orange'
        },
        {
            id: 5,
            name: 'Mudra Loan (Agri-business)',
            limit: 'Up to ₹10 lakh',
            interest: '8-12% per annum',
            features: ['For agri-startups', 'Processing units', 'Marketing infrastructure'],
            icon: '💼',
            color: 'indigo'
        }
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

    // Load insurance policies and generate recommendations
    useEffect(() => {
        loadInsuranceData();
    }, []);

    const loadInsuranceData = async () => {
        // Fetch all insurance policies
        const policies = await insuranceService.getAllPolicies();
        setInsurancePolicies(policies);

        // Get crop data for AI recommendations
        const crops = getAllCrops();
        const primaryCrop = crops[0];

        if (primaryCrop) {
            // Simulate risk assessment (in real app, this would come from sensors/AI)
            const riskAssessment = {
                droughtRisk: Math.random() * 100,
                floodRisk: Math.random() * 60,
                pestRisk: Math.random() * 80,
                weatherRisk: Math.random() * 70,
            };

            // Get AI recommendations
            const recs = await insuranceService.getRecommendations(
                primaryCrop.cropType || primaryCrop.name,
                primaryCrop.location,
                riskAssessment
            );
            setRecommendations(recs);

            // Detect calamities (simulated with random sensor data)
            const detectedCalamities = insuranceService.detectCalamity(
                Math.random() * 100, // soil moisture
                Math.random() * 150, // rainfall
                Math.random() * 45   // temperature
            );
            setCalamities(detectedCalamities);
        }
    };

    const getRecommendationForPolicy = (policyId: string) => {
        return recommendations.find(r => r.policy.id === policyId);
    };

    return (
        <div className="flex-1 overflow-y-auto pb-32 bg-gradient-to-b from-green-50/20 via-white to-white">
            <div className="px-6 pt-6 pb-2">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Government Schemes</h2>
                    <p className="text-sm text-gray-600 font-medium">Benefits available for your crops & land</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveFilter('recommended')}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === 'recommended'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        ✨ Recommended
                    </button>
                    <button
                        onClick={() => setActiveFilter('insurance')}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === 'insurance'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        🛡️ Insurance
                    </button>
                    <button
                        onClick={() => setActiveFilter('crop')}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === 'crop'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        🌾 By Crop
                    </button>
                    <button
                        onClick={() => setActiveFilter('loan')}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === 'loan'
                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        💰 Loan Support
                    </button>
                </div>

                {/* Calamity Alert */}
                {activeFilter === 'insurance' && showCalamityAlert && calamities.length > 0 && (
                    <CalamityAlert
                        calamities={calamities}
                        onDismiss={() => setShowCalamityAlert(false)}
                    />
                )}

                {/* Insurance Section */}
                {activeFilter === 'insurance' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Crop & Farmer Insurance</h3>
                                <p className="text-sm text-gray-600">AI-recommended policies based on your crops and risks</p>
                            </div>
                        </div>

                        {/* AI Recommended Insurance */}
                        {recommendations.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-green-600" />
                                    Recommended for You
                                </h4>
                                <div className="grid gap-4">
                                    {recommendations.map((rec) => (
                                        <InsuranceCard
                                            key={rec.policy.id}
                                            {...rec.policy}
                                            urgencyLevel={rec.urgencyLevel}
                                            recommendation={rec.reason}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Insurance Policies */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-3">All Available Policies</h4>
                            <div className="grid gap-4">
                                {insurancePolicies
                                    .filter(policy => !recommendations.find(r => r.policy.id === policy.id))
                                    .map((policy) => (
                                        <InsuranceCard
                                            key={policy.id}
                                            {...policy}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Existing Schemes Content */}
                {activeFilter === 'recommended' && (
                    <>
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
                    </>
                )}

                {/* By Crop Section */}
                {activeFilter === 'crop' && (
                    <div className="space-y-6">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Crop-Specific Schemes</h3>
                            <p className="text-sm text-gray-600">Government benefits tailored for your crops</p>
                        </div>

                        {cropSchemes.map((cropScheme) => (
                            <div key={cropScheme.id} className="bg-white rounded-2xl border-2 border-gray-200 p-5 hover:border-green-300 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">{cropScheme.icon}</span>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{cropScheme.crop}</h4>
                                        <p className="text-xs text-gray-500">{cropScheme.schemes.length} schemes available</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {cropScheme.schemes.map((scheme, idx) => (
                                        <div key={idx} className="bg-gradient-to-r from-green-50 to-transparent p-3 rounded-xl border border-green-100">
                                            <div className="flex items-start justify-between mb-1">
                                                <p className="font-bold text-sm text-gray-900">{scheme.name}</p>
                                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                    {scheme.benefit}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">{scheme.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <button className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors">
                                    View All {cropScheme.crop} Schemes
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loan Support Section */}
                {activeFilter === 'loan' && (
                    <div className="space-y-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Agricultural Loans & Credit</h3>
                            <p className="text-sm text-gray-600">Financial support for farming and agri-business</p>
                        </div>

                        {loanSchemes.map((loan) => {
                            const colorClasses = {
                                blue: { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', icon: 'bg-blue-100', iconText: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
                                green: { bg: 'from-green-50 to-green-100', border: 'border-green-200', icon: 'bg-green-100', iconText: 'text-green-600', badge: 'bg-green-100 text-green-700' },
                                purple: { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', icon: 'bg-purple-100', iconText: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
                                orange: { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', icon: 'bg-orange-100', iconText: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
                                indigo: { bg: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200', icon: 'bg-indigo-100', iconText: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700' }
                            }[loan.color];

                            return (
                                <div key={loan.id} className={`bg-gradient-to-br ${colorClasses.bg} border-2 ${colorClasses.border} rounded-2xl p-5 hover:shadow-lg transition-all`}>
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-xl ${colorClasses.icon} flex items-center justify-center text-2xl`}>
                                            {loan.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-1">{loan.name}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${colorClasses.badge}`}>
                                                    {loan.limit}
                                                </span>
                                                <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-full">
                                                    {loan.interest}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {loan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <p className="text-xs text-gray-700">{feature}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 transition-colors">
                                            Learn More
                                        </button>
                                        <button className="flex-1 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-colors">
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Additional Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 mt-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Need Help with Loan Application?</h4>
                                    <p className="text-sm text-gray-700 mb-3">Our AI assistant can guide you through the application process and help you choose the right loan.</p>
                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors">
                                        Get AI Assistance
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
