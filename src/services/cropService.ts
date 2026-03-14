import { api } from "./api";

export const getCropHealth = (farmId: string) =>
  api.get(`/api/analytics/crop-health?farm_id=${farmId}`);

export const detectDisease = (image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  return api.post("/api/cropnet-detect", formData);
};
