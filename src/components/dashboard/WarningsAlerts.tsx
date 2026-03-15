import { CloudSun, AlertCircle } from 'lucide-react';

export function WarningsAlerts() {
  return (
    <div
      className="rounded-[2rem] p-6 mb-6"
      style={{
        background: '#FFFDF0',
        border: '1.5px solid',
        borderColor: '#F6C94540',
        boxShadow: '0 4px 20px rgba(246,201,69,0.1)',
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black" style={{ color: '#1B3A1B' }}>Warnings and Alerts</h2>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: '#FFF3CD', color: '#8B6500' }}
        >
          <AlertCircle className="w-3 h-3" />
          Weather
        </div>
      </div>

      <p className="text-xs font-semibold mb-8" style={{ color: '#7E9E80' }}>
        Source: OpenWeather API
      </p>

      <div className="flex flex-col items-center justify-center py-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'linear-gradient(135deg, #FFE27A, #C7E76C)' }}
        >
          <CloudSun className="w-8 h-8" style={{ color: '#2E7D32' }} />
        </div>
        <h3 className="text-lg font-black mb-1" style={{ color: '#1B3A1B' }}>Weather is clear</h3>
        <p className="text-sm text-center max-w-[260px] leading-relaxed" style={{ color: '#4F6F52' }}>
          No severe weather warnings for your plantations at the moment.
        </p>
      </div>
    </div>
  );
}
