/**
 * Location Service — Nominatim reverse geocoding
 * https://nominatim.openstreetmap.org/reverse
 */

export interface LocationInfo {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  address: string;
  displayName: string;
}

/**
 * Reverse geocode a lat/lng to a human-readable address using OpenStreetMap Nominatim.
 * Free to use, no API key required.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationInfo> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'KisaanSaathi-AgriApp/1.0',
        },
      }
    );

    if (!response.ok) throw new Error('Nominatim request failed');

    const data = await response.json();
    const addr = data.address || {};

    return {
      latitude: lat,
      longitude: lng,
      city: addr.city || addr.town || addr.village || addr.hamlet || '',
      state: addr.state || '',
      country: addr.country || '',
      address: `${addr.road || ''} ${addr.suburb || ''} ${addr.city || addr.town || addr.village || ''}`.trim(),
      displayName: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    };
  } catch (err) {
    console.error('Reverse geocoding failed:', err);
    return {
      latitude: lat,
      longitude: lng,
      city: '',
      state: '',
      country: '',
      address: '',
      displayName: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    };
  }
}

/**
 * Forward geocode a place name to get its coordinates.
 */
export async function searchPlace(query: string): Promise<LocationInfo | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'KisaanSaathi-AgriApp/1.0',
        },
      }
    );
    const results = await response.json();
    if (!results || results.length === 0) return null;

    const first = results[0];
    const addr = first.address || {};
    return {
      latitude: parseFloat(first.lat),
      longitude: parseFloat(first.lon),
      city: addr.city || addr.town || addr.village || '',
      state: addr.state || '',
      country: addr.country || '',
      address: first.display_name || '',
      displayName: first.display_name || '',
    };
  } catch {
    return null;
  }
}

/**
 * Get user GPS location from the browser.
 */
export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    });
  });
}
