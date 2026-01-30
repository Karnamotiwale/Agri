import React, { useRef } from 'react';
import { Camera, Upload, Edit } from 'lucide-react';
import { cropService } from '../../services/crop.service';

interface Props {
    cropId: string;
    imageUrl: string;
    onImageUpdate: (url: string) => void;
}

export function FieldPhotoHeader({ cropId, imageUrl, onImageUpdate }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = await cropService.uploadCropImage(file);
            if (url) {
                // Update crop in DB
                await cropService.updateCrop(cropId, { image: url });
                onImageUpdate(url);
            }
        }
    };

    return (
        <div className="relative w-full aspect-[16/9] bg-gray-200 overflow-hidden shadow-lg">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="Field Banner"
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                    <Camera className="w-12 h-12 mb-2" />
                    <p className="text-sm font-bold uppercase tracking-wider">No Field Image</p>
                </div>
            )}

            <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
                >
                    {imageUrl ? <Edit className="w-5 h-5 text-gray-700" /> : <Upload className="w-5 h-5 text-green-600" />}
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
                accept="image/*"
            />
        </div>
    );
}
