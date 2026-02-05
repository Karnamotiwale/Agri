import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from './screens/LoginScreen';
import { AuthCallback } from './routes/AuthCallback';
import { FarmRegistration } from './screens/FarmRegistration';
import { CropRegistration } from './screens/CropRegistration';
import { SensorGuide } from './screens/SensorGuide';
import { Dashboard } from './screens/Dashboard';
import { MyFarm } from './screens/MyFarm';
import { ProfileScreen } from './screens/ProfileScreen';
import { CropOverview } from './screens/CropOverview';
import { CropDetails } from './screens/CropDetails';
import { CropHealth } from './screens/CropHealth';
import { CropStatistics } from './screens/CropStatistics';
import { CropMonitoring } from './screens/CropMonitoring';
import { CropFullDetails } from './screens/CropFullDetails';
import { ActionSelection } from './screens/ActionSelection';
import { FarmDetailsForm } from './screens/FarmDetailsForm';
import { CropDetailsForm } from './screens/CropDetailsForm';
import { AIEngineDashboard } from './screens/AIEngineDashboard';
import { AISystemStatistics } from './screens/AISystemStatistics';

// Helper component for protected routes
function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Helper component for public-only routes (like login)
function PublicRoute() {
  const { user, loading } = useAuth();

  // if (loading) return <Loading />; // REMOVED: Show login UI immediately
  // if (user) return <Navigate ... />;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Redirect old farm-registration route to new action-selection */}
          <Route path="/farm-registration" element={<Navigate to="/action-selection" replace />} />

          <Route path="/crop-registration" element={<CropRegistration />} />
          <Route path="/sensor-guide" element={<SensorGuide />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-farm" element={<MyFarm />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/action-selection" element={<ActionSelection />} />
          <Route path="/farm-details" element={<FarmDetailsForm />} />
          <Route path="/crop-details" element={<CropDetailsForm />} />
          <Route path="/ai-engine" element={<AIEngineDashboard />} />
          <Route path="/ai-statistics" element={<AISystemStatistics />} />
          <Route path="/ai-dashboard" element={<Navigate to="/ai-engine" replace />} />
          <Route path="/api-engine" element={<Navigate to="/ai-engine" replace />} />

          {/* Crop Flow Routes */}
          <Route path="/crop/:id/overview" element={<CropOverview />} />
          <Route path="/crop/:id/details" element={<CropDetails />} />
          <Route path="/crop/:id/full-details" element={<CropFullDetails />} />
          <Route path="/crop/:id/health" element={<CropHealth />} />
          <Route path="/crop/:id/statistics" element={<CropStatistics />} />
          <Route path="/crop/:id/monitoring" element={<CropMonitoring />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}