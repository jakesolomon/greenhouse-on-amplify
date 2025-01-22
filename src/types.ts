// These types adhere to the response formats in /amplify/functions/{handlerName}/handler.ts

import { SelectableCropType } from './helpers/crop-types.ts'

export interface SeedVariety extends SelectableCropType {
  trueSeedTitle: string;
  descriptionHtml: string;
  storeHandle: string;
}

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
//   January: TemperatureData,
//   February: TemperatureData,
//   March: TemperatureData,
//   April: TemperatureData,
//   May: TemperatureData,
//   June: TemperatureData,
//   July: TemperatureData,
//   August: TemperatureData,
//   September: TemperatureData,
//   October: TemperatureData,
//   November: TemperatureData,
//   December: TemperatureData,
// }

export interface ClimateDataOutput {
  temperatureData: TemperatureDataByMonth[],
  lastSpringFrostDate: string,
  firstFallFrostDate: string,
  hardinessZone: number
}

export interface UserInputs {
  crops: string[];
}

// TODO move summary and advice to new request entirely
export interface PlantingScheduleOutput {
  // summary: string[];
  plots: Planting[][];
  // advice: string[];
}

export interface GrowingDateRange {
  transplantingDate: Date
  harvestStartDate: Date
  harvestEndDate: Date
}

export interface Planting extends GrowingDateRange {
  name: string,
  // doNotFudgeSooner: boolean,
  // doNotFudgeLater: boolean
}

export interface Crop {
  name: string; // I will supply this
  variety: string; // I will supply this
  shortDescription: string;
  storeHandle: string;

  seedlingDuration: number; // 0 for direct sow. Number represents the reasonable amt of time before transplant. Might actually be able to ignore this value until month-to-month schedule is created.
  growthDuration: number; // basically, days to maturity. Starts with transplant date or direct sow date.
  harvestDuration: number; // days that something can be harvested. Longer for cut-and-come-again.

  // optimalPlantingDates: Date[]; // based on "sow ## days before frost" type language combined with climate data. // One response I got was short date ranges. This is good to allow some flexibility, it might help optimize space.
  // optimalGrowingDateRanges: Date[][]
  optimalGrowingDateRanges: GrowingDateRange[]
  // soilTypePreference: string;
  // soilPhPreference: string;
  // sunlightPreference: string;
  frostHardy: boolean;
  directSow: boolean;
  guidance: string;

  lowerTempBound: number;
  upperTempBound: number;
  // dataMissingFromTrueLeaf: boolean; // maybe I use their planner by default if missing info from variety, if this boolean is true.
//   Might actually not need this ^ boolean at all if I send summarized planner info as a backup along with each description.
}

// Old crop object
// export interface Crop {
//   name: string;
//   variety: string;
//   shortDescription: string;
//   storeHandle: string;
//   seedlingDuration: number;
//   growthDuration: number;
//   harvestDuration: number;
//   lowerTempBound: number;
//   upperTempBound: number;
// }

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

