import {ClimateDataOutput} from "../types.ts";

export interface SearchParameter {
  name: string
  tags: string[]
  category: string
}

export interface SelectableCropType {
  displayName: string;
  collectionHandle: string
  subTypeParameters?: SearchParameter[]
  idealHardinessZones: number[]
  frostHardy: boolean
  daysToMaturity: number // includes germination time for direct sow
  directSow: boolean
  harvestDuration: (
    (climateData: ClimateDataOutput,
     plantingDate: Date,
     daysToMaturity: number
    ) => number
  )
  plantingDates: (climateData: ClimateDataOutput, daysToMaturity: number) => Date[]
}

const daysUntilSuboptimalTemperature = (
  yearData: ClimateDataOutput,
  optimalRange: {min?: number, max?: number},
  startDate: Date,
  name: string
)=> {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Days in each month
  const startMonthIndex = new Date(startDate).getMonth();
  const startDayOfMonth = new Date(startDate).getDate();
  let daysElapsed = 0;
  let daysOutsideRange = 0;
  const monthData = yearData.temperatureData

  // Iterate through months, starting from the startDate
  for (let i = startMonthIndex; i < monthData.length - 1; i++) {
    const currentMonth = monthData[i];
    const nextMonth = monthData[i + 1];
    const currentLow = currentMonth.temps.avgLow;
    const currentHigh = currentMonth.temps.avgHigh;
    const nextLow = nextMonth.temps.avgLow;
    const nextHigh = nextMonth.temps.avgHigh;

    // Determine days left in the current month
    const daysInCurrentMonth = i === startMonthIndex
      ? daysInMonth[i] - startDayOfMonth + 1
      : daysInMonth[i];

    // Interpolate daily temperature changes
    const dailyLowChange = (nextLow - currentLow) / daysInCurrentMonth;
    const dailyHighChange = (nextHigh - currentHigh) / daysInCurrentMonth;

    // Iterate through the days of the current month
    for (let day = i === startMonthIndex ? startDayOfMonth : 1; day <= daysInMonth[i]; day++) {
      const interpolatedLow = currentLow + dailyLowChange * (day - 1);
      const interpolatedHigh = currentHigh + dailyHighChange * (day - 1);

      // Check if the current day's temperature is outside the optimal range
      const outsideMin = optimalRange.min !== undefined && interpolatedLow < optimalRange.min;
      const outsideMax = optimalRange.max !== undefined && interpolatedHigh > optimalRange.max;

      if (outsideMin || outsideMax) {
        daysOutsideRange++;
      } else {
        // If temperatures return to optimal range, reset the counter
        daysOutsideRange = 0;
      }

      // If temperatures are sustained outside the range for 7 days, return the total days elapsed
      if (daysOutsideRange >= 7) {
        return daysElapsed + day - (i === startMonthIndex ? startDayOfMonth : 1);
      }
    }

    // Add the current month's days to the total elapsed days
    daysElapsed += daysInCurrentMonth;
  }

  // If the loop finishes and the range is never sustained for a week, return -1
  console.error("Error finding duration of harvest for crop, ", name)
  return -1; // Indicates sustained suboptimal temperatures were never reached
}


// const daysUntilTargetLow = (yearData: ClimateDataOutput, targetLow: number, startDate: Date, name: string) => {
//   const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Days in each month
//   console.log(startDate);
//   const startMonthIndex = startDate.getMonth();
//   const startDayOfMonth = startDate.getDate();
//   let daysElapsed = 0;
//   const monthData = yearData.temperatureData
//
//   // Start iterating from the start month
//   for (let i = startMonthIndex; i < monthData.length - 1; i++) {
//     const currentMonth = monthData[i];
//     const nextMonth = monthData[i + 1];
//     const currentLow = currentMonth.temps.avgLow;
//     const nextLow = nextMonth.temps.avgLow;
//
//     // Determine how many days are left in the start month
//     const daysInCurrentMonth = i === startMonthIndex
//       ? daysInMonth[i] - startDayOfMonth + 1
//       : daysInMonth[i];
//
//     // If the targetLow is within this month's range, calculate the exact day
//     if (targetLow >= nextLow && targetLow <= currentLow) {
//       const lowDifference = currentLow - nextLow;
//       const targetDifference = currentLow - targetLow;
//
//       // Proportion of the month until the target temperature is hit
//       const proportionOfMonth = targetDifference / lowDifference;
//
//       // Calculate the exact number of days until targetLow is reached
//       daysElapsed += Math.round(proportionOfMonth * daysInCurrentMonth);
//       return daysElapsed; // Return the number of days
//     }
//
//     // If the targetLow isn't in this range, move to the next month
//     daysElapsed += daysInCurrentMonth;
//   }
//
//   // If the loop finishes without finding the target temperature, return -1
//   console.error("Error finding duration of harvest for crop, ", name)
//   return -1; // Indicates the target low is never reached
// }

