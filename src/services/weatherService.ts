import { api } from "./api";

export async function getWeather(lat: number, lon: number) {
  // Using the new secure backend endpoint instead of returning key to frontend
  const res = await api.get("/api/v1/weather", {
    params: { lat, lon }
  });
  return res.data;
}
