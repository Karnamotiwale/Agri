import React from 'react';
import { ExternalLink, Shield, AlertTriangle } from 'lucide-react';

interface InsuranceCardProps {
    name: string;
    coverageType: string;
    risksCovered: string[];
    eligibility: string;
    coverageAmount: string;
    premium: string;
    claimTrigger: string;
    description: string;
    officialLink: string;
    icon: string;
    urgencyLevel?: 'Normal' | 'High' | 'Emergency';
    recommendation?: string;
}

export function InsuranceCard({
    name,
    coverageType,
    risksCovered,
    eligibility,
    coverageAmount,
    premium,
    claimTrigger,
    description,
    officialLink,
    icon,
    urgencyLevel,
    recommendation,
}: InsuranceCardProps) {
    const [expanded, setExpanded] = React.useState(false);

    const urgencyColors = {
        Normal: 'bg-green-100 text-green-700 border-green-200',
        High: 'bg-orange-100 text-orange-700 border-orange-200',
        Emergency: 'bg-red-100 text-red-700 border-red-200',
    };

    const urgencyIcons = {
        Normal: '🟢',
        High: '🟠',
        Emergency: '🔴',
    };

    return (
        <div className={`bg-white rounded-2xl border-2 transition-all ${urgencyLevel === 'Emergency' ? 'border-red-300 shadow-lg shadow-red-100' :
                urgencyLevel === 'High' ? 'border-orange-300 shadow-lg shadow-orange-100' :
                    'border-gray-200 hover:border-green-300'
            }`}>
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{icon}</span>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm leading-tight">{name}</h3>
                            <span className="text-xs text-gray-500 font-medium">{coverageType}</span>
                        </div>
                    </div>
                    {urgencyLevel && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${urgencyColors[urgencyLevel]}`}>
                            {urgencyIcons[urgencyLevel]} {urgencyLevel}
                        </span>
                    )}
                </div>

                {/* AI Recommendation */}
                {recommendation && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-900 font-medium leading-relaxed">{recommendation}</p>
                        </div>
                    </div>
                )}

                {/* Quick Info */}
                <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Coverage:</span>
                        <span className="font-bold text-gray-900">{coverageAmount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Premium:</span>
                        <span className="font-semibold text-green-600">{premium}</span>
                    </div>
                </div>

                {/* Risks Covered */}
                <div className="mb-3">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Risks Covered:</p>
                    <div className="flex flex-wrap gap-1">
                        {risksCovered.slice(0, 4).map((risk, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                {risk}
                            </span>
                        ))}
                        {risksCovered.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                +{risksCovered.length - 4} more
                            </span>
                        )}
                    </div>
                </div>

                {/* Expandable Details */}
                {expanded && (
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                        <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">Description:</p>
                            <p className="text-xs text-gray-700 leading-relaxed">{description}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">Eligibility:</p>
                            <p className="text-xs text-gray-700">{eligibility}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 font-semibold mb-1">Claim Trigger:</p>
                            <p className="text-xs text-gray-700">{claimTrigger}</p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
                    >
                        {expanded ? 'Show Less' : 'Learn More'}
                    </button>
                    <a
                        href={officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                        Apply Now
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
}
