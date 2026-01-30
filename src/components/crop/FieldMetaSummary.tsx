import React from 'react';
import { Crop } from '../../context/AppContext';
import { MapPin, Maximize, Sprout } from 'lucide-react';

interface Props {
    crop: Crop;
}

export function FieldMetaSummary({ crop }: Props) {
    return (
        <div className="grid grid-cols-3 gap-3 px-6 -mt-6 relative z-10">
            <SummaryCard
                label="Crop"
                value={crop.name}
                sub={crop.cropType || 'Common'}
                icon={<Sprout className="w-4 h-4 text-green-600" />}
            />
            <SummaryCard
                label="Area"
                value={crop.landArea}
                sub="Total Field"
                icon={<Maximize className="w-4 h-4 text-blue-600" />}
            />
            <SummaryCard
                label="Location"
                value="Block A4"
                sub={crop.location}
                icon={<MapPin className="w-4 h-4 text-red-600" />}
            />
        </div>
    );
}

function SummaryCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-black/5 border border-gray-100 flex flex-col items-center text-center">
            <div className="p-2 bg-gray-50 rounded-lg mb-2">
                {icon}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</p>
            <p className="text-sm font-black text-gray-900 leading-tight truncate w-full px-1">{value}</p>
            <p className="text-[9px] text-gray-400 font-medium italic mt-0.5">{sub}</p>
        </div>
    );
}
