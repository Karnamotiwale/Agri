// ============================================
// WEATHER SERVICE — Mock only, no backend
// ============================================
import { getMockWeather } from '../mock/mockWeather';

// WeatherData type (single authoritative definition)
export interface WeatherData {
    location: { name: string; region: string; country: string; lat: number; lon: number; localtime: string };
    current: {
        temp_c: number; temp_f: number;
        condition: { text: string; icon: string; code: number };
        wind_kph: number; wind_dir: string; pressure_mb: number; humidity: number;
        cloud: number; feelslike_c: number; vis_km: number; uv: number; gust_kph: number;
    };
    forecast?: {
        forecastday: Array<{
            date: string;
            day: { maxtemp_c: number; mintemp_c: number; condition: { text: string; icon: string } };
        }>;
    };
}

export const weatherService = {
    getCurrentWeather: async (_lat: number, _lon: number): Promise<WeatherData> => getMockWeather() as WeatherData,
    getWeatherForecast: async (_lat: number, _lon: number): Promise<WeatherData> => getMockWeather() as WeatherData,
    getWeatherByCity: async (_city: string): Promise<WeatherData> => getMockWeather() as WeatherData,
    getUserLocation: (): Promise<GeolocationPosition> => Promise.reject(new Error('Mock mode — geolocation disabled')),
    getLocalWeather: async (): Promise<WeatherData> => getMockWeather() as WeatherData,
};
