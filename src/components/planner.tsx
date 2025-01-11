import {useEffect, useState} from "react";
import { generateClient } from "aws-amplify/api";
import { Center, Notification, Overlay, Stack } from "@mantine/core"
import { toast } from 'react-toastify';

import { Schema } from "../../amplify/data/resource.ts";

import PlanOverview from "./plan-overview.tsx";
import Quiz from "./quiz/quiz.tsx";
import { ClimateDataOutput, Crop, PlantingScheduleOutput, SeedVariety } from "../types.ts";
import { trueLeafCropTypes, SelectableCropType } from "../helpers/true-leaf-crop-types.ts";
import FakeQuizQuestion from "./quiz/fake-quiz-question.tsx";

const Planner = () => {

  // TODO: wrap these into a useApiRequestHelper()

  const [ climateData, setClimateData ] = useState<ClimateDataOutput>();
  const [ loadingClimateData, setIsLoadingClimateData ] = useState<boolean>(false);

  const [ cropData, setCropData ] = useState<Crop[]>();
  const [ loadingCropData, setIsLoadingCropData ] = useState<boolean>(false);

  const [ plantingSchedule, setPlantingSchedule ] = useState<PlantingScheduleOutput>();
  const [ loadingPlantingSchedule, setLoadingPlantingSchedule ] = useState<boolean>(false);

  const [ scheduleSummary, setScheduleSummary ] = useState<string>();
  const [ loadingScheduleSummary, setLoadingScheduleSummary ] = useState<boolean>(false);

  const [ fatalError, setFatalError ] = useState<string>();

  const [ proceedToPlan, setProceedToPlan ] = useState<boolean>(false);

  const amplifyClient = generateClient<Schema>()

  // TODO wrap these in a try/catch

  const submitZipCode = async (zipCode: string) => {
    setIsLoadingClimateData(true)
    try {
      const result = await amplifyClient.queries.getClimateData({ zipCode: zipCode });
      setClimateData(JSON.parse(result.data!));
    } catch (error) {
      console.error('Error fetching regional climate data: ', error);
      setFatalError(`We couldn't get climate data for your region. Please refresh the page and try again.`);
    } finally {
      setIsLoadingClimateData(false)
    }
  }

  const getAllCropData = async (cropNames: string[]) => {
    setIsLoadingCropData(true)

    // Retrieve SelectableCropType using crop names
    const crops: SelectableCropType[] = cropNames.map(cropName => trueLeafCropTypes[cropName])

    // Get list of varieties for each crop type (TrueLeaf)
    const varietyResponse = await amplifyClient.queries.getTrueLeafSeedData({cropTypes: JSON.stringify(crops)})
    if (varietyResponse.errors || !varietyResponse.data) {
      console.error("Error fetching crop varieties: ", varietyResponse.errors)
      setFatalError("We couldn't get seed varieties for the crops you picked. Please refresh the page and try again.")
      return
    }

    const varietyResults = JSON.parse(varietyResponse.data)
    console.log("varieties: ", varietyResults)

    // TODO: need to see what happens if a general data handle doesn't come back? Or subTypeParameters?
    // Filter out "microgreen" or "sprout"
    const topVarieties: SeedVariety[] = varietyResults.map(variety => {
      const selectedVariety = variety.data.results.find(e =>
        !e.title.toLowerCase().includes('sprout') &&
        !e.title.toLowerCase().includes('microgreen')
      )

      if (!selectedVariety) {
        console.log("Could not find True Seed variety for crop type: ", variety.cropType.displayName)
      }

      return {
        trueSeedTitle: selectedVariety?.title,
        descriptionHtml: selectedVariety?.descriptionHtml,
        storeHandle: selectedVariety?.handle,
        displayName: variety.cropType.displayName,
        collectionHandle: variety.cropType.collectionHandle,
        subTypeParameters: variety.cropType.subTypeParameters,
        generalDataHandle: variety.cropType.generalDataHandle
      }
    })
    console.log("topVarieties: ", topVarieties)

    const fetchPromises = topVarieties.map(async (cropVariety) => {
      try {
        const response = await amplifyClient.queries.getCropDataFromTrueLeafDescription({
          generalDataHandle: cropVariety.generalDataHandle,
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

    console.log("Successful results:", successfulResults);
    console.log("Failed results:", failedResults);

    const cropsWithData = successfulResults.map(result => ({
      name: result.cropVariety!.displayName,
      variety: result.cropVariety!.trueSeedTitle,
      shortDescription: result.data.shortDescription,
      storeHandle: result.cropVariety!.storeHandle,

      seedlingDuration: result.data.seedlingDuration,
      growthDuration: result.data.growthDuration,
      harvestDuration: result.data.harvestDuration,

      frostHardy: result.data.frostHardy,
      guidance: result.data.guidance,

      lowerTempBound: result.data.lowerTempBound,
      upperTempBound: result.data.upperTempBound
    }))

    setCropData(cropsWithData)
    setIsLoadingCropData(false)
  }

  const requestPlantingData = async () => {
    setLoadingPlantingSchedule(true)
    try {
      const plantingScheduleRequestArguments = {
        climateData: JSON.stringify(climateData),
        crops: JSON.stringify(cropData)
      }
      const response =
        await amplifyClient.queries.getPlantingScheduleData(plantingScheduleRequestArguments);
      console.log("requestPlantingData: ", JSON.parse(response.data!))
      setPlantingSchedule(JSON.parse(response.data!));
    } catch (error) {
      console.error('Error fetching planting data:', error);
    } finally {
      setLoadingPlantingSchedule(false);
    }
  };

  const requestScheduleSummary = async () => {
    setLoadingScheduleSummary(true)
    try {
      const scheduleSummaryRequestArguments = {
        climateData: JSON.stringify(climateData!),
        crops: JSON.stringify(cropData)
      }
      const response =
        await amplifyClient.queries.getScheduleSummary(scheduleSummaryRequestArguments);
      console.log("requestScheduleSummary: ", response)
      setScheduleSummary(response.data!);
    } catch (error) {
      console.error('Error fetching schedule summary:', error);
    } finally {
      setLoadingScheduleSummary(false)
    }
  };

  // Request planting data and schedule summary once climate data and crop data return
  useEffect(() => {
    if (
      !!climateData && // Climate data exists
      !!cropData && // Crop data exists
      !loadingPlantingSchedule && // We aren't already loading planting schedule
      !plantingSchedule && // We don't already have a planting schedule
      !loadingScheduleSummary && // We aren't already loading a schedule summary
      !scheduleSummary // We don't already have a schedule summary
    ) {
      requestPlantingData();
      requestScheduleSummary();
    }
  }, [
    climateData,
    cropData,
    requestPlantingData,
    loadingPlantingSchedule,
    plantingSchedule,
    requestScheduleSummary,
    loadingScheduleSummary,
    scheduleSummary
  ]);

  return(
    <>
      {
        cropData === undefined && !loadingCropData &&
        <Quiz getAllCropData={getAllCropData} submitZipCode={submitZipCode} />
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
