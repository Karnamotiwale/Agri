import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// New Pages
import DashboardPage from "../pages/Dashboard/DashboardPage";
import MonitoringPage from "../pages/Monitoring/MonitoringPage";
import FarmsPage from "../pages/Farms/FarmsPage";
import FarmDetailsPage from "../pages/Farms/FarmDetailsPage";
import CropsPage from "../pages/Crops/CropsPage";
import CropDetailsPage from "../pages/Crops/CropDetailsPage";
import CommunityPage from "../pages/Community/CommunityPage";
import MarketPage from "../pages/Market/MarketPage";
import ServicesPage from "../pages/Services/ServicesPage";
import CropMonitoringPage from "../pages/Monitoring/CropMonitoringPage";
import DataAnalysisPage from "../pages/Analysis/DataAnalysisPage";
import SoilAnalysisPage from "../pages/Soil/SoilAnalysisPage";
import ActivityLogsPage from "../pages/Activities/ActivityLogsPage";
import DiagnosisResultPage from "../pages/Health/DiagnosisResultPage";
import WeatherSoilPestPage from "../pages/Weather/WeatherSoilPestPage";
import SchemesPage from "../pages/Schemes/SchemesPage";

// Original Screens (preserving routing structure)
import { LoginScreen } from "./screens/LoginScreen";
import { AuthCallback } from "./routes/AuthCallback";
import { FarmRegistration } from "./screens/FarmRegistration";
import { CropRegistration } from "./screens/CropRegistration";
import { SensorGuide } from "./screens/SensorGuide";
import { ProfileScreen } from "./screens/ProfileScreen";
import { CropHealth } from "./screens/CropHealth";
import { CropStatistics } from "./screens/CropStatistics";
import { ActionSelection } from "./screens/ActionSelection";
import { CropDetailsForm } from "./screens/CropDetailsForm";
import { AIEngineDashboard } from "./screens/AIEngineDashboard";
import { AISystemStatistics } from "./screens/AISystemStatistics";

// Helper components for routing
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
        <Route path="/auth/callback" element={<PublicRoute><AuthCallback /></PublicRoute>} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Core Pages */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/monitoring" element={<ProtectedRoute><MonitoringPage /></ProtectedRoute>} />
        <Route path="/farms" element={<ProtectedRoute><FarmsPage /></ProtectedRoute>} />
        {/* Backward compatibility */}
        <Route path="/my-farm" element={<ProtectedRoute><FarmsPage /></ProtectedRoute>} />
        <Route path="/crops" element={<ProtectedRoute><CropsPage /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
        <Route path="/market" element={<ProtectedRoute><MarketPage /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
        <Route path="/crop-monitoring" element={<ProtectedRoute><CropMonitoringPage /></ProtectedRoute>} />
        <Route path="/weather-soil-pest" element={<ProtectedRoute><WeatherSoilPestPage /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><DataAnalysisPage /></ProtectedRoute>} />
        <Route path="/soil-analysis" element={<ProtectedRoute><SoilAnalysisPage /></ProtectedRoute>} />
        <Route path="/activity-logs" element={<ProtectedRoute><ActivityLogsPage /></ProtectedRoute>} />
        <Route path="/diagnosis-result" element={<ProtectedRoute><DiagnosisResultPage /></ProtectedRoute>} />
        <Route path="/activities" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/schemes" element={<ProtectedRoute><SchemesPage /></ProtectedRoute>} />

        {/* Protected Detail/Action Routes */}
        <Route path="/farm-registration" element={<Navigate to="/action-selection" replace />} />
        <Route path="/crop-registration" element={<ProtectedRoute><CropRegistration /></ProtectedRoute>} />
        <Route path="/sensor-guide" element={<ProtectedRoute><SensorGuide /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/action-selection" element={<ProtectedRoute><ActionSelection /></ProtectedRoute>} />
        <Route path="/farm-details" element={<ProtectedRoute><FarmDetailsPage /></ProtectedRoute>} />
        <Route path="/crop-details" element={<ProtectedRoute><CropDetailsForm /></ProtectedRoute>} />
        
        {/* AI Routes */}
        <Route path="/ai-engine" element={<ProtectedRoute><AIEngineDashboard /></ProtectedRoute>} />
        <Route path="/ai-statistics" element={<ProtectedRoute><AISystemStatistics /></ProtectedRoute>} />
        <Route path="/ai-dashboard" element={<Navigate to="/ai-engine" replace />} />
        <Route path="/api-engine" element={<Navigate to="/ai-engine" replace />} />

        {/* Crop Details Flow Routes */}
        <Route path="/crop/:id/overview" element={<ProtectedRoute><CropsPage /></ProtectedRoute>} />
        <Route path="/crop/:id/details" element={<ProtectedRoute><CropDetailsPage /></ProtectedRoute>} />
        <Route path="/crop/:id/full-details" element={<ProtectedRoute><CropDetailsPage /></ProtectedRoute>} />
        <Route path="/crop/:id/health" element={<ProtectedRoute><CropHealth /></ProtectedRoute>} />
        <Route path="/crop/:id/statistics" element={<ProtectedRoute><CropStatistics /></ProtectedRoute>} />
        <Route path="/crop/:id/monitoring" element={<ProtectedRoute><MonitoringPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
