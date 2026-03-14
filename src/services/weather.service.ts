// ============================================
// WEATHER SERVICE — Real API integration (Open-Meteo)
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
    getCurrentWeather: async (lat: number = 12.97, lon: number = 77.59): Promise<any> => {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration&timezone=auto`
            );
            const data = await response.json();
            
            // Map Open-Meteo to a more friendly structure for the UI
            return {
                location: { name: 'Current Location', localtime: new Date().toISOString() },
                current: {
                    temp_c: data.current.temperature_2m,
                    condition: { text: getWeatherCodeText(data.current.weather_code), code: data.current.weather_code },
                    humidity: data.current.relative_humidity_2m,
                    wind_kph: data.current.wind_speed_10m,
                    wind_dir: getWindDirection(data.current.wind_direction_10m),
                    precipitation: data.current.precipitation,
                    is_day: data.current.is_day
                },
                hourly: data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
                    time: new Date(time).getHours() + ':00',
                    temp_c: data.hourly.temperature_2m[i],
                    code: data.hourly.weather_code[i]
                })),
                daily: data.daily.time.slice(0, 7).map((date: string, i: number) => ({
                    date: date,
                    day: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
                    max_temp: data.daily.temperature_2m_max[i],
                    min_temp: data.daily.temperature_2m_min[i],
                    code: data.daily.weather_code[i],
                    sunrise: data.daily.sunrise[i].split('T')[1],
                    sunset: data.daily.sunset[i].split('T')[1],
                    daylight: formatDaylight(data.daily.daylight_duration[i])
                }))
            };
        } catch (error) {
            console.error('Weather fetch error:', error);
            return getMockWeather();
        }
    },

    getWeatherByCity: async (city: string): Promise<any> => {
        // Fallback or Geocoding could go here, for now just returning default
        return weatherService.getCurrentWeather();
    },

    getUserLocation: (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) reject(new Error('Geolocation not supported'));
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
};

// Helpers
function getWeatherCodeText(code: number): string {
    const codes: Record<number, string> = {
        0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Depositing Rime Fog',
        51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
        61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
        71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
        80: 'Slight Rain Showers', 81: 'Moderate Rain Showers', 82: 'Violent Rain Showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Thunderstorm with Heavy Hail'
    };
    return codes[code] || 'Clear';
}

function getWindDirection(degree: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degree / 45) % 8];
}

function formatDaylight(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}
