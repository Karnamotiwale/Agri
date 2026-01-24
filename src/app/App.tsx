import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from './screens/LoginScreen';
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/login" element={<LoginScreen />} />
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

        {/* Crop Flow Routes */}
        <Route path="/crop/:id/overview" element={<CropOverview />} />
        <Route path="/crop/:id/details" element={<CropDetails />} />
        <Route path="/crop/:id/full-details" element={<CropFullDetails />} />
        <Route path="/crop/:id/health" element={<CropHealth />} />
        <Route path="/crop/:id/statistics" element={<CropStatistics />} />
        <Route path="/crop/:id/monitoring" element={<CropMonitoring />} />
      </Routes>
    </BrowserRouter>
  );
}