const fs = require('fs');
const path = require('path');

const directory = 'c:/Users/Karna/Desktop/AGRIAI/Agri/src';

const replacements = [
  // Layout
  { regex: /from\s+['"].*?\/Header['"]/g, replace: "from '@/components/layout/Header'" },
  { regex: /from\s+['"].*?\/BottomNav['"]/g, replace: "from '@/components/layout/BottomNav'" },
  
  // Forms
  { regex: /from\s+['"].*?\/AddCropModal['"]/g, replace: "from '@/components/forms/AddCropModal'" },
  { regex: /from\s+['"].*?\/AddFarmModal['"]/g, replace: "from '@/components/forms/AddFarmModal'" },
  
  // Cards
  { regex: /from\s+['"].*?\/CropCard['"]/g, replace: "from '@/components/cards/CropCard'" },
  
  // Screens -> Pages
  // Ensure we don't accidentally match DashboardPage string if it already contains DashboardPage
  { regex: /from\s+['"].*?\/Dashboard['"]/g, replace: "from '@/pages/Dashboard/DashboardPage'" },
  { regex: /from\s+['"].*?\/CropMonitoring['"]/g, replace: "from '@/pages/Monitoring/MonitoringPage'" },
  { regex: /from\s+['"].*?\/MyFarm['"]/g, replace: "from '@/pages/Farms/FarmsPage'" },
  { regex: /from\s+['"].*?\/FarmDetailsForm['"]/g, replace: "from '@/pages/Farms/FarmDetailsPage'" },
  { regex: /from\s+['"].*?\/CropOverview['"]/g, replace: "from '@/pages/Crops/CropsPage'" },
  { regex: /from\s+['"].*?\/CropFullDetails['"]/g, replace: "from '@/pages/Crops/CropDetailsPage'" },
  { regex: /from\s+['"].*?\/MapView['"]/g, replace: "from '@/components/maps/FarmMap'" },

  // Features - Crop Health
  { regex: /from\s+['"].*?\/HealthDetectionHub['"]/g, replace: "from '@/features/crop-health/HealthDetectionHub'" },
  { regex: /from\s+['"].*?\/LiveFieldStatus['"]/g, replace: "from '@/features/crop-health/LiveFieldStatus'" },
  { regex: /from\s+['"].*?\/StressDetectionSystem['"]/g, replace: "from '@/features/crop-health/StressDetectionSystem'" },

  // Features - Analytics & Yield
  { regex: /from\s+['"].*?\/SoilAnalytics['"]/g, replace: "from '@/features/analytics/SoilAnalytics'" },
  { regex: /from\s+['"].*?\/ResourceUsageAnalytics['"]/g, replace: "from '@/features/analytics/ResourceAnalytics'" },
  { regex: /from\s+['"].*?\/AIYieldPrediction['"]/g, replace: "from '@/features/yield/YieldPredictionCard'" },
  { regex: /from\s+['"].*?\/WeatherWidget['"]/g, replace: "from '@/features/weather/WeatherWidget'" },
  { regex: /from\s+['"].*?\/AIFertilizerPesticideAdvisory['"]/g, replace: "from '@/features/analytics/AIFertilizerPesticideAdvisory'" },
  { regex: /from\s+['"].*?\/YieldPredictor['"]/g, replace: "from '@/features/yield/YieldPredictor'" },

  // Irrigation
  { regex: /from\s+['"].*?\/SmartValveControl['"]/g, replace: "from '@/features/irrigation/IrrigationCard'" },

  // Dashboard AI widgets
  { regex: /from\s+['"].*?\/DashboardAIInsights['"]/g, replace: "from '@/features/analytics/DashboardAIInsights'" },
  { regex: /from\s+['"].*?\/LiveWeatherWidget['"]/g, replace: "from '@/features/weather/LiveWeatherWidget'" }
];

function processPath(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processPath(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      for (const {regex, replace} of replacements) {
        if (regex.test(content)) {
          // Double check we are not replacing an already replaced import
          // e.g., if content already has from '@/pages/Dashboard/DashboardPage' we don't want to replace Dashboard again.
          const matches = content.match(regex);
          if (matches) {
            content = content.replace(regex, replace);
            modified = true;
          }
        }
      }
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

try {
  processPath(directory);
} catch (e) {
  console.error(e);
}
