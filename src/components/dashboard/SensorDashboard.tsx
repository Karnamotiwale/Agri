import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SensorDashboard(){
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData(){
    const { data } = await supabase
      .from("sensor_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      setData(data[0])
    }
  }

  if (!data) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm m-6 border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-green-800">Farm Sensor Dashboard</h2>
      
      <div className="space-y-2">
        <p className="font-medium">Soil Moisture: <span className="text-gray-600">{data.soil_moisture}%</span></p>
        <p className="font-medium">Nitrogen: <span className="text-gray-600">{data.nitrogen}</span></p>
        <p className="font-medium">Phosphorus: <span className="text-gray-600">{data.phosphorus}</span></p>
        <p className="font-medium">Potassium: <span className="text-gray-600">{data.potassium}</span></p>
      </div>
    </div>
  )
}
