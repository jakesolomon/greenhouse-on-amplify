import { Crop, Planting } from "../types.ts";

const getDaysBetween = (start: Date, end: Date): number => {
  const timeBetween = end.getTime() - start.getTime();
  return Math.round(timeBetween / (1000 * 60 * 60 * 24));
}

const plantingsAreInConflict = (planting1: Planting, planting2: Planting): boolean =>
  !(
    new Date (planting1.harvestEndDate) <= new Date (planting2.transplantingDate) ||
    new Date (planting2.harvestEndDate) <= new Date (planting1.transplantingDate)
  )

const getPlantings = (crop: Crop): Planting[] => {
  return crop.optimalGrowingDateRanges.map(dateRange => {
    return {
      name: crop.name,
      ...dateRange
    }
  })
}

const daysOfPlantingOverlap = (newPlanting: Planting, existingPlanting: Planting): number => {
  const newPlantingStart = new Date(newPlanting.transplantingDate)
  const newPlantingEnd = new Date(newPlanting.harvestEndDate)
  const existingPlantingStart = new Date(existingPlanting.transplantingDate)
  const existingPlantingEnd = new Date(existingPlanting.harvestEndDate)
  let timeBetween;

  if (newPlantingEnd > existingPlantingStart) {
    // Negative number indicates that the new planting should shift earlier
    timeBetween = existingPlantingStart.getTime() - newPlantingEnd.getTime();
    return Math.round(timeBetween / (1000 * 60 * 60 * 24))
  }
  if (newPlantingStart < existingPlantingEnd) {
    // Positive number indicates that the new planting should shift earlier
    timeBetween = existingPlantingEnd.getTime() - newPlantingStart.getTime();
    return Math.round(timeBetween / (1000 * 60 * 60 * 24))
  }
  console.error("Cannot calculate overlap between non-overlapping plantings: ", newPlantingStart, existingPlantingEnd)
  return 0;
}

const fudgePlanting = (planting: Planting, plot: Planting[]): Planting | undefined => {
  let fudgeDays: number;
  let fudgeRangeIsAcceptable = false;
  let fudgedPlanting: Planting;
  let fudgedPlantingConflictsWithPlot = false;
  const unfudgedTransplantingDate = new Date(planting.transplantingDate)
  const unfudgedHarvestStartDate = new Date(planting.harvestStartDate)
  const unfudgedHarvestEndDate = new Date(planting.harvestEndDate)

  // Can't use plot.forEach here because it doesn't support early exit (the `return fudgedPlanting` would only break the loop but not return the value from the overall function).
  for (const existingPlanting of plot) {
    if (plantingsAreInConflict(planting, existingPlanting)) {
      fudgeDays = daysOfPlantingOverlap(planting, existingPlanting)
      fudgeRangeIsAcceptable = Math.abs(fudgeDays) < 10
    }
    if (fudgeDays && fudgeRangeIsAcceptable) {
      // console.log('fudgeRangeIsAcceptable. fudgeDays: ', fudgeDays)
      // create fudgedPlanting
      const fudgedTransplantingDate = new Date(unfudgedTransplantingDate);
      const fudgedHarvestStartDate = new Date(unfudgedHarvestStartDate);
      const fudgedHarvestEndDate = new Date(unfudgedHarvestEndDate);

      fudgedTransplantingDate.setDate(unfudgedTransplantingDate.getDate() + fudgeDays);
      fudgedHarvestStartDate.setDate(unfudgedHarvestStartDate.getDate() + fudgeDays);
      fudgedHarvestEndDate.setDate(unfudgedHarvestEndDate.getDate() + fudgeDays);

      fudgedPlanting = {
        name: planting.name,
        transplantingDate: fudgedTransplantingDate,
        harvestStartDate: fudgedHarvestStartDate,
        harvestEndDate: fudgedHarvestEndDate
      }
      // check that fudged planting doesn't conflict with anything anymore
      fudgedPlantingConflictsWithPlot = plot.some((existingPlanting) => plantingsAreInConflict(fudgedPlanting, existingPlanting))
      // if it does not conflict, return with fudged planting
      // console.log('fudgedPlantingConflictsWithPlot: ', fudgedPlantingConflictsWithPlot)
      if (!fudgedPlantingConflictsWithPlot) {
        return fudgedPlanting;
      }
      // if it does conflict, continue through loop (may need a new boolean for this)
    }
  }
  // If we exit the loop and no fudge planting has been returned, return undefined.
  return;
}

