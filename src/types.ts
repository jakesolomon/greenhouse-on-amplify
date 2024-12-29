// These types adhere to the response formats in /amplify/functions/{handlerName}/handler.ts

interface TemperatureData {
  avgHigh: number,
  avgLow: number
}

interface TemperatureDataByMonth {
  month: string,
  temps: TemperatureData,
}

// TODO: consider using this data shape to enforce correct months, instead of letting LLM do it. Would have to sort and create display names for months.
// interface TemperatureDataByMonth {
//   january: TemperatureData,
//   february: TemperatureData,
//   march: TemperatureData,
//   april: TemperatureData,
//   may: TemperatureData,
//   june: TemperatureData,
//   july: TemperatureData,
//   august: TemperatureData,
//   september: TemperatureData,
//   october: TemperatureData,
//   november: TemperatureData,
//   december: TemperatureData,
// }

export interface ClimateDataOutput {
  temperatureData: TemperatureDataByMonth[],
  lastFrostDate: string,
  firstFrostDate: string,
}

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

