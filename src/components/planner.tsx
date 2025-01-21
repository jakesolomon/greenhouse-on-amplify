import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Center, Notification, Overlay, Stack } from "@mantine/core"
import { toast } from 'react-toastify';

import { Schema } from "../../amplify/data/resource.ts";

import PlanOverview from "./plan-overview.tsx";
import Quiz from "./quiz/quiz.tsx";
import {ClimateDataOutput, Crop, Planting, SeedVariety} from "../types.ts";
import { cropTypes, SelectableCropType } from "../helpers/crop-types.ts";
import FakeQuizQuestion from "./quiz/fake-quiz-question.tsx";

const Planner = () => {

  // TODO: wrap these into a useApiRequestHelper()

  const [ climateData, setClimateData ] = useState<ClimateDataOutput>();

  const [ cropData, setCropData ] = useState<Crop[]>();
  const [ loadingCropData, setIsLoadingCropData ] = useState<boolean>(false);

  const [ plantingSchedules, setPlantingSchedules ] = useState<Planting[][][]>([]);

  const [ scheduleSummary, setScheduleSummary ] = useState<string>();
  const [ loadingScheduleSummary, setLoadingScheduleSummary ] = useState<boolean>(false);

  const [ fatalError, setFatalError ] = useState<string>();

  const [ proceedToPlan, setProceedToPlan ] = useState<boolean>(false);

  const amplifyClient = generateClient<Schema>()

  const submitZipCode = async (zipCode: string) => {
    try {
      const result = await amplifyClient.queries.getClimateData({ zipCode: zipCode });
      setClimateData(JSON.parse(result.data!));
    } catch (error) {
      console.error('Error fetching regional climate data: ', error);
      setFatalError(`We couldn't get climate data for your region. Please refresh the page and try again.`);
    }
  }

  const getDaysBetween = (start: Date, end: Date): number => {
    const timeBetween = end.getTime() - start.getTime();
    return Math.round(timeBetween / (1000 * 60 * 60 * 24));
  }

  const getAllCropData = async (cropNames: string[], climateData: ClimateDataOutput) => {
    setIsLoadingCropData(true)

    // Retrieve SelectableCropType using crop names
    const crops: SelectableCropType[] = cropNames.map(cropName => cropTypes[cropName])

    // Get list of varieties for each crop type (TrueLeaf)
    const varietyResponse = await amplifyClient.queries.getTrueLeafSeedData({cropTypes: JSON.stringify(crops)})
    if (varietyResponse.errors || !varietyResponse.data) {
      console.error("Error fetching crop varieties: ", varietyResponse.errors)
      setFatalError("We couldn't get seed varieties for the crops you picked. Please refresh the page and try again.")
      return
    }

    const varietyResults = JSON.parse(varietyResponse.data)
    console.log("varieties: ", varietyResults)

    // Filter out "microgreen" or "sprout"
    const topVarieties: SeedVariety[] = varietyResults.map(variety => {
      const selectedVariety = variety.data.results?.find(e =>
        !e.title.toLowerCase().includes('sprout') &&
        !e.title.toLowerCase().includes('microgreen')
      )

      if (!variety.data.results || !selectedVariety) {
        console.error("Could not find True Seed variety for crop type: ", variety.cropType.displayName)
        toast.error(`Could not find True Seed variety for: ${variety.cropType.displayName}`)
      }

      return {
        trueSeedTitle: selectedVariety?.title,
        descriptionHtml: selectedVariety?.descriptionHtml,
        storeHandle: selectedVariety?.handle,
        ...variety.cropType,
      }
    })

    console.log("topVarieties: ", topVarieties)

    const fetchPromises = topVarieties.map(async (cropVariety) => {
      try {
        const response = await amplifyClient.queries.getCropDataFromTrueLeafDescription({
          varietyDescription: cropVariety?.descriptionHtml
        });

        const data = JSON.parse(response.data!)

        // Fail result if returned with an error in response.
        if (data.error) {
          return { cropVariety, error: data.error };
        }

        return { cropVariety, data };
      } catch (error) {
        console.error(`Error fetching data for ${cropVariety.displayName}:`, error);
        return { cropVariety, error: error };
      }
    });

    const allCropData = await Promise.all(fetchPromises);

    const successfulResults = allCropData.filter(result => !result.error);
    const failedResults = allCropData.filter(result => result.error);
    if (successfulResults.length === 0) {
      setFatalError("We couldn't get seed varieties for the crops you picked. Please refresh the page and try again.")
      return;
    }
    if (failedResults.length > 0) {
      const failedCropNames = failedResults.map(result => result.cropVariety.displayName)
      console.error("Failed to extract data from crops: " + failedCropNames.join(", "))
      toast.error(`We couldn't get planting requirements for ${failedCropNames.length === 1 ? "one" : "some"} of the crops you selected: ` + failedCropNames.join(", "))
    }

    console.log("Failed results:", failedResults);

    const cropsWithData: Crop[] = successfulResults.map(result => {

      // The functions for plantingDates (and harvestDuration) get lost in JSON.Stringify, so we have to find the original selected crops.
      const selectedCrop = crops.find(crop => crop.displayName === result.cropVariety.displayName)
      const daysToMaturity = result.cropVariety.daysToMaturity ? result.cropVariety.daysToMaturity : selectedCrop!.daysToMaturity // TODO this is wrong, it's named someting else

      const plantingRanges = selectedCrop!.plantingDates(climateData, daysToMaturity).map(plantingDate => {
        const calculatedHarvestDuration = selectedCrop!.harvestDuration(
          climateData,
          plantingDate,
          selectedCrop!.daysToMaturity
        )
        const harvestStartDate = new Date(plantingDate)
        harvestStartDate.setDate(harvestStartDate.getDate() + selectedCrop!.daysToMaturity)
        const harvestEndDate = new Date(harvestStartDate)
        harvestEndDate.setDate(harvestEndDate.getDate() + calculatedHarvestDuration)
        return {
          transplantingDate: plantingDate,
          harvestStartDate: harvestStartDate,
          harvestEndDate: harvestEndDate,
        }
      })
      return ({
        name: result.cropVariety!.displayName,
        variety: result.cropVariety!.trueSeedTitle,
        shortDescription: result.data.shortDescription,
        storeHandle: result.cropVariety!.storeHandle,

        seedlingDuration: result.data.seedlingDuration,
        growthDuration: result.data.growthDuration,
        harvestDuration: result.data.harvestDuration,

        optimalGrowingDateRanges: plantingRanges,
        frostHardy: result.data.frostHardy,
        guidance: result.data.guidance,

        lowerTempBound: result.data.lowerTempBound,
        upperTempBound: result.data.upperTempBound
      })
    })

    console.log("Successful results (with data):", cropsWithData);

    setCropData(cropsWithData)
    const plantingSchedules = generateAllPossiblePlantingSchedules(cropsWithData)
    console.log(plantingSchedules)
    setPlantingSchedules(plantingSchedules)
    // const plantingSchedulesResponse = await amplifyClient.queries.getManualPlantingSchedule({crops: JSON.stringify(cropsWithData)})
    // setPlantingSchedules(JSON.parse(plantingSchedulesResponse.data!))
    setIsLoadingCropData(false)
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

  const exceededMinimumPlotUsage = (newSchedule: Planting[][], existingSchedules: Planting[][][]): boolean => {
    const numberOfNewPlots = newSchedule.length
    return existingSchedules.some(existingSchedule => {
      const numberOfExistingPlots = existingSchedule.length
      return numberOfExistingPlots < numberOfNewPlots;
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
    optimalPlantingSchedules: Planting[][][],
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
        addCrop(_crop, currentPlantingSchedule, newlyRemainingCrops, optimalPlantingSchedules, allCrops)
      })
    } else {
      currentPlantingSchedule = tryAddingExtraPlantings(currentPlantingSchedule, allCrops) // need to have original list of available plantings.

      // check if current plan has less plantings than existing plans. If so, stop here and do not persist the plan.
      // then check if current plan has more plantings than existing plans. If so, reset all existing plans.
      // // TODO format dates here so that duplication detection works
      // if (!thereAreEffectivelyDuplicateOrMoreEfficientSchedules(currentPlantingSchedule, plantingSchedules)) {
      // Doing this to only manage one schedule at a time
      // if (!thereAreMoreEfficientSchedules(currentPlantingSchedule, plantingSchedules)) {
      //   console.log("would add schedule")
      // }
      // TODO logic for replacing optimal schedule
      // if (!thereAreMoreEfficientOrEquallyEfficientSchedules(currentPlantingSchedule, plantingSchedules)) {
      //   plantingSchedules.splice(0, plantingSchedules.length)
      // }
      // const formattedSchedule = currentPlantingSchedule.map(plot => plot.map((planting: Planting) => ({
      //   name: planting.name,
      //   transplantingDate: new Date(planting.transplantingDate),
      //   harvestStartDate: new Date(planting.harvestStartDate),
      //   harvestEndDate: new Date(planting.harvestEndDate),
      // })))
      // TODO logic for replacing optimal schedule
      // if (
      //   !thereAreMoreEfficientSchedules(formattedSchedule, plantingSchedules) &&
      //   !thereAreEffectivelyDuplicateSchedules(formattedSchedule, plantingSchedules) &&
      //   plantingSchedules.length < 5
      // ) {
      //   plantingSchedules.push(formattedSchedule)
      // }
      const isFirstSchedule = optimalPlantingSchedules.length === 0
      if (isFirstSchedule) {
        optimalPlantingSchedules.push(currentPlantingSchedule)
        console.log("I better see this exactly once")
      }
      const hasMorePlantingsAndIsEquallyEfficient = (
        currentPlantingSchedule.length === optimalPlantingSchedules[0].length &&
        currentHasMorePlantings(currentPlantingSchedule, optimalPlantingSchedules[0])
      )
      const isMoreEfficient = (currentPlantingSchedule.length < optimalPlantingSchedules[0].length)
      if (
        hasMorePlantingsAndIsEquallyEfficient ||
        isMoreEfficient
      ) {
        console.log("FOund one")
        console.log(currentPlantingSchedule.length)
        optimalPlantingSchedules.pop()
        optimalPlantingSchedules.push(currentPlantingSchedule)
      }
    }
  }

  const addPlantingToNewPlot = (
    crop: Crop,
    plantingIndex: number,
    currentPlantingSchedule: Planting[][],
    remainingCrops: Crop[],
    optimalPlantingSchedules: Planting[][][],
    allCrops: Crop[],
  ) => {
    currentPlantingSchedule.push([getPlantings(crop)[plantingIndex]])

    // Stop right away if we've exceeded the most efficient planting schedules' plot usage
    if (exceededMinimumPlotUsage(currentPlantingSchedule, optimalPlantingSchedules) && optimalPlantingSchedules.length !== 0) {
      return
    }
    if (remainingCrops[0]) {
      remainingCrops.forEach((crop, index) => {
        // deep clone remaining crops and remove crop
        const newlyRemainingCrops = JSON.parse(JSON.stringify(remainingCrops))
        newlyRemainingCrops.splice(index, 1)
        addCrop(crop, currentPlantingSchedule, newlyRemainingCrops, optimalPlantingSchedules, allCrops)
      })
    } else {
      currentPlantingSchedule = tryAddingExtraPlantings(currentPlantingSchedule, allCrops)
      const isFirstSchedule = optimalPlantingSchedules.length === 0
      if (isFirstSchedule) {
        optimalPlantingSchedules.push(currentPlantingSchedule)
        console.log("I better see this exactly once")
      }
      const hasMorePlantingsAndIsEquallyEfficient = (
        currentPlantingSchedule.length === optimalPlantingSchedules[0].length &&
        currentHasMorePlantings(currentPlantingSchedule, optimalPlantingSchedules[0])
      )
      const isMoreEfficient = (currentPlantingSchedule.length < optimalPlantingSchedules[0].length)

      if (
        hasMorePlantingsAndIsEquallyEfficient ||
        isMoreEfficient
      ) {
        console.log("FOund one")
        optimalPlantingSchedules.pop()
        optimalPlantingSchedules.push(currentPlantingSchedule)
        console.log(optimalPlantingSchedules)
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
          if (!conflicts) {
            currentPlantingSchedule[plotIndex].push(getPlantings(crop)[plantingIndex]) // add planting to schedule
            haveAddedCrops = true;
            plantedThisCrop = true;
          } else {
            // Deep copy planting
            fudgedPlanting = fudgePlanting(JSON.parse(JSON.stringify(planting)), plot)
            if (fudgedPlanting) {
              currentPlantingSchedule[plotIndex].push(fudgedPlanting) // add fudged planting to schedule
              haveAddedCrops = true;
              plantedThisCrop = true;
            }
          }
        })
        if (plantedThisCrop) {
          return true
        }
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
    optimalPlantingSchedules: Planting[][][],
    allCrops: Crop[],
  ) => {

    // For all idealGrowingDates in `crop`, find plots with no conflicts and call addPlanting for each one
    const possiblePlantings: Planting[] = getPlantings(crop)
    possiblePlantings.forEach((planting: Planting, plantingIndex: number) => {

      let noSuitableTimeRangeFound = true;
      currentPlantingSchedule.forEach((plot: Planting[], plotIndex: number) => {
        plot.forEach((existingPlanting: Planting) => { // TODO is this plot.forEach totally redundant?
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
            addPlanting(crop, plantingIndex, JSON.parse(JSON.stringify(currentPlantingSchedule)), plotIndex, remainingCrops, optimalPlantingSchedules, allCrops, fudgedPlanting ? fudgedPlanting : undefined)
          }
        })
      })
      if (noSuitableTimeRangeFound) {
        // Deep clone currentPlantingSchedule
        addPlantingToNewPlot(crop, plantingIndex, JSON.parse(JSON.stringify(currentPlantingSchedule)), remainingCrops, optimalPlantingSchedules, allCrops)
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

  const removeRedundantPlots = (_plantingSchedules: Planting[][][], numberOfCrops: number) => {
    let removedPlot = false
    _plantingSchedules[0].some((plot, index) => {
      let cropsInAllOtherPLots =
        _plantingSchedules[0].filter(otherPlots => _plantingSchedules[0].indexOf(otherPlots) !== index).flat().map(planting => planting.name)
      cropsInAllOtherPLots = cropsInAllOtherPLots.filter((item, index) => cropsInAllOtherPLots.indexOf(item) === index)
      console.log(cropsInAllOtherPLots.length, " less than ", numberOfCrops, "? ", cropsInAllOtherPLots.length !== numberOfCrops)
      if (cropsInAllOtherPLots.length === numberOfCrops) {
        console.log("   --> not keeping plot: ", plot)
        _plantingSchedules[0].splice(index, 1)
        removedPlot = true
        return true
      }
    })
    if (removedPlot) { removeRedundantPlots(_plantingSchedules, numberOfCrops) }
  }

  const generateAllPossiblePlantingSchedules = (cropData: Crop[]): Planting[][][] => {
    console.log("begin generateAllPossiblePlantingSchedules")
    // const plantingSchedules: Planting[][][] = [];
    const optimalPlantingSchedules: Planting[][][] = []
    const optimalPlantingSchedules2: Planting[][][] = []

    // Begin "branching recursion", where we start making x number of schedules where x is the number of crops.
    // Each time a "decision" is made (a crop is selected to add next, or a timing is chosen for that crop) we "branch" again by creating new schedules for each possibility.
    // Send the original plantingSchedules object through all branches, so that at their end, the complete schedule is added to plantingSchedules.

    // TODO For now, manually split into two groups once we hit 7. Gonna be finnicky to do this dynamically as we hit 12, 18, etc.
    if (cropData.length < 7) {
      console.log("going oldschoolmode with cropData lenght ", cropData.length)
      cropData.forEach((crop, index) => {
        // Deep clone cropData. This method turns dates into strings, so we have to convert them back before creating plantings from them.
        const newlyRemainingCrops = JSON.parse(JSON.stringify(cropData))
        newlyRemainingCrops.splice(index, 1)
        addCrop(crop, [], newlyRemainingCrops, optimalPlantingSchedules, cropData)
      })
    } else {
      // if we go newschoolmode, still send all cropData to addCrop since that's for the extra plantings
      const [bucket1, bucket2] = distributeFlexibleAndInflexibleCrops(cropData)
      console.log("going newschoolmode with cropData buckets of ", bucket1, ", ", bucket2)
      bucket1.forEach((crop, index) => {
        // Deep clone cropData. This method turns dates into strings, so we have to convert them back before creating plantings from them.
        const newlyRemainingCrops = JSON.parse(JSON.stringify(bucket1))
        newlyRemainingCrops.splice(index, 1)
        addCrop(crop, [], newlyRemainingCrops, optimalPlantingSchedules, cropData)
      })
      bucket2.forEach((crop, index) => {
        // Deep clone cropData. This method turns dates into strings, so we have to convert them back before creating plantings from them.
        const newlyRemainingCrops = JSON.parse(JSON.stringify(bucket2))
        newlyRemainingCrops.splice(index, 1)
        addCrop(crop, [], newlyRemainingCrops, optimalPlantingSchedules2, cropData)
      })
      optimalPlantingSchedules[0].push(...optimalPlantingSchedules2[0])
      console.log("before removing dupes: ", optimalPlantingSchedules[0])
      // Remove any plots that, if removed, we would still have all crops.
      removeRedundantPlots(optimalPlantingSchedules, cropData.length)
      console.log("after removing dupes: ", optimalPlantingSchedules[0])
    }

    // Dates got turned into strings during JSON deep cloning. Convert them back to dates.
    const formattedPlantingSchedules = optimalPlantingSchedules.map(plantingSchedule =>
      plantingSchedule.map(plot => plot.map((planting: Planting) => ({
        name: planting.name,
        transplantingDate: new Date(planting.transplantingDate),
        harvestStartDate: new Date(planting.harvestStartDate),
        harvestEndDate: new Date(planting.harvestEndDate),
      })))
    )
    // const formattedPlantingSchedule = optimalPlantingSchedule.map(plot =>
    //   plot.map((planting: Planting) => ({
    //       name: planting.name,
    //       transplantingDate: new Date(planting.transplantingDate),
    //       harvestStartDate: new Date(planting.harvestStartDate),
    //       harvestEndDate: new Date(planting.harvestEndDate),
    //   }))
    // )

    // filter out every plan that has more than the minimum number of plots
    // const numberOfPlots = formattedPlantingSchedules.map(schedule => schedule.length)
    // console.log("Number of plots in each schedule: ", numberOfPlots)
    // const lowestNumberOfPlots = Math.min(...numberOfPlots);
    // const efficientPlantingSchedules =
    //   formattedPlantingSchedules.filter(plan => plan.length === lowestNumberOfPlots)

    console.log("end generateAllPossiblePlantingSchedules")
    // Sort by planting date
    // return efficientPlantingSchedules.map(schedule => schedule.map(plot => plot.sort((a, b) => (a.transplantingDate < b.transplantingDate) ? -1 : 1)))
    return formattedPlantingSchedules.map(schedule => schedule.map(plot => plot.sort((a, b) => (a.transplantingDate < b.transplantingDate) ? -1 : 1)))
    // return formattedPlantingSchedules.map(plot => plot.sort((a, b) => (a.transplantingDate < b.transplantingDate) ? -1 : 1))
  }

    // const requestScheduleSummary = async () => {
    //   setLoadingScheduleSummary(true)
    //   try {
    //     const scheduleSummaryRequestArguments = {
    //       climateData: JSON.stringify(climateData!),
    //       crops: JSON.stringify(cropData)
    //     }
    //     const response =
    //       await amplifyClient.queries.getScheduleSummary(scheduleSummaryRequestArguments);
    //     console.log("requestScheduleSummary: ", response)
    //     setScheduleSummary(response.data!);
    //   } catch (error) {
    //     console.error('Error fetching schedule summary:', error);
    //   } finally {
    //     setLoadingScheduleSummary(false)
    //   }
    // };

  return(
    <>
      {
        cropData === undefined && !loadingCropData &&
        <Quiz getAllCropData={getAllCropData} submitZipCode={submitZipCode} climateData={climateData}/>
      }
      {
        !proceedToPlan && !(cropData === undefined && !loadingCropData) &&
        <FakeQuizQuestion proceed={() => setProceedToPlan(true)} />
      }
      {
        proceedToPlan && !(cropData === undefined && !loadingCropData) &&
        <PlanOverview
          crops={cropData}
          plantingSchedules={plantingSchedules}
          climateData={climateData}
          summary={scheduleSummary}
        />
      }
      { fatalError &&
        <Overlay blur={2}>
          <Center>
            <Stack justify="center" h="60vh" >
              <Notification
                title="Sorry, something went wrong."
                w="22em"
                color="red"
                withCloseButton={false}
              >
                {fatalError}
              </Notification>
            </Stack>
          </Center>
        </Overlay>
      }
    </>
  )
}

export default Planner
