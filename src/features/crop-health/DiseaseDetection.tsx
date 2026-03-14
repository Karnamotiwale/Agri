import React from "react";
import { detectDisease } from "../../services/cropService";

export default function DiseaseDetection() {
  const [result, setResult] = React.useState<any>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const res = await detectDisease(file);
        console.log(res.data);
        setResult(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-2">Crop Disease Detection</h3>
      <input type="file" accept="image/*" onChange={handleUpload} className="mb-4" />
      {result && (
        <div className="mt-2 text-sm text-gray-700">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
