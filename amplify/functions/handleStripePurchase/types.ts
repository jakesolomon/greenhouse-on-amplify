import React from "react";

export interface Planting {
  name: string;
  transplantingDate: Date;
  harvestStartDate: Date;
  harvestEndDate: Date;
}

export interface AppendedPlanting extends Planting {
  directSow: boolean;
}

export interface CropDataForLLMRequests {
  name: string;
  variety: string;
  directSow: boolean;
}

export interface GrowingDateRange {
  transplantingDate: Date
  harvestStartDate: Date
  harvestEndDate: Date
}

export interface Crop {
  name: string;
  variety: string;
  shortDescription: string;
  storeHandle?: string;
  imageUrl?: string;

  optimalGrowingDateRanges: GrowingDateRange[]
  frostHardy: boolean;
  directSow: boolean;
  guidance: string;

  lowerTempBound: number;
  upperTempBound: number;
}

export interface IntroExtras {
  pruning: string,
  supportStructures: string
}

export interface FullPlanSummaries {
  January: string,
  February: string,
  March: string,
  April: string,
  May: string,
  June: string,
  July: string,
  August: string,
  September: string,
  October: string,
  November: string,
  December: string,
}

export interface FullPlanTasksPerCrop {
  January: string[],
  February: string[],
  March: string[],
  April: string[],
  May: string[],
  June: string[],
  July: string[],
  August: string[],
  September: string[],
  October: string[],
  November: string[],
  December: string[],
}

export interface FullPlanTaskList {
  plot: number,
  crop: string,
  tasks: FullPlanTasksPerCrop
}

export interface GrowingDateRange {
  transplantingDate: Date
  harvestStartDate: Date
  harvestEndDate: Date
}

export interface TwoColumnTasksByMonth {
  "January": React.ReactElement[] | null,
  "February": React.ReactElement[] | null,
  "March": React.ReactElement[] | null,
  "April": React.ReactElement[] | null,
  "May": React.ReactElement[] | null,
  "June": React.ReactElement[] | null,
  "July": React.ReactElement[] | null,
  "August": React.ReactElement[] | null,
  "September": React.ReactElement[] | null,
  "October": React.ReactElement[] | null,
  "November": React.ReactElement[] | null,
  "December": React.ReactElement[] | null,
}