const currentHasMorePlantings = (currentPlantingSchedule: Planting[][], optimalPlantingSchedule: Planting[][]): boolean => {
  if (optimalPlantingSchedule === undefined) {
    return false
  }
  let numberOfPlantingsInCurrentSchedule = 0;
  currentPlantingSchedule.forEach(plot => {
    numberOfPlantingsInCurrentSchedule += plot.length
  })
  let numberOfPlantingsInOptimalSchedule = 0;
  optimalPlantingSchedule.forEach(plot => {
    numberOfPlantingsInOptimalSchedule += plot.length
  })
  return numberOfPlantingsInCurrentSchedule > numberOfPlantingsInOptimalSchedule
}

const addPlanting = (
  crop: Crop,
  plantingIndex: number,
  currentPlantingSchedule: Planting[][],
  plotIndex: number,
  remainingCrops: Crop[],
  optimalPlantingSchedule: Planting[][],
  allCrops: Crop[],
  fudgedPlanting?: Planting
) => {
  if (fudgedPlanting) {
    currentPlantingSchedule[plotIndex].push(fudgedPlanting)
  } else {
    currentPlantingSchedule[plotIndex].push(getPlantings(crop)[plantingIndex])
  }
  if (remainingCrops[0]) {
    remainingCrops.forEach((_crop, index) => {
      // deep clone remaining crops and remove crop
      const newlyRemainingCrops = JSON.parse(JSON.stringify(remainingCrops))
      newlyRemainingCrops.splice(index, 1)
      addCrop(_crop, currentPlantingSchedule, newlyRemainingCrops, optimalPlantingSchedule, allCrops)
    })
  } else {
    currentPlantingSchedule = tryAddingExtraPlantings(currentPlantingSchedule, allCrops) // need to have original list of available plantings.

    const isFirstSchedule = optimalPlantingSchedule.length === 0

    if (isFirstSchedule) {
      optimalPlantingSchedule.push(...currentPlantingSchedule)
      // console.log("I better see this exactly once (per bucket)")
    }
    const hasMorePlantingsAndIsEquallyEfficient = (
      currentPlantingSchedule.length === optimalPlantingSchedule.length &&
      currentHasMorePlantings(currentPlantingSchedule, optimalPlantingSchedule)
    )
    const isMoreEfficient = (currentPlantingSchedule.length < optimalPlantingSchedule.length)
    if (
      hasMorePlantingsAndIsEquallyEfficient ||
      isMoreEfficient
    ) {
      // console.log("FOund one") // Remove all contents and replace with contents of current planting schedule
      optimalPlantingSchedule.splice(0, optimalPlantingSchedule.length);
      optimalPlantingSchedule.push(...currentPlantingSchedule)
    }
  }
}

const addPlantingToNewPlot = (
  crop: Crop,
  plantingIndex: number,
  currentPlantingSchedule: Planting[][],
  remainingCrops: Crop[],
  optimalPlantingSchedule: Planting[][],
  allCrops: Crop[],
) => {
  currentPlantingSchedule.push([getPlantings(crop)[plantingIndex]])

  // Stop right away if we've exceeded the most efficient planting schedules' plot usage
  const isFirstSchedule = optimalPlantingSchedule.length === 0
  const isAlreadyLessEfficient = (currentPlantingSchedule.length > optimalPlantingSchedule.length)

  if (isAlreadyLessEfficient && !isFirstSchedule) {
    return
  }

  if (remainingCrops[0]) {
    remainingCrops.forEach((crop, index) => {
      // deep clone remaining crops and remove crop
      const newlyRemainingCrops = JSON.parse(JSON.stringify(remainingCrops))
      newlyRemainingCrops.splice(index, 1)
      addCrop(crop, currentPlantingSchedule, newlyRemainingCrops, optimalPlantingSchedule, allCrops)
    })
  } else {
    currentPlantingSchedule = tryAddingExtraPlantings(currentPlantingSchedule, allCrops)
    if (isFirstSchedule) {
      optimalPlantingSchedule.push(...currentPlantingSchedule)
      // console.log("I better see this exactly once")
    }
    const hasMorePlantingsAndIsEquallyEfficient = (
      currentPlantingSchedule.length === optimalPlantingSchedule.length &&
      currentHasMorePlantings(currentPlantingSchedule, optimalPlantingSchedule)
    )
    const isMoreEfficient = (currentPlantingSchedule.length < optimalPlantingSchedule.length)

    if (
      hasMorePlantingsAndIsEquallyEfficient ||
      isMoreEfficient
    ) {
      // console.log("FOund one") // Remove all contents and replace with contents of current planting schedule
      optimalPlantingSchedule.splice(0, optimalPlantingSchedule.length);
      optimalPlantingSchedule.push(...currentPlantingSchedule)
      console.log(optimalPlantingSchedule)
    }
  }
}

