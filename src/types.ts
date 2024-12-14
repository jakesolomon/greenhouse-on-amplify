// These types adhere to the response format in /amplify/functions/promptLLM/handler.ts

export interface PlantingDateSchema {
  month: number;
  day: number;
}

export interface Crop {
  name: string;
  variety: string;
  reason: string;
  plantingDate: PlantingDateSchema,
  harvestDate: PlantingDateSchema,
}

export interface GardenPlan {
  summary: string;
  crops: Crop[];
  additionalAdvice: string[];
}