export const cropTypes: { [key: string]: SelectableCropType } = {
  // "Amaranth": {
  //   displayName: "Amaranth",
  //   collectionHandle: "amaranth",
  //   idealHardinessZones: [5, 6, 7, 8, 9, 10, 11, 12, 13]
  // },
  // "Bean (snap, bush)": {
  //   displayName: "Bean (snap, bush)",
  //   collectionHandle: "bean-planting-seeds",
  //   subTypeParameters: [
  //     {"name":"Snap","tags":["Snap Bean"],"category":"Pod Type"},
  //     {"name":"Bush Beans","tags":["Bush Bean"],"category":"Bean Type"}
  //   ],
  //   generalDataHandle: "Bush Bean",
  //
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10, 11]
  // },
  // "Bean (snap, pole)": {
  //   displayName: "Bean (snap, pole)",
  //   collectionHandle: "bean-planting-seeds",
  //   subTypeParameters: [
  //     {"name":"Snap","tags":["Snap Bean"],"category":"Pod Type"},
  //     {"name":"Pole Beans","tags":["Pole Bean"],"category":"Bean Type"}
  //   ],
  //   generalDataHandle: "Pole Bean",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10, 11]
  // },
  // "Bean (shell)": {
  //   displayName: "Bean (shell)",
  //   collectionHandle: "bean-planting-seeds",
  //   subTypeParameters: [
  //     {"name": "Shell","tags": ["Shell Bean"],"category":"Pod Type"}
  //   ],
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10, 11]
  // },
  "Beet": {
    displayName: "Beet",
    collectionHandle: "beet-garden-seed",
    idealHardinessZones: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    frostHardy: true,
    daysToMaturity: 55,
    directSow: true,
    harvestDuration: () => 7,
    plantingDates: (climateData: ClimateDataOutput) => {
      // best sown directly outdoors 4-5 weeks prior to final spring frost or 4-5 weeks before the first autumn frost
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 32)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 32)
      return [springPlantingDate, fallPlantingDate]
    }
  },
  "Broccoli": {
    displayName: "Broccoli",
    collectionHandle: "broccoli-gardening-seeds",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9],
    frostHardy: true,
    daysToMaturity: 70, // 5 weeks of seedling growth indoors, then 70ish outside?
    directSow: false,
    harvestDuration: () => 14, // can vary, depending on behavior of side shoots.
    plantingDates: (climateData: ClimateDataOutput) => {
      // Seed 7 weeks prior to last frost date (transplant when 5 weeks old), or seed 3 months prior to first frost dates (transplant at 5 weeks)
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 14)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 49)
      return [springPlantingDate, fallPlantingDate]
    }
  },
  // "Brussels Sprouts": {
  //   displayName: "Brussels Sprouts",
  //   collectionHandle: "brussels-sprouts-planting-seed",
  //   generalDataHandle: "Brussels Sprouts",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  // },
  // "Burdock": {
  //   displayName: "Burdock",
  //   collectionHandle: "burdock",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  // },
  "Cabbage": {
    displayName: "Cabbage",
    collectionHandle: "cabbage-planting-seed",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9],
    frostHardy: true,
    daysToMaturity: 80,
    directSow: false,
    harvestDuration: () => 7,
    plantingDates: (climateData: ClimateDataOutput) => {
      // Seed 7 weeks prior to last frost date (transplant at 3 weeks), or seed 7 weeks prior to first frost dates (transplant at 3 weeks)
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 28)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 28)
      return [springPlantingDate, fallPlantingDate]
    }
  },
  // "Cardoon": {
  //   displayName: "Cardoon",
  //   collectionHandle: "cardoon-seeds",
  //   idealHardinessZones: [7, 8, 9, 10, 11, 12, 13]
  // },
  "Carrot": {
    displayName: "Carrot",
    collectionHandle: "carrot-planting-seeds",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10],
    frostHardy: true,
    daysToMaturity: 70,
    directSow: true,
    harvestDuration: () => 7,
    plantingDates: (climateData: ClimateDataOutput) => {
      // Seed 2.5 weeks prior to last frost date, follow 3 weeks later, or 10 weeks before first frost.
      const springPlantingDate1 = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate1.setDate(springPlantingDate1.getDate() - 18)
      const springPlantingDate2 = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate2.setDate(springPlantingDate2.getDate())
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 70)
      return [springPlantingDate1, springPlantingDate2, fallPlantingDate]
    }
  },
  "Cauliflower": {
    displayName: "Cauliflower",
    collectionHandle: "cauliflower-planting-seed",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9],
    frostHardy: true,
    daysToMaturity: 80,
    directSow: false,
    harvestDuration: () => 7,
    plantingDates: (climateData: ClimateDataOutput) => {
      // Seed 5 weeks prior to last frost date, or 7 weeks before first frost.
      const springPlantingDate1 = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate1.setDate(springPlantingDate1.getDate() - 35)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 49)
      return [springPlantingDate1, fallPlantingDate]
    }
  },
  // "Celeriac": {
  //   displayName: "Celeriac",
  //   collectionHandle: "celeriac-root-seed",
  //   generalDataHandle: "Celeriac",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  // },
  // "Celery": {
  //   displayName: "Celery",
  //   collectionHandle: "celery-garden-seed",
  //   generalDataHandle: "Celery",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11, 12]
  // },
  "Chard": {
    displayName: "Chard",
    collectionHandle: "chard-growing-seed",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10],
    frostHardy: true,
    daysToMaturity: 55,
    directSow: true,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {
      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      const daysUntilHarvestStops = daysUntilSuboptimalTemperature(climateData, {min: 25, max: 90}, harvestStartDate, 'Chard') // chat: production stops when temps are consistently below 60. 55 here because it's compared to avgLow temps.
      // Chat: can be harvested continuously from the same planting over 3–4 months, depending on the growing conditions. If temps do not exceed extremes, assume 3.5 months harvest.
      if (daysUntilHarvestStops !== -1) {
        return daysUntilHarvestStops
      }
      return 105
    },
    plantingDates: (climateData: ClimateDataOutput) => {
      // Seed 2-3 weeks prior to last frost date, or 5-6 weeks before first frost.
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 18)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 38)
      return [springPlantingDate, fallPlantingDate]
    }
  },
  // "Chinese Toon": {
  //   displayName: "Chinese Toon",
  //   collectionHandle: "chinese-toon",
  //   idealHardinessZones: [6, 7, 8, 9, 10, 11]
  // },
  "Collard": {
    displayName: "Collard",
    collectionHandle: "collard-garden-seed",
    idealHardinessZones: [6, 7, 8, 9, 10],
    frostHardy: true,
    daysToMaturity: 80, // I'm assuming this is for direct sow. So, in calculating harvestDuration, subtract 35 days.
    directSow: false,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {

      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      const daysUntilHarvestStops = daysUntilSuboptimalTemperature(climateData, {min: 20, max: 90}, harvestStartDate, 'Collard') // chat: production stops when temps are consistently below 60. 55 here because it's compared to avgLow temps.
      // Chat: can be harvested continuously from the same planting over 3–6 months, depending on the growing conditions. If temps do not exceed extremes, assume 4.5 months harvest.
      if (daysUntilHarvestStops !== -1) {
        return daysUntilHarvestStops
      }
      return 135
    },
    plantingDates: (climateData: ClimateDataOutput) => {
      // Chat says: Transplant Outdoors around the last frost date, when seedlings are 4–6 weeks old (or 3 weeks before first frost -- calculated by recommendation to direct sow 6-8 weeks before last frost, but seedlings should get started 4-6 weeks before transplant, and account for 1 week lost due to transplanting.)
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 21)
      return [springPlantingDate, fallPlantingDate]
    }
  },
  "Corn": {
    displayName: "Corn",
    collectionHandle: "corn-seed-for-garden-planting",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11],
    frostHardy: false,
    daysToMaturity: 75,
    directSow: true,
    harvestDuration: () => 7,
    plantingDates: (climateData: ClimateDataOutput) => {
      // best sown directly outdoors after final spring frost until late June or early July
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() + 7)
      const springPlantingDate2 = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate2.setDate(springPlantingDate2.getDate() + 31)
      return [springPlantingDate, springPlantingDate2]
    }
  },
  "Cucumber": {
    displayName: "Cucumber",
    collectionHandle: "cucumber-planting-seed",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11],
    frostHardy: false,
    daysToMaturity: 60,
    directSow: false,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {
      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      return daysUntilSuboptimalTemperature(climateData, {min: 55}, harvestStartDate, 'Cucumber') // chat: production stops when temps are consistently below 60. 55 here because it's compared to avgLow temps.
    },
    plantingDates: (climateData: ClimateDataOutput) => {
      // Best begun indoors 4-6 weeks prior to final spring frost. Chat says transplant 2 weeks after last frost date, when nighttime temps are consistently above 50deg.
      const plantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      plantingDate.setDate(plantingDate.getDate() + 14)
      return [plantingDate]
    }
  },
  // "Dandelion Greens": {
  //   displayName: "Dandelion Greens",
  //   collectionHandle: "italian-dandelion",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  // },
  "Eggplant": {
    displayName: "Eggplant",
    collectionHandle: "eggplant-garden-seed",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11, 12],
    frostHardy: false,
    daysToMaturity: 72,
    directSow: false,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {
      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      const daysUntilHarvestStops = daysUntilSuboptimalTemperature(climateData, {min: 55, max: 100}, harvestStartDate, 'Eggplant')
      // Chat: can be harvested continuously from the same planting over 3–4 months, depending on the growing conditions. If temps do not exceed extremes, assume 3.5 months harvest.
      if (daysUntilHarvestStops !== -1) {
        return daysUntilHarvestStops
      }
      return 105
    },
    plantingDates: (climateData: ClimateDataOutput) => {
    //   Best begun indoors 8-10 weeks prior to final spring frost. Chat says transplant 2 weeks after last frost date, when nighttime temps are consistently above 55deg.
      const plantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      plantingDate.setDate(plantingDate.getDate() + 14)
      return [plantingDate]
    }
  },
  // "Endive": {
  //   displayName: "Endive",
  //   collectionHandle: "endive-planting-seed",
  //   generalDataHandle: "Endive",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  // },
  // "Fennel": {
  //   displayName: "Fennel",
  //   collectionHandle: "fennel",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  // },
  // "Flowering Brassicas": {
  //   displayName: "Flowering Brassicas",
  //   collectionHandle: "flowering-brassica",
  //   idealHardinessZones: [7, 8, 9, 10, 11]
  // },
  // "Garlic Bulbs": {
  //   displayName: "Garlic Bulbs",
  //   collectionHandle: "garlic-bulbs",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  // },
  // "Gourd": {
  //   displayName: "Gourd",
  //   collectionHandle: "gourd-planting-seed",
  //   generalDataHandle: "Gourds",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  // },
  // "Jicama": {
  //   displayName: "Jicama",
  //   collectionHandle: "jicama",
  //   idealHardinessZones: [7, 8, 9, 10, 11, 12]
  // },
  "Kale": {
    displayName: "Kale",
    collectionHandle: "kale-garden-seed",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10],
    frostHardy: true,
    daysToMaturity: 65,
    directSow: false,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {
      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      const daysUntilHarvestStops = daysUntilSuboptimalTemperature(climateData, {min: 25, max: 85}, harvestStartDate, 'Kale') // chat: production stops when temps are consistently below 60. 55 here because it's compared to avgLow temps. // TODO adjust min temp so it doesn't suggest thatt hings can be actually harvestd throughout the winter
      // Chat: can be harvested continuously from the same planting over 3–6 months, depending on the growing conditions. If temps do not exceed extremes, assume 4.5 months harvest.
      if (daysUntilHarvestStops !== -1 && daysUntilHarvestStops < 135) { // TODO this should be the norm for maxing out calculated harvests
        return daysUntilHarvestStops
      }
      return 135
    },
    plantingDates: (climateData: ClimateDataOutput) => {
      // Seed 2-3 weeks prior to last frost date, or 5-6 weeks before first frost.
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 18)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 38)
      return [springPlantingDate, fallPlantingDate]
    }
  },
  // "Kohlrabi": {
  //   displayName: "Kohlrabi",
  //   collectionHandle: "kohlrabi-growing-seed",
  //   generalDataHandle: "Kohlrabi",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  // },
  // "Komatsuna": {
  //   displayName: "Komatsuna",
  //   collectionHandle: "komatsuna",
  //   idealHardinessZones: [6, 7, 8, 9, 10]
  // },
  // "Leek": {
  //   displayName: "Leek",
  //   collectionHandle: "leek",
  //   generalDataHandle: "Leek",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  // },
  "Lettuce": {
    displayName: "Lettuce",
    collectionHandle: "lettuce-seed-for-planting",
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10],
    frostHardy: true,
    daysToMaturity: 52,
    directSow: false,
    harvestDuration: () => 14, // total approximation. Can cut-and-come-again for 4-6 weeks (chat) or harvest all at once, apparently recommendations vary depending on the variety.
    plantingDates: (climateData: ClimateDataOutput) => {
      // (chat) seed 4–6 weeks before your last frost date transplant 2–4 weeks before your last frost date (I'm going with 18 days to be safe).
      // For Fall it says: transplant 2-4 weeks before first frost.
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 18)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 21)
      return [springPlantingDate, fallPlantingDate]
    }
  },
  // "Melon": {
  //   displayName: "Melon",
  //   collectionHandle: "melons",
  //   generalDataHandle: "Melon",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11, 12]
  // },
  // "Mibuna": {
  //   displayName: "Mibuna",
  //   collectionHandle: "mibuna",
  //   idealHardinessZones: [5, 6, 7, 8, 9, 10]
  // },
  // "Misome": {
  //   displayName: "Misome",
  //   collectionHandle: "misome",
  //   idealHardinessZones: [5, 6, 7, 8, 9, 10]
  // },
  // "Mizuna": {
  //   displayName: "Mizuna",
  //   collectionHandle: "mizuna-seeds",
  //   idealHardinessZones: [5, 6, 7, 8, 9, 10]
  // },
  // "Molokhia": {
  //   displayName: "Molokhia",
  //   collectionHandle: "molokhia",
  //   idealHardinessZones: [8, 9, 10, 11, 12, 13]
  // },
  // "Mustard": {
  //   displayName: "Mustard",
  //   collectionHandle: "mustard-garden-seed",
  //   generalDataHandle: "Mustard",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  // },
  // "Okra": {
  //   displayName: "Okra",
  //   collectionHandle: "okra-planting-seed",
  //   generalDataHandle: "Okra",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  // },
  // "Onion": {
  //   displayName: "Onion",
  //   collectionHandle: "onion-vegetable-seed",
  //   generalDataHandle: "Onion",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  // },
  // "Orach": {
  //   displayName: "Orach",
  //   collectionHandle: "orach-vegetable-seed",
  //   generalDataHandle: "Orach",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9]
  // },
  // "Pak Choi (Bok Choy)": {
  //   displayName: "Pak Choi (Bok Choy)",
  //   collectionHandle: "pak-choi-bok-choy",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  // },
  // "Parsnip": {
  //   displayName: "Parsnip",
  //   collectionHandle: "parsnip-garden-seed",
  //   generalDataHandle: "Parsnip",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8]
  // },
  "Pea (shelling)": {
    displayName: "Pea (shelling)",
    collectionHandle: "pea-garden-seed",
    subTypeParameters: [
      {"name":"Shelling Peas","tags":["Shelling Pea"],"category":"Pea Type"}
    ],
    idealHardinessZones: [3, 4, 5, 6, 7, 8],
    frostHardy: true,
    daysToMaturity: 55,
    directSow: true,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {
      // (Chat) shelling peas generally have a 2–3 week harvest window. Production slows once the weather becomes too hot (above 75–80°F / 24–27°C).
      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      const daysUntilHarvestStops = daysUntilSuboptimalTemperature(climateData, {min: 38, max: 80}, harvestStartDate, 'Shell Peas')
      if (daysUntilHarvestStops !== -1) {
        return daysUntilHarvestStops
      }
      return 18
    },
    plantingDates: (climateData: ClimateDataOutput) => {
      // (chat) seed outdoors 4–6 weeks before your last frost date. Fall harvests are usually not as good.
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 35)
      return [springPlantingDate]
    }
  },
  "Pea (snap)": {
    displayName: "Pea (snap)",
    collectionHandle: "pea-garden-seed",
    subTypeParameters: [
      {"name":"Snap Peas","tags":["Snap Pea"],"category":"Pea Type"}
    ],
    idealHardinessZones: [3, 4, 5, 6, 7, 8],
    frostHardy: true,
    daysToMaturity: 50,
    directSow: true,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {
      // (Chat) snap peas generally have a 3–4 week harvest window.
      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      const daysUntilHarvestStops = daysUntilSuboptimalTemperature(climateData, {min: 28, max: 80}, harvestStartDate, 'Snap Peas')
      if (daysUntilHarvestStops !== -1) {
        return daysUntilHarvestStops
      }
      return 25
    },
    plantingDates: (climateData: ClimateDataOutput) => {
      // (chat) seed outdoors 4–6 weeks before your last frost date. Fall harvests are usually not as good.
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 35)
      return [springPlantingDate]
    }
  },
  "Pepper (sweet)": {
    displayName: "Pepper (sweet)",
    collectionHandle: "garden-peppers-seed",
    subTypeParameters: [
      {"name":"Sweet Type","tags":["Sweet"],"category":"Pepper Type"}
    ],
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11],
    frostHardy: false,
    daysToMaturity: 75,
    directSow: false,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {
      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      const daysUntilHarvestStops = daysUntilSuboptimalTemperature(climateData, {min: 50, max: 95}, harvestStartDate, 'Pepper')
      // (chat) they can yield fruit for 2–3 months or longer, depending on the variety, climate, and growing conditions
      if (daysUntilHarvestStops !== -1) {
        return daysUntilHarvestStops
      }
      return 75
    },
    plantingDates: (climateData: ClimateDataOutput) => {
    // (chat) Transplant peppers after the last frost date when both daytime and nighttime temperatures are consistently above 55–60°F (13–16°C). I'm estimating 3 weeks.
      const plantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      plantingDate.setDate(plantingDate.getDate() + 21)
      return [plantingDate]
    }
  },
  "Pepper (hot)": {
    displayName: "Pepper (hot)",
    collectionHandle: "garden-peppers-seed",
    subTypeParameters: [
      {"name":"Hot Type","tags":["Hot"],"category":"Pepper Type"}
    ],
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11],
    frostHardy: false,
    daysToMaturity: 90,
    directSow: false,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {
      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      const daysUntilHarvestStops = daysUntilSuboptimalTemperature(climateData, {min: 50, max: 95}, harvestStartDate, 'Pepper')
      // (chat) they can yield longer than sweet peppers if climate allows.
      if (daysUntilHarvestStops !== -1) {
        return daysUntilHarvestStops
      }
      return 85
    },
    plantingDates: (climateData: ClimateDataOutput) => {
      // (chat) Transplant peppers after the last frost date when both daytime and nighttime temperatures are consistently above 55–60°F (13–16°C). I'm estimating 2.5 weeks for hots.
      const plantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      plantingDate.setDate(plantingDate.getDate() + 18)
      return [plantingDate]
    }
  },
  // "Perilla (Shiso)": {
  //   displayName: "Perilla (Shiso)",
  //   collectionHandle: "shiso",
  //   idealHardinessZones: [7, 8, 9, 10, 11, 12]
  // },
  // "Pumpkin": {
  //   displayName: "Pumpkin",
  //   collectionHandle: "garden-pumpkin-seed",
  //   generalDataHandle: "Pumpkin",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  // },
  // "Purslane": {
  //   displayName: "Purslane",
  //   collectionHandle: "purslane-seed-for-planting",
  //   generalDataHandle: "Purslane",
  //   idealHardinessZones: [5, 6, 7, 8, 9, 10, 11, 12, 13]
  // },
  // "Radicchio": {
  //   displayName: "Radicchio",
  //   collectionHandle: "radicchio-garden-seed",
  //   generalDataHandle: "Radicchio",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9]
  // },
  "Radish (spring)": {
    displayName: "Radish (spring)",
    collectionHandle: "garden-radish-seed",
    subTypeParameters: [
      {"name":"Spring","tags":["Spring Radish"],"category":"Type"}
    ],
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10],
    frostHardy: true,
    daysToMaturity: 28,
    directSow: true,
    harvestDuration: () => 7,
    plantingDates: (climateData: ClimateDataOutput) => {
      // Seed 5 weeks prior to last frost date, 5 weeks before first frost.
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 35)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 35)
      return [springPlantingDate, fallPlantingDate]
    }
  },
  "Radish (winter)": {
    displayName: "Radish (winter)",
    collectionHandle: "garden-radish-seed",
    subTypeParameters: [
      {"name":"Winter","tags":["Winter Radish"],"category":"Type"}
    ],
    idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10],
    frostHardy: true,
    daysToMaturity: 60,
    directSow: true,
    harvestDuration: () => 7,
    plantingDates: (climateData: ClimateDataOutput) => {
      // Seed 6-8 weeks before first frost.
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 49)
      return [fallPlantingDate]
    }
  },
  // "Rutabaga": {
  //   displayName: "Rutabaga",
  //   collectionHandle: "rutabaga-garden-seed",
  //   generalDataHandle: "Rutabaga",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8]
  // },
  // "Roselle": {
  //   displayName: "Roselle",
  //   collectionHandle: "roselle",
  //   idealHardinessZones: [8, 9, 10, 11, 12, 13]
  // },
  // "Salsify": {
  //   displayName: "Salsify",
  //   collectionHandle: "salsify-garden-seed",
  //   generalDataHandle: "Salsify",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8]
  // },
  // "Soybean": {
  //   displayName: "Soybean",
  //   collectionHandle: "soybean",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10]
  // },
  "Spinach": {
    displayName: "Spinach",
    collectionHandle: "spinach-planting-seed",
    idealHardinessZones: [2, 3, 4, 5, 6, 7, 8, 9],
    frostHardy: true,
    daysToMaturity: 42, // From handbook: Most varieties of spinach are ready to harvest 35-50 days from sowing.
    directSow: true,
    harvestDuration: () => 28, // chat: can be harvested over a period of 3–5 weeks
    plantingDates: (climateData: ClimateDataOutput, daysToMaturity) => {
      // for best starts, sow directly outdoors 4-6 weeks prior to final spring frost. re-sow until 2-4 weeks before temps consistently reach 75 F. chat says for fall planting: Start sowing seeds 6–8 weeks before your first frost date, and re-sow until 2 weeks before frost.
      const plantingDates = [];
      const springPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate.setDate(springPlantingDate.getDate() - 35)
      plantingDates.push(springPlantingDate)
      const daysUntilLastSpringHarvest = daysUntilSuboptimalTemperature(climateData, {min: 35, max: 75}, springPlantingDate, 'Spinach')
      // If daysUntilLastSpringHarvest fails, do not return a planting date that uses it.
      if (daysUntilLastSpringHarvest !== -1) {
        const lateSpringPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
        lateSpringPlantingDate.setDate(lateSpringPlantingDate.getDate() + daysUntilLastSpringHarvest - daysToMaturity - 28)
        plantingDates.push(lateSpringPlantingDate)
      }
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - 49)
      plantingDates.push(fallPlantingDate)
      const lateFallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      lateFallPlantingDate.setDate(lateFallPlantingDate.getDate() - 30)
      plantingDates.push(lateFallPlantingDate)
      return plantingDates
    }
  },
  // "Strawberry": {
  //   displayName: "Strawberry",
  //   collectionHandle: "garden-strawberry-seed",
  //   generalDataHandle: "Strawberry",
  //   idealHardinessZones: [3, 4, 5, 6, 7, 8, 9, 10]
  // },
  // "Tatsoi (Tat Choy)": {
  //   displayName: "Tatsoi (Tat Choy)",
  //   collectionHandle: "tatsoi-tat-choy-seed",
  //   idealHardinessZones: [5, 6, 7, 8, 9, 10]
  // },
  "Tomato (determinate)": {
    displayName: "Tomato (determinate)",
    collectionHandle: "tomato-vegetable-seed",
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11],
    subTypeParameters: [
      {"name":"Determinate","tags":["Determinate"],"category":"Determinacy"},
    ],
    frostHardy: false,
    daysToMaturity: 75,
    directSow: false,
    harvestDuration: () => 18, // Assuming 2.5 weeks of yield.
    plantingDates: (climateData: ClimateDataOutput, daysToMaturity: number) => {
      // Seed 7 weeks prior to last frost date, transplant after risk of frost (1-2 weeks)
      const earlyPlantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      earlyPlantingDate.setDate(earlyPlantingDate.getDate() + 10)
      const daysUntilLastPossibleHarvest = daysUntilSuboptimalTemperature(climateData, {min: 50}, earlyPlantingDate, 'Tomato (determinate)')
      // If daysUntilLastPossibleHarvest fails, do not return a planting date that uses it.
      if (daysUntilLastPossibleHarvest === -1) {
        return [earlyPlantingDate]
      }
      const harvestDuration = 18
      const latestPlantingDate = new Date(earlyPlantingDate)
      latestPlantingDate.setDate(earlyPlantingDate.getDate() + daysUntilLastPossibleHarvest - daysToMaturity - harvestDuration - 7) // Adding a buffer of 7 days.
      return [earlyPlantingDate, latestPlantingDate]
    }
  },
  "Tomato (indeterminate)": {
    displayName: "Tomato (indeterminate)",
    collectionHandle: "tomato-vegetable-seed",
    subTypeParameters: [
      {"name":"Indeterminate","tags":["Indeterminate"],"category":"Determinacy"},
    ],
    idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11], // TODO should include zones 12 and 13, but I think 13 requires growing in the winter..?
    frostHardy: false,
    daysToMaturity: 75,
    directSow: false,
    harvestDuration: (
      climateData: ClimateDataOutput,
      plantingDate: Date,
      daysToMaturity: number
    ) => {
      const harvestStartDate = new Date(plantingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + daysToMaturity)
      return daysUntilSuboptimalTemperature(climateData, {min: 50}, harvestStartDate, 'Tomato (indeterminate)')
    },
    plantingDates: (climateData: ClimateDataOutput) => {
      // Seed 7 weeks prior to last frost date, transplant after risk of frost (1-2 weeks)
      const plantingDate = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      plantingDate.setDate(plantingDate.getDate() + 10)
      return [plantingDate]
    }
  },
  // "Tomatillo": {
  //   displayName: "Tomatillo",
  //   collectionHandle: "tomatillo",
  //   idealHardinessZones: [5, 6, 7, 8, 9, 10, 11]
  // },
  // "Toraji (Balloon Flower)": {
  //   displayName: "Toraji (Balloon Flower)",
  //   collectionHandle: "toraji",
  //   idealHardinessZones: [6, 7, 8, 9, 10]
  // },
  "Turnip": {
    displayName: "Turnip",
    collectionHandle: "turnip-vegetable-seed",
    idealHardinessZones: [3, 4, 5, 6, 7, 8],
    frostHardy: true,
    daysToMaturity: 50,
    directSow: true,
    harvestDuration: () => 7,
    plantingDates: (climateData: ClimateDataOutput, daysToMaturity: number) => {
      // Seed 3.5 weeks prior to last frost date. For fall, plant so that harvest will be 1-2 weeks after first frost.
      const springPlantingDate1 = new Date(`${climateData.lastSpringFrostDate}, 2025`)
      springPlantingDate1.setDate(springPlantingDate1.getDate() - 35)
      const fallPlantingDate = new Date(`${climateData.firstFallFrostDate}, 2025`)
      fallPlantingDate.setDate(fallPlantingDate.getDate() - daysToMaturity + 10)
      return [springPlantingDate1, fallPlantingDate]
    }
  },
  // "Watermelon": {
  //   displayName: "Watermelon",
  //   collectionHandle: "watermelon-garden-seed",
  //   generalDataHandle: "Watermelon",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11, 12]
  // },
  // "Winter Squash": {
  //   displayName: "Winter Squash",
  //   collectionHandle: "squash-garden-seed",
  //   subTypeParameters: [
  //     {"name":"Winter - Other","tags":["Winter"],"category":"Squash Type"}
  //   ],
  //   generalDataHandle: "Winter Squash",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  // },
  // "Zucchini": {
  //   displayName: "Zucchini",
  //   collectionHandle: "zucchini-vegetable-seed",
  //   generalDataHandle: "Summer Squash",
  //   idealHardinessZones: [4, 5, 6, 7, 8, 9, 10, 11]
  // }
};