const cropsSortedByDescendingPlantingDuration = (crops: Crop[]) => {
  const allCropsSortedByPlantingLength = [...crops]
  allCropsSortedByPlantingLength.sort((a, b) => {
    const plantingDurationA = getDaysBetween(
      a.optimalGrowingDateRanges[0].transplantingDate,
      a.optimalGrowingDateRanges[0].harvestEndDate
    )
    const plantingDurationB = getDaysBetween(
      b.optimalGrowingDateRanges[0].transplantingDate,
      b.optimalGrowingDateRanges[0].harvestEndDate
    )
    if (plantingDurationA > plantingDurationB) {
      return -1
    }
    return 1
  })
  return allCropsSortedByPlantingLength
}

const tryAddingExtraPlantings = (
  currentPlantingSchedule: Planting[][],
  allCrops: Crop[],
) => {
  // Prioritize longer planting lengths.
  const sortedCrops = cropsSortedByDescendingPlantingDuration(allCrops)
  let haveAddedCrops = false;
  // Iterate through full list of crops adding at most one of each.
  sortedCrops.forEach(crop => {
    // For all idealGrowingDates in `crop`, find plots with no conflicts and add **one** planting
    const possiblePlantings: Planting[] = getPlantings(crop)
    possiblePlantings.some((planting: Planting, plantingIndex: number) => {
      let plantedThisCrop = false
      currentPlantingSchedule.forEach((plot: Planting[], plotIndex: number) => {
        const conflicts = plot.some(existingPlanting => plantingsAreInConflict(planting, existingPlanting))
        let fudgedPlanting;
        if (!conflicts && !plantedThisCrop) {
          currentPlantingSchedule[plotIndex].push(getPlantings(crop)[plantingIndex]) // add planting to schedule
          haveAddedCrops = true;
          plantedThisCrop = true;
        } else {
          // Deep copy planting
          fudgedPlanting = fudgePlanting(JSON.parse(JSON.stringify(planting)), plot)
          if (fudgedPlanting && !plantedThisCrop) {
            currentPlantingSchedule[plotIndex].push(fudgedPlanting) // add fudged planting to schedule
            haveAddedCrops = true;
            plantedThisCrop = true;
          }
        }
      })
    })
  })
  // If crops have been added, call the function again to see if more can be added still. Otherwise, exit.
  if (haveAddedCrops) {
    return tryAddingExtraPlantings(
      currentPlantingSchedule,
      allCrops
    )
  }
  return currentPlantingSchedule
}

const addCrop = (
  crop: Crop,
  currentPlantingSchedule: Planting[][],
  remainingCrops: Crop[],
  optimalPlantingSchedule: Planting[][],
  allCrops: Crop[],
) => {

  // For all idealGrowingDates in `crop`, find plots with no conflicts and call addPlanting for each one
  const possiblePlantings: Planting[] = getPlantings(crop)
  possiblePlantings.forEach((planting: Planting, plantingIndex: number) => {

    let noSuitableTimeRangeFound = true;
    currentPlantingSchedule.forEach((plot: Planting[], plotIndex: number) => {
      const conflicts = plot.some((existingPlanting) => {
        return plantingsAreInConflict(planting, existingPlanting)
      })
      let fudgedPlanting;
      if (conflicts) {
        // Deep copy planting
        fudgedPlanting = fudgePlanting(JSON.parse(JSON.stringify(planting)), plot)
      }
      if (!conflicts || fudgedPlanting) {
        noSuitableTimeRangeFound = false;
        // Deep clone currentPlantingSchedule
        addPlanting(crop, plantingIndex, JSON.parse(JSON.stringify(currentPlantingSchedule)), plotIndex, remainingCrops, optimalPlantingSchedule, allCrops, fudgedPlanting ? fudgedPlanting : undefined)
      }
    })
    if (noSuitableTimeRangeFound) {
      // Deep clone currentPlantingSchedule
      addPlantingToNewPlot(crop, plantingIndex, JSON.parse(JSON.stringify(currentPlantingSchedule)), remainingCrops, optimalPlantingSchedule, allCrops)
    }
  })
}

