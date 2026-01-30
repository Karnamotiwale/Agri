import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';

export function CropStatistics() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            <Header title="Statistics" showBack onBackClick={() => navigate('/dashboard')} />

            <div className="px-6 py-6 pb-8 space-y-6">
                {/* Content removed as requested */}
            </div>
        </div>
    );
}
