import { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Center, Notification, Overlay, Stack } from "@mantine/core"
import { toast } from 'react-toastify';

import { Schema } from "../../amplify/data/resource.ts";

import PlanOverview from "../components/plan-overview.tsx";
import Quiz from "../components/quiz/quiz.tsx";
import {ClimateDataOutput, Crop, GrowingDateRange, Planting, SeedVariety} from "../types.ts";
import { cropTypes, SelectableCropType } from "../helpers/crop-types.ts";
import { availableCompanionPlants } from "../components/available-companion-plants.ts"

const Planner = () => {

  const worker = new Worker(new URL('../helpers/schedule-helpers.ts', import.meta.url));

  useEffect(() => {
    return () => worker.terminate();
  }, []);

  // TODO: wrap these into a useApiRequestHelper()

  // TODO I should "type guard" my API responses as per chat GPT's example.
  // const isVarietyArray = (data: unknown): data is VarietyArray => {
  //   return Array.isArray(data) && data.every(
  //     (item) =>
  //       typeof item === "object" &&
  //       item !== null &&
  //       "id" in item &&
  //       "name" in item &&
  //       "plantingDate" in item
  //   );
  // };
  //
  // const resultsString = await someApiCall();
  // const parsedResults = JSON.parse(resultsString);
  //
  // if (isVarietyArray(parsedResults)) {
  //   parsedResults.map((variety) => {
  //     console.log(variety.name);
  //   });
  // } else {
  //   console.error("Invalid API response structure");
  // }

  // const [ climateData, setClimateData ] = useState<ClimateDataOutput>();
  const [ climateData, setClimateData ] = useState<ClimateDataOutput | undefined>((): ClimateDataOutput | undefined => {
    const saved = localStorage.getItem("climateData");
    const initialValue = undefined;
    if (!!saved && saved !== "undefined") {
      return JSON.parse(saved)
    } else {
      return initialValue;
    }
  });

  // const [ cropData, setCropData ] = useState<Crop[]>();
  const [ loadingCropData, setIsLoadingCropData ] = useState<boolean>(false);
  const [ cropData, setCropData ] = useState<Crop[] | undefined>((): Crop[] | undefined => {
    const saved = localStorage.getItem("cropData");
    const initialValue = undefined;
    if (!!saved && saved !== "undefined") {
      const parsed: Crop[] = JSON.parse(saved)
      // Reformated after losing dates to json.stringify
      return parsed.map((crop: Crop) => {
        const formattedGrowingDateRanges: GrowingDateRange[] = crop.optimalGrowingDateRanges.map((growingDateRange: GrowingDateRange) => ({
          transplantingDate: new Date(growingDateRange.transplantingDate),
          harvestStartDate: new Date(growingDateRange.harvestStartDate),
          harvestEndDate: new Date(growingDateRange.harvestEndDate),
        }))
        return {
          ...crop,
          optimalGrowingDateRanges: formattedGrowingDateRanges
        }
      })
    } else {
      return initialValue;
    }
  });

  // const [ plantingSchedule, setPlantingSchedule ] = useState<Planting[][]>([]);
  const [ plantingSchedule, setPlantingSchedule ] = useState((): Planting[][] => {
    const saved = localStorage.getItem("plantingSchedule");
    const initialValue: Planting[][] = [];
    if (!!saved && saved !== "undefined") {
      const parsed: Planting[][] = JSON.parse(saved)
      // Reformated after losing dates to json.stringify
      return parsed.map((plot: Planting[]) => {
        return plot.map((planting: Planting) => ({
          name: planting.name,
          transplantingDate: new Date(planting.transplantingDate),
          harvestStartDate: new Date(planting.harvestStartDate),
          harvestEndDate: new Date(planting.harvestEndDate),
        }))
      })
    } else {
      return initialValue;
    }
  });

  // const [ scheduleSummary, setScheduleSummary ] = useState<string>();
  const [ loadingScheduleSummary, setLoadingScheduleSummary ] = useState<'true' | 'false' | 'failed'>('false');
  const [ scheduleSummary, setScheduleSummary ] = useState<string | undefined>((): string | undefined => {
    const saved = localStorage.getItem("scheduleSummary");
    const initialValue = undefined;
    if (!!saved && saved !== "undefined") {
      return JSON.parse(saved)
    } else {
      return initialValue;
    }
  });

  // const [ companionPlantingAdvice , setCompanionPlantingAdvice ] = useState<string[]>();
  const [ loadingCompanionPlantingAdvice , setLoadingCompanionPlantingAdvice ] = useState<'true' | 'false' | 'failed'>('false');
  const [ companionPlantingAdvice, setCompanionPlantingAdvice ] = useState<string[] | undefined>((): string[] | undefined => {
    const saved = localStorage.getItem("companionPlantingAdvice");
    const initialValue = undefined;
    if (!!saved && saved !== "undefined") {
      return JSON.parse(saved)
    } else {
      return initialValue;
    }
  });

  // const [ companionPlants , setCompanionPlants ] = useState<{storeHandle: string, displayName: string}[]>();
  const [ companionPlants, setCompanionPlants ] = useState<{storeHandle: string, displayName: string}[] | undefined>((): {
    storeHandle: string;
    displayName: string
  }[] | undefined => {
    const saved = localStorage.getItem("companionPlants");
    const initialValue = undefined;
    if (!!saved && saved !== "undefined") {
      return JSON.parse(saved)
    } else {
      return initialValue;
    }
  });

  const [ fatalError, setFatalError ] = useState<string>();

  const amplifyClient = generateClient<Schema>()

  // Anytime useState is called to change the value of one of the Plan Overview states, local storage updates as well.
  useEffect(() => {
    localStorage.setItem("climateData", JSON.stringify(climateData));
  }, [climateData]);
  useEffect(() => {
    localStorage.setItem("cropData", JSON.stringify(cropData));
  }, [cropData]);
  useEffect(() => {
    localStorage.setItem("plantingSchedule", JSON.stringify(plantingSchedule));
  }, [plantingSchedule]);
  useEffect(() => {
    localStorage.setItem("scheduleSummary", JSON.stringify(scheduleSummary));
  }, [scheduleSummary]);
  useEffect(() => {
    localStorage.setItem("companionPlantingAdvice", JSON.stringify(companionPlantingAdvice));
  }, [companionPlantingAdvice]);
  useEffect(() => {
    localStorage.setItem("companionPlants", JSON.stringify(companionPlants));
  }, [companionPlants]);

  const startPlanOver = () => {
    setClimateData(undefined)
    setCropData(undefined)
    setPlantingSchedule([])
    setScheduleSummary(undefined)
    setCompanionPlantingAdvice(undefined)
    setCompanionPlants(undefined)
    localStorage.removeItem("capturedImage");
    localStorage.removeItem("fullPlanIntroExtras");
    localStorage.removeItem("fullPlanTasks");
    localStorage.removeItem("fullPlanSummaries");
    localStorage.removeItem("companionPlantingAdvice");
    localStorage.removeItem("companionPlants");
  }

  const submitZipCode = async (zipCode: string) => {
    setClimateData(undefined);
    try {
      const result = await amplifyClient.queries.getClimateData({ zipCode: zipCode });
      // Auth failures (e.g. an expired API key) come back as `errors` with null data rather than throwing
      if (result.errors || !result.data) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }
      const parsedResponse = JSON.parse(result.data);
      if (parsedResponse.error) {
        throw new Error(parsedResponse.error);
      }
      setClimateData(parsedResponse);
    } catch (error) {
      console.error('Error fetching regional climate data: ', error);
      setFatalError(`We couldn't get climate data for your region. Please refresh the page and try again.`);
    }
  }

  const getAllCropData = async (cropNames: string[]) => {
    setIsLoadingCropData(true)

    // Retrieve SelectableCropType using crop names
    const crops: SelectableCropType[] = cropNames.map(cropName => cropTypes[cropName])

    // Get list of varieties for each crop type (TrueLeaf)
    const varietyResponse = await amplifyClient.queries.getTrueLeafSeedData({cropTypes: JSON.stringify(crops), mode: 'crop'})
    if (varietyResponse.errors || !varietyResponse.data) {
      console.error("Error fetching crop varieties: ", varietyResponse.errors)
      setFatalError("We couldn't get seed varieties for the crops you picked. Please refresh the page and try again.")
      return
    }

    const varietyResults = JSON.parse(varietyResponse.data) as { cropType: SelectableCropType, data: { results: Array<{title: string, tags: string[], descriptionHtml: string, handle: string, images: { nodes: {url: string }[] } }>}, error?: string }[]
    console.log("varieties: ", varietyResults)

    // Filter out "microgreen" or "sprout"
    const topVarieties: SeedVariety[] = varietyResults.map(variety => {
      // If it is lettuce, it cannot include any tag with "mix"
      const isLettuce = variety.cropType.displayName === "Lettuce"
      const isBrusselsSprouts = variety.cropType.displayName === "Brussels Sprouts"

      const selectedVariety = variety.data.results?.find(e =>
        (!isLettuce || !e.tags.some(e => e.toLowerCase().includes('mix'))) &&
        (!e.title.toLowerCase().includes('sprout') || isBrusselsSprouts) && // do not include "sprouts" unless it's a brussels sprout
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
        imageUrl: selectedVariety?.images.nodes[0].url,
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
    console.log("Successful results:", successfulResults);

    const cropsWithData: Crop[] = successfulResults.map(result => {

      // The functions for plantingDates (and harvestDuration) get lost in JSON.Stringify, so we have to find the original selected crops.
      const selectedCrop = crops.find(crop => crop.displayName === result.cropVariety.displayName)
      const daysToMaturity = result.data.daysToMaturity ? result.data.daysToMaturity : selectedCrop!.daysToMaturity // if LLM returns daysToMaturity based on description, use it. If not, use generic from crop-types.ts

      const plantingRanges = selectedCrop!.plantingDates(climateData!, daysToMaturity).map(plantingDate => {
        const calculatedHarvestDuration = selectedCrop!.harvestDuration(
          climateData!,
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
        variety: result.data.varietyTitle,
        shortDescription: result.data.shortDescription,
        storeHandle: result.cropVariety!.storeHandle,
        imageUrl: result.cropVariety!.imageUrl,

        // seedlingDuration: result.data.seedlingDuration,
        // growthDuration: result.data.growthDuration,
        // harvestDuration: result.data.harvestDuration,

        optimalGrowingDateRanges: plantingRanges,
        frostHardy: result.cropVariety!.frostHardy,
        directSow: result.cropVariety!.directSow,
        guidance: result.data.guidance,

        lowerTempBound: result.data.lowerTempBound,
        upperTempBound: result.data.upperTempBound
      })
    })

    console.log("Successful results (with data):", cropsWithData);

    setCropData(cropsWithData)
    // Commented out to do this with worker
    // const optimalPlantingSchedule = generateOptimalPlantingSchedule(cropsWithData)
    worker.postMessage(cropsWithData);
    // console.log(optimalPlantingSchedule)
    // setPlantingSchedule(optimalPlantingSchedule)
    // setIsLoadingCropData(false)
  }

  worker.onmessage = (event: MessageEvent<Planting[][]>) => {
    const optimalPlantingSchedule = event.data;
    console.log(optimalPlantingSchedule)
    setPlantingSchedule(optimalPlantingSchedule)
    setIsLoadingCropData(false)
  };

  // Request schedule summary when planting schedule returns
  useEffect(() => {

    const requestScheduleSummary = async () => {
      setLoadingScheduleSummary('true')
      try {
        const plantingScheduleFormattedForLLM = plantingSchedule.map(plot => plot.map(planting => ({
          name: planting.name,
          plantingDate: planting.transplantingDate,
          harvestStartDate: planting.harvestStartDate,
          harvestEndDate: planting.harvestEndDate,
          frostHardy: cropData?.find(crop => crop.name === planting.name)?.frostHardy,
          sowingStrategy: cropData?.find(crop => crop.name === planting.name)?.directSow ? "Direct Sow" : "Transplant seedlings",
        })))
        const scheduleSummaryRequestArguments = {
          climateData: JSON.stringify(climateData!),
          plantingSchedule: JSON.stringify(plantingScheduleFormattedForLLM)
        }
        const response =
          await amplifyClient.queries.getScheduleSummary(scheduleSummaryRequestArguments);
        console.log("requestScheduleSummary: ", response)
        // Fail result if returned with an error in response.
        if (response.errors) {
          setLoadingScheduleSummary('failed')
          console.error("Error fetching scheduleSummary: ", response.errors)
          toast.error(`Unable to generate planting schedule summary.`)
        } else {
          setScheduleSummary(response.data!);
          setLoadingScheduleSummary('false')
        }
      } catch (error) {
        console.error('Error thrown fetching schedule summary:', error);
        setLoadingScheduleSummary('failed')
      }
    };

    if (
      !!climateData && // We have climate data
      !!plantingSchedule[0] && // We have a planting schedule that isn't empty
      loadingScheduleSummary === 'false' && // We aren't already loading a schedule summary
      !scheduleSummary // We don't already have a schedule summary
    ) {
      requestScheduleSummary();
    }
  }, [
    amplifyClient.queries,
    climateData,
    plantingSchedule,
    loadingScheduleSummary,
    scheduleSummary
  ]);

  // Request companion plants when planting schedule returns
  useEffect(() => {

    const getCompanionPlantLinksFromPlantingAdvice = async (companionPlantingAdvice: string[]) => {
      const foundPlants: {displayName: string, collectionHandle: string}[] = []

      companionPlantingAdvice.forEach(text => {
        Object.values(availableCompanionPlants).forEach(plant => {
          const regex = new RegExp(`\\b${plant.displayName}s?\\b`, 'i'); // Word-boundary regex for case-insensitive matching
          if (regex.test(text)) {
            foundPlants.push(plant);
          }
        });
      });
      console.log("foundCompanionPlants: ", foundPlants)

      try {
        const varietyResponse =
          await amplifyClient.queries.getTrueLeafSeedData({cropTypes: JSON.stringify(foundPlants), mode: 'companionPlant'})
        if (varietyResponse.errors || !varietyResponse.data) {
          console.error("Error fetching companionPlant varieties: ", varietyResponse.errors)
          toast.error("We couldn't get seed varieties for companion plants.")
          return
        }

        const varietyResults = JSON.parse(varietyResponse.data) as { cropType: SelectableCropType, data: { results: Array<{title: string, tags: string[], descriptionHtml: string, handle: string, images: { nodes: {url: string }[] } }>}, error?: string }[]
        // const varietyResults = JSON.parse(varietyResponse.data)
        console.log("companion plant varieties: ", varietyResults)

        // Filter out "microgreen" or "sprout" // TODO prefer in stock
        const topVarieties: {storeHandle: string, displayName: string}[] = varietyResults.map(variety => {
          const selectedVariety = variety.data.results?.find(e =>
            !e.title.toLowerCase().includes('sprout') &&
            !e.title.toLowerCase().includes('microgreen')
          )

          if (!variety.data.results || !selectedVariety) {
            console.error("Could not find True Seed variety for companion plant: ", variety.cropType.displayName)
          }
          return {
            storeHandle: selectedVariety!.handle,
            displayName: variety.cropType.displayName,
          }
        })
        console.log("Top companion plant varieties: ", topVarieties)
        setCompanionPlants(topVarieties)
      } catch (error) {
        console.error("Error getting companion plants: ", error)
      }
    }

    const requestCompanionPlants = async () => {
      setLoadingCompanionPlantingAdvice('true')
      try {
        const companionPlantsRequestArguments = {
          climateData: JSON.stringify(climateData!),
          plantingSchedule: JSON.stringify(plantingSchedule)
        }
        const response =
          await amplifyClient.queries.getCompanionPlants(companionPlantsRequestArguments);
        // Fail result if returned with an error in response.
        if (response.errors) {
          setLoadingCompanionPlantingAdvice('failed')
          console.error("Error fetching companionPlants: ", response.errors)
          toast.error(`Unable to find companion plantings info.`)
        } else {
          console.log("requestCompanionPlants: ", JSON.parse(response.data!))
          setCompanionPlantingAdvice(JSON.parse(response.data!).companionPlantingAdvice);
          setLoadingCompanionPlantingAdvice('false')
          await getCompanionPlantLinksFromPlantingAdvice(JSON.parse(response.data!).companionPlantingAdvice)
        }
      } catch (error) {
        console.error('Error thrown fetching companionPlants:', error);
        setLoadingCompanionPlantingAdvice('failed')
      }
    };

    if (
      !!climateData && // We have climate data
      !!plantingSchedule[0] && // We have a planting schedule that isn't empty
      loadingCompanionPlantingAdvice === 'false' && // We aren't already loading companion plants
      !companionPlantingAdvice // We don't already have companion plants
    ) {
      requestCompanionPlants();
    }
  }, [
    amplifyClient.queries,
    climateData,
    plantingSchedule,
    loadingCompanionPlantingAdvice,
    companionPlantingAdvice
  ]);

  return(
    <>
      {
        // Show quiz if we don't have crop data and we aren't loading it
        (!cropData && !loadingCropData) &&
        <Quiz getAllCropData={getAllCropData} submitZipCode={submitZipCode} climateData={climateData}/>
      }
      {
        // Show planner if we have crop data or we're loading it
        (!!cropData || loadingCropData) &&
        <PlanOverview
          crops={cropData}
          plantingSchedule={plantingSchedule}
          climateData={climateData}
          summary={scheduleSummary}
          companionPlantingAdvice={companionPlantingAdvice}
          companionPlants={companionPlants}
          startPlanOver={startPlanOver}
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
