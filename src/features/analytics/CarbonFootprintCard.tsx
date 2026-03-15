import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Leaf, Zap, Flame, Sprout, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react';
import { getCarbonFootprint, type CarbonFootprintData } from '../../services/carbonService';

interface Props {
  farmId?: string;
}

const EMISSION_COLORS = {
  electricity: '#F59E0B',
  fertilizer: '#EF4444',
  fuel: '#6366F1',
  residue: '#10B981',
};

const PIE_COLORS = ['#F59E0B', '#EF4444', '#6366F1', '#10B981'];

export default function CarbonFootprintCard({ farmId }: Props) {
  const [data, setData] = useState<CarbonFootprintData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCarbonFootprint(farmId).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [farmId]);

  if (loading) {
    return (
      <div className="mt-6 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Carbon Footprint</h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const pieData = [
    { name: 'Electricity', value: data.electricity_emission },
    { name: 'Fertilizer', value: data.fertilizer_emission },
    { name: 'Fuel', value: data.fuel_emission },
    { name: 'Residue', value: data.residue_emission },
  ].filter(d => d.value > 0);

  const emissionSources = [
    {
      label: 'Electricity',
      value: data.electricity_emission,
      pct: data.emission_breakdown.electricity_pct,
      icon: Zap,
      color: EMISSION_COLORS.electricity,
      bg: 'bg-amber-50',
    },
    {
      label: 'Fertilizer',
      value: data.fertilizer_emission,
      pct: data.emission_breakdown.fertilizer_pct,
      icon: Sprout,
      color: EMISSION_COLORS.fertilizer,
      bg: 'bg-red-50',
    },
    {
      label: 'Fuel',
      value: data.fuel_emission,
      pct: data.emission_breakdown.fuel_pct,
      icon: Flame,
      color: EMISSION_COLORS.fuel,
      bg: 'bg-indigo-50',
    },
    {
      label: 'Residue',
      value: data.residue_emission,
      pct: data.emission_breakdown.residue_pct,
      icon: Leaf,
      color: EMISSION_COLORS.residue,
      bg: 'bg-green-50',
    },
  ];

  // Determine footprint severity
  const severity =
    data.carbon_per_hectare > 200 ? 'high' :
    data.carbon_per_hectare > 100 ? 'medium' : 'low';

  const severityConfig = {
    high: { label: 'High Emissions', labelColor: 'text-red-600', badgeBg: 'bg-red-50 border-red-100', dot: 'bg-red-500' },
    medium: { label: 'Moderate Emissions', labelColor: 'text-amber-600', badgeBg: 'bg-amber-50 border-amber-100', dot: 'bg-amber-500' },
    low: { label: 'Low Emissions', labelColor: 'text-green-600', badgeBg: 'bg-green-50 border-green-100', dot: 'bg-green-500' },
  };
  const sc = severityConfig[severity];

  return (
    <div className="mt-6 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Carbon Footprint</h2>
            <p className="text-sm text-gray-400 font-medium">Farm emission analytics</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border ${sc.badgeBg} ${sc.labelColor}`}>
          <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
          {sc.label}
        </span>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl p-5 text-white">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Emission</p>
          <p className="text-3xl font-black">{data.total_carbon.toLocaleString()}</p>
          <p className="text-xs font-bold text-gray-300 mt-1">kg CO₂e</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl p-5 text-white">
          <p className="text-xs font-bold text-green-100 uppercase tracking-wider mb-2">Per Hectare</p>
          <p className="text-3xl font-black">{data.carbon_per_hectare.toLocaleString()}</p>
          <p className="text-xs font-bold text-green-100 mt-1">kg CO₂e / ha</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="mb-8">
        <p className="text-sm font-black text-gray-900 mb-4">Emission Breakdown</p>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} kg CO₂e`, '']}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '12px', fontWeight: 700 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Emission Source Bars */}
      <div className="space-y-3 mb-8">
        {emissionSources.map(({ label, value, pct, icon: Icon, color, bg }) => (
          <div key={label} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-bold text-gray-700">{label}</span>
                <span className="text-xs font-black text-gray-900">{value} kg CO₂e</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                />
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">{pct.toFixed(1)}% of total</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sustainability Suggestions */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-5 h-5 text-green-600" />
          <p className="text-sm font-black text-gray-900">Sustainability Suggestions</p>
        </div>
        <div className="space-y-3">
          {data.suggestions.map((suggestion, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-2xl border border-green-100">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 font-medium leading-snug">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
