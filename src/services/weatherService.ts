import { api } from "./api";

const FALLBACK_LAT = 19.0760; // Mumbai fallback
const FALLBACK_LON = 72.8777;

export async function getUserLocation(farmLat?: number, farmLon?: number): Promise<{ lat: number, lon: number }> {
    const defaultLat = farmLat ?? FALLBACK_LAT;
    const defaultLon = farmLon ?? FALLBACK_LON;

    if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser. Using fallback coordinates.");
        return { lat: defaultLat, lon: defaultLon };
    }

    try {
        if (navigator.permissions && navigator.permissions.query) {
            const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
            if (permissionStatus.state === 'denied') {
                console.warn("Geolocation permission has been blocked. Using fallback coordinates.");
                return { lat: defaultLat, lon: defaultLon };
            }
        }
    } catch (e) {
        console.warn("Permissions API check failed, proceeding to request position.", e);
    }

    return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log("Geolocation successful. Using real coordinates.");
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    console.warn("User denied Geolocation. Using fallback coordinates.");
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    console.warn("Location unavailable. Using fallback coordinates.");
                } else if (error.code === error.TIMEOUT) {
                    console.warn("Location request timed out. Using fallback coordinates.");
                } else {
                    console.warn("Unknown geolocation error. Using fallback coordinates.");
                }
                resolve({ lat: defaultLat, lon: defaultLon });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

export async function getWeather(lat: number, lon: number) {
  // Using the new secure backend endpoint instead of returning key to frontend
  const res = await api.get("/api/v1/weather", {
    params: { lat, lon }
  });
  return res.data;
}
