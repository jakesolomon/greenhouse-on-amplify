import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Center, Notification, Overlay, Stack } from "@mantine/core"
import { toast } from 'react-toastify';

import { Schema } from "../../amplify/data/resource.ts";

import PlanOverview from "./plan-overview.tsx";
import Quiz from "./quiz/quiz.tsx";
import {ClimateDataOutput, Crop, Planting, SeedVariety} from "../types.ts";
import { cropTypes, SelectableCropType } from "../helpers/crop-types.ts";
import { generateOptimalPlantingSchedule } from "../helpers/schedule-helpers.tsx"
import FakeQuizQuestion from "./quiz/fake-quiz-question.tsx";

const Planner = () => {

  // TODO: wrap these into a useApiRequestHelper()

  const [ climateData, setClimateData ] = useState<ClimateDataOutput>();

  const [ cropData, setCropData ] = useState<Crop[]>();
  const [ loadingCropData, setIsLoadingCropData ] = useState<boolean>(false);

  const [ plantingSchedule, setPlantingSchedule ] = useState<Planting[][]>([]);

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
    const optimalPlantingSchedule = generateOptimalPlantingSchedule(cropsWithData)
    console.log(optimalPlantingSchedule)
    setPlantingSchedule(optimalPlantingSchedule)
    setIsLoadingCropData(false)
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
          plantingSchedule={plantingSchedule}
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
