const fs = require('fs');
const path = require('path');

const updates = [
  { file: 'src/pages/Dashboard/DashboardPage.tsx', replace: /export function Dashboard\(/, with: 'export default function Dashboard(' },
  { file: 'src/pages/Monitoring/MonitoringPage.tsx', replace: /export function CropMonitoring\(/, with: 'export default function CropMonitoring(' },
  { file: 'src/pages/Farms/FarmsPage.tsx', replace: /export function MyFarm\(/, with: 'export default function MyFarm(' },
  { file: 'src/pages/Farms/FarmDetailsPage.tsx', replace: /export function FarmDetailsForm\(/, with: 'export default function FarmDetailsForm(' },
  { file: 'src/pages/Crops/CropsPage.tsx', replace: /export function CropOverview\(/, with: 'export default function CropOverview(' },
  { file: 'src/pages/Crops/CropDetailsPage.tsx', replace: /export function CropFullDetails\(/, with: 'export default function CropFullDetails(' },
];

for (const update of updates) {
  const fullPath = path.join('c:/Users/Karna/Desktop/AGRIAI/Agri', update.file);
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(update.replace, update.with);
    
    // Fix specific imports in Dashboard
    if (update.file.includes('DashboardPage')) {
      content = content.replace(/from\s+['"]\.\.\/components\/FarmsView['"]/g, "from '@/app/components/FarmsView'");
      content = content.replace(/from\s+['"]\.\.\/components\/GovernmentSchemes['"]/g, "from '@/app/components/GovernmentSchemes'");
      content = content.replace(/from\s+['"]\.\.\/components\/analytics\/AnalyticsView['"]/g, "from '@/app/components/analytics/AnalyticsView'");
    }
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Fixed export in: ' + update.file);
  } catch(e) {
    console.error('Error with ' + update.file, e.message);
  }
}
