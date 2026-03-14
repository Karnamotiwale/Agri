import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  ChevronDown, 
  Share2, 
  BarChart2, 
  Table as TableIcon, 
  RefreshCw,
  Info,
  ArrowUpDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { cropService } from '../../services/crop.service';
import { BottomNav } from '../../components/layout/BottomNav';

type DataType = 'weather' | 'soil' | 'npk';
type ViewMode = 'chart' | 'table';
type TimeRange = '1D' | '1W' | '1M';

export default function DataAnalysisPage() {
  const navigate = useNavigate();
  const [dataType, setDataType] = useState<DataType>('weather');
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [timeRange, setTimeRange] = useState<TimeRange>('1W');

  // Generate mock data based on selected type and range
  const rawData = useMemo(() => {
    const days = timeRange === '1D' ? 1 : timeRange === '1W' ? 7 : 30;
    return cropService.generateMockJourneyData(days);
  }, [timeRange]);

  const formattedData = useMemo(() => {
    return rawData.map(d => ({
      ...d,
      time: new Date(d.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) + ' ' + 
            new Date(d.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      shortTime: new Date(d.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
      N: d.nitrogen,
      P: d.phosphorus,
      K: d.potassium,
      temp: d.temperature,
      precip: d.rainfall,
      moisture: d.soil_moisture
    }));
  }, [rawData]);

  const dateRangeRange = useMemo(() => {
    if (formattedData.length === 0) return '';
    const start = formattedData[0].time.split(' ')[0];
    const end = formattedData[formattedData.length - 1].time.split(' ')[0];
    return `${start} - ${end}`;
  }, [formattedData]);

  const categories = [
    { id: 'weather', label: 'Historical Weather Data' },
    { id: 'soil', label: 'Soil Moisture Data' },
    { id: 'npk', label: 'NPK Data' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('/services')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Analysis</h1>
      </div>

      {/* Location Selector */}
      <div className="px-6 mb-8">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <MapPin className="w-4 h-4 text-gray-900" />
          <span className="text-sm font-bold text-gray-900">hehehe, hahaha</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      <div className="px-4">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Analysis</h2>
          <p className="text-sm text-gray-400 font-medium mb-6">Showing selected data</p>

          {/* Controls Area */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select 
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value as DataType)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <div className="flex items-center gap-2">
                <button className="p-3.5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex bg-gray-50 border border-gray-100 p-1.5 rounded-2xl">
                  <button 
                    onClick={() => setViewMode('chart')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'chart' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
                  >
                    <BarChart2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
                  >
                    <TableIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-b border-gray-50">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-gray-50 rounded-lg">
                    <BarChart2 className="w-4 h-4 text-gray-400" />
                 </div>
                 <span className="text-sm font-bold text-gray-900 underline underline-offset-4 decoration-gray-200">No device selected</span>
              </div>
              <button className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <RefreshCw className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-8">{dateRangeRange}</p>

            {viewMode === 'chart' ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="shortTime" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                      tickFormatter={(val) => `${val.toFixed(2)}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    />
                    <Legend 
                       verticalAlign="bottom" 
                       height={36} 
                       iconType="circle"
                       wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    {dataType === 'weather' && (
                      <>
                        <Line type="monotone" dataKey="temp" name="Temperature" stroke="#F97316" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="precip" name="Precipitation" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                      </>
                    )}
                    {dataType === 'soil' && (
                       <Line type="monotone" dataKey="moisture" name="Soil Moisture" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    )}
                    {dataType === 'npk' && (
                      <>
                        <Line type="monotone" dataKey="N" stroke="#EF4444" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="P" stroke="#3B82F6" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="K" stroke="#F59E0B" strokeWidth={3} dot={false} />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">Time <ArrowUpDown className="w-3 h-3" /></div>
                      </th>
                      {dataType === 'weather' && (
                        <>
                          <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Temp (°C)</th>
                          <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Precip (mm)</th>
                        </>
                      )}
                      {dataType === 'soil' && (
                        <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">Moisture (%)</th>
                      )}
                      {dataType === 'npk' && (
                        <>
                          <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">N</th>
                          <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">P</th>
                          <th className="px-4 py-4 text-xs font-black text-gray-500 uppercase tracking-wider text-right">K</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {formattedData.slice().reverse().map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4 text-sm font-bold text-gray-900">{row.time}</td>
                        {dataType === 'weather' && (
                          <>
                            <td className="px-4 py-4 text-sm font-bold text-gray-600 text-right">{row.temp.toFixed(2)}</td>
                            <td className="px-4 py-4 text-sm font-bold text-gray-600 text-right">{row.precip.toFixed(2)}</td>
                          </>
                        )}
                        {dataType === 'soil' && (
                          <td className="px-4 py-4 text-sm font-bold text-gray-600 text-right">{row.moisture.toFixed(2)}</td>
                        )}
                        {dataType === 'npk' && (
                          <>
                            <td className="px-4 py-4 text-sm font-bold text-red-500 text-right">{row.N.toFixed(1)}</td>
                            <td className="px-4 py-4 text-sm font-bold text-blue-500 text-right">{row.P.toFixed(1)}</td>
                            <td className="px-4 py-4 text-sm font-bold text-amber-500 text-right">{row.K.toFixed(1)}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Time Range Selector */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex bg-gray-50 p-2 rounded-[2rem] gap-4">
              {['1D', '1W', '1M'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as TimeRange)}
                  className={`px-8 py-3 rounded-[1.5rem] text-sm font-black transition-all ${
                    timeRange === range 
                      ? 'bg-black text-white shadow-lg' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {range === '1D' ? '1 Day' : range === '1W' ? '1 Week' : '1 Month'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