const distributeFlexibleAndInflexibleCrops = (crops: Crop[]): Crop[][] => {
  // Separate items into flexible and non-flexible buckets
  const flexibleCrops = crops.filter(crop => crop.optimalGrowingDateRanges.length > 1)
  const inflexibleCrops = crops.filter(crop => crop.optimalGrowingDateRanges.length === 1)

  const totalNumberOfCrops = crops.length;
  const bucketSize1 = Math.floor(totalNumberOfCrops / 2);
  const bucketSize2 = totalNumberOfCrops - bucketSize1;

  const bucket1: Crop[] = [];
  const bucket2: Crop[] = [];

  // Helper function to distribute items into buckets
  function distribute(source: Crop[], target1: Crop[], target2: Crop[], size1: number, size2: number) {
    let i = 0;
    while (i < source.length && (target1.length < size1 || target2.length < size2)) {
      if (target1.length < size1) target1.push(source[i]);
      else if (target2.length < size2) target2.push(source[i]);
      i++;
    }
  }

  // Distribute flexible items
  distribute(flexibleCrops, bucket1, bucket2, bucketSize1, bucketSize2);
  // Distribute non-flexible items
  distribute(inflexibleCrops, bucket1, bucket2, bucketSize1, bucketSize2);

  return [bucket1, bucket2];
}

// Removes any plots that, if removed, we would still have all crops. Only does one plot at a time, and calls itself recursively to keep checking.
const removeRedundantPlots = (_plantingSchedule: Planting[][], numberOfCrops: number) => {
  let removedPlot = false
  _plantingSchedule.some((plot, index) => {
    let cropsInAllOtherPLots =
      _plantingSchedule.filter(otherPlots => _plantingSchedule.indexOf(otherPlots) !== index).flat().map(planting => planting.name)
    cropsInAllOtherPLots = cropsInAllOtherPLots.filter((item, index) => cropsInAllOtherPLots.indexOf(item) === index)
    console.log(cropsInAllOtherPLots.length, " less than ", numberOfCrops, "? ", cropsInAllOtherPLots.length !== numberOfCrops)
    if (cropsInAllOtherPLots.length === numberOfCrops) {
      console.log("   --> not keeping plot: ", plot)
      _plantingSchedule.splice(index, 1)
      removedPlot = true
      return true
    }
  })
  if (removedPlot) { removeRedundantPlots(_plantingSchedule, numberOfCrops) }
}

// const startRecursionBranch = (cropData: Crop[], optimalPlantingSchedule) => {
//   cropData.forEach((crop, index) => {
//     // Deep clone cropData. This method turns dates into strings, so we have to convert them back before creating plantings from them.
//     const newlyRemainingCrops = JSON.parse(JSON.stringify(cropData))
//     newlyRemainingCrops.splice(index, 1)
//     addCrop(crop, [], newlyRemainingCrops, optimalPlantingSchedule, cropData)
//   })
// }

