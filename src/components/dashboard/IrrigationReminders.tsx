import { Droplets } from 'lucide-react';

export function IrrigationReminders() {
  const reminders = [
    {
      currentDate: '16 Mar, 2026',
      currentAmount: '59.25',
      nextDate: '20 Mar, 2026',
      nextAmount: '23.11',
    }
  ];

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-6">
      <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
        <Droplets className="w-6 h-6 text-white" />
      </div>

      {reminders.map((reminder, idx) => (
        <div key={idx} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Current Date</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {reminder.currentDate}
              </h3>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Amount</p>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                {reminder.currentAmount} <span className="text-gray-400 font-medium">mm</span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 opacity-40">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Next Date</p>
              <h3 className="text-xl font-bold text-gray-900">
                {reminder.nextDate}
              </h3>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-2">Amount</p>
              <h3 className="text-xl font-bold text-gray-900">
                {reminder.nextAmount} <span className="text-gray-400 font-medium">mm</span>
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
