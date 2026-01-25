import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, MapCameraChangedEvent } from '@vis.gl/react-google-maps';

interface GoogleMapSelectorProps {
    initialLat?: number;
    initialLng?: number;
    onLocationSelect: (lat: number, lng: number) => void;
    readOnly?: boolean;
    apiKey: string;
}

export const GoogleMapSelector: React.FC<GoogleMapSelectorProps> = ({
    initialLat = 20.5937, // Default to India center
    initialLng = 78.9629,
    onLocationSelect,
    readOnly = false,
    apiKey
}) => {
    const [position, setPosition] = useState({ lat: initialLat, lng: initialLng });

    useEffect(() => {
        if (initialLat && initialLng) {
            setPosition({ lat: initialLat, lng: initialLng });
        }
    }, [initialLat, initialLng]);

    const handleCameraChange = (ev: MapCameraChangedEvent) => {
        if (readOnly) return;
        const center = ev.detail.center;
        setPosition(center);
        onLocationSelect(center.lat, center.lng);
    };

    const handleMapClick = (ev: any) => {
        if (readOnly || !ev.detail.latLng) return;
        const { lat, lng } = ev.detail.latLng;
        setPosition({ lat, lng });
        onLocationSelect(lat, lng);
    };

    return (
        <APIProvider apiKey={apiKey}>
            <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-200 relative">
                <Map
                    defaultCenter={position}
                    defaultZoom={5}
                    center={position}
                    onCameraChanged={handleCameraChange}
                    onClick={handleMapClick}
                    mapId="DEMO_MAP_ID" // Required for advanced markers, can be any string for basic
                    disableDefaultUI={readOnly}
                    gestureHandling={readOnly ? 'none' : 'cooperative'}
                >
                    <Marker position={position} />
                </Map>
                {!readOnly && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100 text-xs text-gray-600">
                        <p className="font-bold mb-1">📍 Selected Coordinates</p>
                        <div className="flex justify-between">
                            <span>Lat: {position.lat.toFixed(6)}</span>
                            <span>Lng: {position.lng.toFixed(6)}</span>
                        </div>
                        <p className="mt-1 text-[10px] text-gray-400">Tap anywhere to set location</p>
                    </div>
                )}
            </div>
        </APIProvider>
    );
};