export const generateOptimalPlantingSchedule = (cropData: Crop[]): Planting[][] => {
  console.log("begin generateAllPossiblePlantingSchedules")
  const optimalPlantingSchedule: Planting[][] = []
  const optimalPlantingSchedule2: Planting[][] = []

  // Begin "branching recursion", where we start making x number of schedules where x is the number of crops.
  // Each time a "decision" is made (a crop is selected to add next, or a timing is chosen for that crop) we "branch" again by creating new schedules for each possibility.
  // Send the original plantingSchedules object through all branches, so that at their end, the complete schedule is added to plantingSchedules.

  if (cropData.length < 8) {
    console.log("going oldschoolmode with cropData lenght ", cropData.length)
    cropData.forEach((crop, index) => {
      // Deep clone cropData. This method turns dates into strings, so we have to convert them back before creating plantings from them.
      const newlyRemainingCrops = JSON.parse(JSON.stringify(cropData))
      newlyRemainingCrops.splice(index, 1)
      addCrop(crop, [], newlyRemainingCrops, optimalPlantingSchedule, cropData)
    })
  } else {
    // if we go newschoolmode, still send all cropData to addCrop since that's for the extra plantings
    const [bucket1, bucket2] = distributeFlexibleAndInflexibleCrops(cropData)
    console.log("going newschoolmode with cropData buckets of ", bucket1, ", ", bucket2)
    bucket1.forEach((crop, index) => {
      // Deep clone cropData. This method turns dates into strings, so we have to convert them back before creating plantings from them.
      const newlyRemainingCrops = JSON.parse(JSON.stringify(bucket1))
      newlyRemainingCrops.splice(index, 1)
      addCrop(crop, [], newlyRemainingCrops, optimalPlantingSchedule, cropData)
    })
    bucket2.forEach((crop, index) => {
      // Deep clone cropData. This method turns dates into strings, so we have to convert them back before creating plantings from them.
      const newlyRemainingCrops = JSON.parse(JSON.stringify(bucket2))
      newlyRemainingCrops.splice(index, 1)
      addCrop(crop, [], newlyRemainingCrops, optimalPlantingSchedule2, cropData)
    })
    optimalPlantingSchedule.push(...optimalPlantingSchedule2)
    console.log("before removing dupes: ", optimalPlantingSchedule)
    removeRedundantPlots(optimalPlantingSchedule, cropData.length)
    console.log("after removing dupes: ", optimalPlantingSchedule)
  }

  // Dates got turned into strings during JSON deep cloning. Convert them back to dates.
  const formattedPlantingSchedule = optimalPlantingSchedule.map(plot =>
    plot.map((planting: Planting) => ({
        name: planting.name,
        transplantingDate: new Date(planting.transplantingDate),
        harvestStartDate: new Date(planting.harvestStartDate),
        harvestEndDate: new Date(planting.harvestEndDate),
    }))
  )

  console.log("end generateAllPossiblePlantingSchedules")
  // Sort by planting date
  return formattedPlantingSchedule.map((plot: Planting[]) =>
    plot.sort((a: Planting, b: Planting) => (a.transplantingDate < b.transplantingDate) ? -1 : 1))
}

// *** Dumping ground for algorithm methods once used in Planner.tsx ***
//
//

// const exceededMinimumPlotUsage = (newSchedule: Planting[][], existingSchedules: Planting[][][]): boolean => {
//   const numberOfNewPlots = newSchedule.length
//   return existingSchedules.some(existingSchedule => {
//     const numberOfExistingPlots = existingSchedule.length
//     return numberOfExistingPlots < numberOfNewPlots;
//   })
// }

// const dateRangesAreInConflict = (range1: DateRange, range2: DateRange): boolean =>
//   !(range1.end < range2.start || range2.end < range1.start)
//
// interface DateRange {
//   start: Date,
//   end: Date
// }

// const getOptimalPlantingRanges = (crop: Crop): DateRange[] =>
//   crop.optimalPlantingDates.map(optimalPlantingDate => {
//     const optimalEndDate = new Date(optimalPlantingDate.toString())
//     optimalEndDate.setDate(optimalEndDate.getDate() + crop.growthDuration + crop.harvestDuration)
//     return {
//       start: optimalPlantingDate,
//       end: optimalEndDate
//     }
//   })

// const getOptimalPlantings = (crop: Crop): Planting[] => {
//   // const optimalPlantingRanges = getOptimalPlantingRanges(crop);
//   return crop.optimalGrowingDateRanges.map(dateRange => {
//     // console.log(typeof dateRange[0])
//     // Convert these back to Dates, because deep cloning with JSON converted them into strings.
//     return {
//       name: crop.name,
//       transplantingDate: dateRange.,
//       harvestStartDate: dateRange[1],
//       harvestEndDate: dateRange[2],
//     }
//   })
// }
//


