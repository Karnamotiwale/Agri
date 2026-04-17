import React, { useState } from 'react';
import { Leaf, Droplets, CloudLightning, TreePine, Map, Calculator } from 'lucide-react';

export interface AgronomicData {
    fieldSize: number;
    soilType: string;
    cropType: string;
    season: string;
    sowingDate: string;
    moisture: number;
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    temperature: number;
    rainfall: number;
    humidity: number;
    irrigationType: string;
    irrigationFrequency: string;
    previousCrop: string;
}

interface Props {
    initialData?: Partial<AgronomicData>;
    onSubmit: (data: AgronomicData) => void;
    onCancel?: () => void;
}

export const AgronomicForm: React.FC<Props> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<AgronomicData>({
        fieldSize: initialData?.fieldSize || 1,
        soilType: initialData?.soilType || 'loam',
        cropType: initialData?.cropType || 'Rice',
        season: initialData?.season || 'Kharif',
        sowingDate: initialData?.sowingDate || new Date().toISOString().split('T')[0],
        moisture: initialData?.moisture || 40,
        ph: initialData?.ph || 6.5,
        nitrogen: initialData?.nitrogen || 80,
        phosphorus: initialData?.phosphorus || 40,
        potassium: initialData?.potassium || 60,
        temperature: initialData?.temperature || 28,
        rainfall: initialData?.rainfall || 5,
        humidity: initialData?.humidity || 65,
        irrigationType: initialData?.irrigationType || 'drip',
        irrigationFrequency: initialData?.irrigationFrequency || 'daily',
        previousCrop: initialData?.previousCrop || 'Wheat',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: isNaN(Number(value)) || name === 'soilType' || name === 'cropType' || name === 'season' || name === 'sowingDate' || name === 'irrigationType' || name === 'irrigationFrequency' || name === 'previousCrop' 
                ? value 
                : Number(value)
        }));
    };

    const InputBlock = ({ label, name, type = 'text', suffix = '' }: any) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={(formData as any)[name]}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all shadow-inner"
                />
                {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{suffix}</span>}
            </div>
        </div>
    );

    const SelectBlock = ({ label, name, options }: any) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider">{label}</label>
            <select
                name={name}
                value={(formData as any)[name]}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all appearance-none cursor-pointer"
            >
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 relative overflow-hidden mt-6 border border-gray-100">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-indigo-50/80 via-white to-transparent rounded-full blur-3xl -mr-64 -mt-64 pointer-events-none z-0"></div>
            
            <div className="relative z-10 flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1 flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        Yield Calculation Inputs
                    </h2>
                    <p className="text-xs font-bold text-gray-500 ml-14">We need a few details to run the agronomic simulation.</p>
                </div>
            </div>

            <div className="relative z-10 space-y-8">
                {/* Section 1: Farm & Crop */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <h3 className="text-sm font-black text-gray-800 mb-4 flex items-center gap-2">
                        <Map className="w-4 h-4 text-emerald-500" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <InputBlock label="Field Size" name="fieldSize" type="number" suffix="Hectares" />
                        <SelectBlock label="Soil Type" name="soilType" options={['loam', 'clay', 'sandy', 'silt']} />
                        <InputBlock label="Previous Crop" name="previousCrop" />
                        
                        <SelectBlock label="Target Crop" name="cropType" options={['Rice', 'Wheat', 'Maize', 'Soybean', 'Cotton']} />
                        <SelectBlock label="Season" name="season" options={['Kharif', 'Rabi', 'Zaid']} />
                        <InputBlock label="Sowing Date" name="sowingDate" type="date" />
                    </div>
                </div>

                {/* Section 2: Soil Health (Auto-filled by sensors if available) */}
                <div className="bg-gradient-to-br from-purple-50/50 to-white p-6 rounded-3xl border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-black text-purple-900 flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-purple-500" /> Soil Nutrition
                        </h3>
                        <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded border border-purple-200 font-bold uppercase tracking-wider">
                            Sensor Proxied
                        </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <InputBlock label="Nitrogen (N)" name="nitrogen" type="number" suffix="mg/kg" />
                        <InputBlock label="Phosphorus (P)" name="phosphorus" type="number" suffix="mg/kg" />
                        <InputBlock label="Potassium (K)" name="potassium" type="number" suffix="mg/kg" />
                        <InputBlock label="pH Level" name="ph" type="number" />
                    </div>
                </div>

                {/* Section 3: Weather & Irrigation */}
                <div className="bg-gradient-to-br from-blue-50/50 to-white p-6 rounded-3xl border border-blue-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                    <h3 className="text-sm font-black text-blue-900 mb-4 flex items-center gap-2">
                        <CloudLightning className="w-4 h-4 text-blue-500" /> Environment & Water
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <InputBlock label="Avg Temp" name="temperature" type="number" suffix="°C" />
                        <InputBlock label="Rainfall/Wk" name="rainfall" type="number" suffix="mm" />
                        <SelectBlock label="Irrigation" name="irrigationType" options={['drip', 'sprinkler', 'flood']} />
                        <InputBlock label="Soil Moisture" name="moisture" type="number" suffix="%" />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button 
                        onClick={() => onSubmit(formData)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                    >
                        Run Simulation & Prediction
                    </button>
                    {onCancel && (
                        <button 
                            onClick={onCancel}
                            className="px-8 py-4 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl font-black transition-all"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
