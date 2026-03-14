// ============================================
// MOCK WEATHER DATA — No backend required
// ============================================

export function getMockWeather() {
    return {
        location: {
            name: 'Bengaluru',
            region: 'Karnataka',
            country: 'India',
            lat: 12.97,
            lon: 77.59,
            localtime: new Date().toLocaleString('en-IN'),
        },
        current: {
            temp_c: 29,
            temp_f: 84.2,
            condition: {
                text: 'Partly Cloudy',
                icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
                code: 1003,
            },
            wind_kph: 14,
            wind_dir: 'SE',
            pressure_mb: 1013,
            humidity: 63,
            cloud: 40,
            feelslike_c: 31,
            vis_km: 10,
            uv: 6,
            gust_kph: 18,
        },
        forecast: {
            forecastday: [
                {
                    date: new Date().toISOString().split('T')[0],
                    day: { maxtemp_c: 32, mintemp_c: 22, condition: { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' } },
                },
                {
                    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                    day: { maxtemp_c: 30, mintemp_c: 21, condition: { text: 'Partly Cloudy', icon: '//cdn.weatherapi.com/weather/64x64/day/116.png' } },
                },
                {
                    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
                    day: { maxtemp_c: 28, mintemp_c: 20, condition: { text: 'Light Rain', icon: '//cdn.weatherapi.com/weather/64x64/day/296.png' } },
                },
            ],
        },
    };
}
