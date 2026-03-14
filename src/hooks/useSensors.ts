import { useEffect, useState } from "react";
import { api } from "../services/api";

export function useSensors(farmId: string) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!farmId) return;
    
    api.get(`/sensor-live/${farmId}`).then(res => {
      setData(res.data);
    }).catch(err => {
      console.error("Failed to fetch sensor data:", err);
    });
  }, [farmId]);

  return data;
}
