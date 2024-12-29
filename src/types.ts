// These types adhere to the response formats in /amplify/functions/{handlerName}/handler.ts

export interface UserInputs {
  plantHardinessZone: string;
  plotType: string;
  gardenAreas: Dimensions[];
  goal: string[];
  sunlight: number;
  crop: string[];
}

export interface PlantingScheduleOutput {
  summary: string;
  plots: Planting[][];
}

export interface Planting {
  name: string
  transplantingDate: string
  harvestStartDate: string
  harvestEndDate: string
}

export interface CropDataOutput {
  summary: string;
  crops: Crop[];
  additionalAdvice: string[];
}

export interface Crop {
  name: string;
  variety: string;
  reason: string;
  seedlingDuration: number;
  growthDuration: number;
  harvestDuration: number;
  lowerTempBound: number;
  upperTempBound: number;
}

export interface GardenArea {
  id: number;
  dimensions: Dimensions;
  plots: Plot[];
}

export interface Dimensions {
  length: number;
  width: number;
}

interface Plot {
  id: number;
  crop: string;
  position: Coordinates;
  size: Dimensions
}

interface Coordinates {
  x: number;
  y: number;
}

