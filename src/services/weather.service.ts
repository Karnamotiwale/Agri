const WEATHER_API_KEY = 'ae9ee7409f26ae6158feab3cd24d607a';
const WEATHER_API_BASE = 'https://api.weatherapi.com/v1';

export interface WeatherData {
    location: {
        name: string;
        region: string;
        country: string;
        lat: number;
        lon: number;
        localtime: string;
    };
    current: {
        temp_c: number;
        temp_f: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        wind_kph: number;
        wind_dir: string;
        pressure_mb: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        vis_km: number;
        uv: number;
        gust_kph: number;
    };
    forecast?: {
        forecastday: Array<{
            date: string;
            day: {
                maxtemp_c: number;
                mintemp_c: number;
                condition: {
                    text: string;
                    icon: string;
                };
            };
        }>;
    };
}

export const weatherService = {
    /**
     * Get current weather by coordinates
     */
    getCurrentWeather: async (lat: number, lon: number): Promise<WeatherData> => {
        try {
            const response = await fetch(
                `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&aqi=yes`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            return await response.json();
        } catch (error) {
            console.error('Weather API Error:', error);
            throw error;
        }
    },

    /**
     * Get weather forecast (3-day)
     */
    getWeatherForecast: async (lat: number, lon: number): Promise<WeatherData> => {
        try {
            const response = await fetch(
                `${WEATHER_API_BASE}/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=3&aqi=yes`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch forecast data');
            }

            return await response.json();
        } catch (error) {
            console.error('Weather Forecast Error:', error);
            throw error;
        }
    },

    /**
     * Get weather by city name
     */
    getWeatherByCity: async (city: string): Promise<WeatherData> => {
        try {
            const response = await fetch(
                `${WEATHER_API_BASE}/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=yes`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }

            return await response.json();
        } catch (error) {
            console.error('Weather API Error:', error);
            throw error;
        }
    },

    /**
     * Get user's location using browser geolocation
     */
    getUserLocation: (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                maximumAge: 300000, // 5 minutes cache
            });
        });
    },

    /**
     * Get weather for user's current location
     */
    getLocalWeather: async (): Promise<WeatherData> => {
        try {
            const position = await weatherService.getUserLocation();
            const { latitude, longitude } = position.coords;
            return await weatherService.getCurrentWeather(latitude, longitude);
        } catch (error) {
            // Fallback to default location if geolocation fails
            console.warn('Geolocation failed, using default location');
            return await weatherService.getWeatherByCity('bangalore');
        }
    }
};