// const normalizeSchedule = (schedule: Planting[][]) => {
//   return schedule.map(plot => {
//     return plot
//       .map(planting => `${planting.name}:${planting.transplantingDate}`) // Create unique crop identifier
//       .sort(); // Sort to ensure order doesn't matter
//   }).sort((a, b) => a.join().localeCompare(b.join())); // Sort outer array based on inner arrays
// };
//
// const thereAreDuplicateSchedules = (newSchedule: Planting[][], existingSchedules: Planting[][][]): boolean => {
//   const normalizedNewSchedule = normalizeSchedule(newSchedule)
//   return existingSchedules.some(existingSchedule => {
//     const normalizedExistingSchedule = normalizeSchedule(existingSchedule)
//     return JSON.stringify(normalizedExistingSchedule) === JSON.stringify(normalizedNewSchedule);
//   })
// }
//
// // Counts schedules as duplicates if the plantings are timed the same, and there are still the same number of plots.
// // This catches "almost dupes" where a planting is in a different plot, but nothing else is changed.
// const thereAreEffectivelyDuplicateOrMoreEfficientSchedules = (newSchedule: Planting[][], existingSchedules: Planting[][][]): boolean => {
//   const normalizedNewSchedule = normalizeSchedule(newSchedule)
//   const numberOfNewPlots = newSchedule.length
//   const flattenedNewSchedule = normalizedNewSchedule.flat().sort()
//   return existingSchedules.some(existingSchedule => {
//     const normalizedExistingSchedule = normalizeSchedule(existingSchedule)
//     const numberOfExistingPlots = existingSchedule.length
//     const flattenedExistingSchedule = normalizedExistingSchedule.flat().sort()
//     return JSON.stringify(flattenedExistingSchedule) === JSON.stringify(flattenedNewSchedule) || numberOfExistingPlots < numberOfNewPlots;
//   })
// }

// Request planting data and schedule summary once climate data and crop data return
//
// useEffect(() => {
//   const requestPlantingData = async () => {
//     setLoadingPlantingSchedule(true)
//     try {
//       const plantingScheduleRequestArguments = {
//         climateData: JSON.stringify(climateData),
//         crops: JSON.stringify(cropData)
//       }
//       const response =
//         await amplifyClient.queries.getPlantingScheduleData(plantingScheduleRequestArguments);
//       console.log("requestPlantingData: ", JSON.parse(response.data!))
//       setPlantingSchedule(JSON.parse(response.data!));
//     } catch (error) {
//       console.error('Error fetching planting data:', error);
//     } finally {
//       setLoadingPlantingSchedule(false);
//     }
//   };
//   if (
//     !!climateData && // Climate data exists
//     !!cropData && // Crop data exists
//     !loadingPlantingSchedule && // We aren't already loading planting schedule
//     !plantingSchedules && // We don't already have a planting schedule
//     !loadingScheduleSummary && // We aren't already loading a schedule summary
//     !scheduleSummary // We don't already have a schedule summary
//   ) {
//     // requestPlantingData();
//     requestScheduleSummary();
//   }
// }, [
//   amplifyClient.queries,
//   climateData,
//   cropData,
//   loadingPlantingSchedule,
//   plantingSchedules,
//   loadingScheduleSummary,
//   scheduleSummary
// ]);
//
// const thereAreMoreEfficientOrEquallyEfficientSchedules = (newSchedule: Planting[][], existingSchedules: Planting[][][]): boolean => {
//   const numberOfNewPlots = newSchedule.length
//   return existingSchedules.some(existingSchedule => {
//     const numberOfExistingPlots = existingSchedule.length
//     return numberOfExistingPlots <= numberOfNewPlots;
//   })
// }
//
// const currentIsMoreEfficientThanExistingSchedule = (currentPlantingSchedule: Planting[][], optimalPlantingSchedule: Planting[][]) => {
//   return currentPlantingSchedule.length < optimalPlantingSchedule.length
// }
//
// const thereAreMoreEfficientSchedules = (newSchedule: Planting[][], existingSchedules: Planting[][][]): boolean => {
//   const numberOfNewPlots = newSchedule.length
//   return existingSchedules.some(existingSchedule => {
//     const numberOfExistingPlots = existingSchedule.length
//     return numberOfExistingPlots < numberOfNewPlots;
//   })
// }


// Counts schedules as duplicates if the plantings are timed the same, and there are still the same number of plots.
// This catches "almost dupes" where a planting is in a different plot, but nothing else is changed.
// const thereAreEffectivelyDuplicateSchedules = (newSchedule: Planting[][], existingSchedules: Planting[][][]): boolean => {
//   const normalizedNewSchedule = normalizeSchedule(newSchedule)
//   const numberOfNewPlots = normalizedNewSchedule.length
//   const flattenedNewSchedule = normalizedNewSchedule.flat().sort()
//   return existingSchedules.some(existingSchedule => {
//     const normalizedExistingSchedule = normalizeSchedule(existingSchedule)
//     const numberOfExistingPlots = normalizedExistingSchedule.length
//     const flattenedExistingSchedule = normalizedExistingSchedule.flat().sort()
//     return JSON.stringify(flattenedExistingSchedule) === JSON.stringify(flattenedNewSchedule) && numberOfExistingPlots === numberOfNewPlots;
//   })
// }