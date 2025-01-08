import { useState } from "react";
import { generateClient } from "aws-amplify/api";
import { Center, Notification, Overlay, Stack } from "@mantine/core"

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

  const [ scheduleSummary, setScheduleSummary ] = useState<string>();

  const [ error, setError ] = useState<string>();

  const [ proceedToPlan, setProceedToPlan ] = useState<boolean>(false);


  const amplifyClient = generateClient<Schema>()

  // TODO wrap these in a try/catch

  const submitZipCode = async (zipCode: string) => {
    setIsLoadingClimateData(true)
    const result = await amplifyClient.queries.getClimateData({ zipCode: zipCode });
    setClimateData(JSON.parse(result.data!));
    setIsLoadingClimateData(false)
  }

  const getAllCropData = async (cropNames: string[]) => {
    setIsLoadingCropData(true)

    // Retrieve SelectableCropType using crop names
    const crops: SelectableCropType[] = cropNames.map(cropName => trueLeafCropTypes[cropName])

    // Get list of varieties for each crop type (TrueLeaf)
    const results = await amplifyClient.queries.getTrueLeafSeedData({cropTypes: JSON.stringify(crops)})
    console.log("results: ", results)
    if (results.errors) {
      console.error("Error fetching crop varieties: ", results.errors)
      setError("We couldn't get seed varieties for the crops you picked. Please refresh the page and try again.")
      setIsLoadingCropData(false)
    }

    const varietyResults = JSON.parse(results.data!)
    console.log("varieties: ", varietyResults)

    // TODO: need to see what happens if a general data handle doesn't come back? Or subTypeParameters?
    const topVarieties: SeedVariety[] = varietyResults.map(varietyResult => ({
      trueSeedTitle: varietyResult.data.results[0].title,
      descriptionHtml: varietyResult.data.results[0].descriptionHtml,
      storeHandle: varietyResult.data.results[0].handle,
      displayName: varietyResult.cropType.displayName,
      collectionHandle: varietyResult.cropType.collectionHandle,
      subTypeParameters: varietyResult.cropType.subTypeParameters,
      generalDataHandle: varietyResult.cropType.generalDataHandle
    }))
    console.log("topVarieties: ", topVarieties)

    const fetchPromises = topVarieties.map(async (cropVariety) => {
      try {
        const response = await amplifyClient.queries.getCropDataFromTrueLeafDescription({
          generalDataHandle: cropVariety.generalDataHandle,
          userMessage: cropVariety.descriptionHtml
        });

        // Causes linting warning: 'throw' of exception caught locally
        // TODO: This is probably not the right way to do this
        if (response.errors) {
          throw new Error(`Failed to fetch data for ${cropVariety.displayName}: ${response.errors[0].message}`);
        }

        const data = JSON.parse(response.data!)
        console.log("data: ", data);
        return { cropVariety, data };
      } catch (error) {
        console.error(`Error fetching data for ${cropVariety.displayName}:`, error);
        setError("We couldn't get seed varieties for the crops you picked. Please refresh the page and try again.")
        return { error: error };
      }
    });

    const allCropData = await Promise.all(fetchPromises);

    const successfulResults = allCropData.filter(result => !result.error);
    const failedResults = allCropData.filter(result => result.error);

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

    console.log("cropsWithData: ", cropsWithData)

    await requestPlantingData(cropsWithData);
    await requestScheduleSummary(cropsWithData);
  }

  const requestPlantingData = async (cropData: Crop[]) => {
    while (loadingClimateData && !climateData) {
      setTimeout('', 2000);
    }
    try {
      const plantingScheduleRequestArguments = {
        climateData: JSON.stringify(climateData!),
        crops: JSON.stringify(cropData)
      }
      const response =
        await amplifyClient.queries.getPlantingScheduleData(plantingScheduleRequestArguments);
      console.log(JSON.parse(response.data!))
      setPlantingSchedule(JSON.parse(response.data!));
    } catch (error) {
      console.error('Error fetching planting data:', error);
    }
  };

  const requestScheduleSummary = async (cropData: Crop[]) => {
    while (loadingClimateData && !climateData) {
      setTimeout('', 2000);
    }
    try {
      const scheduleSummaryRequestArguments = {
        climateData: JSON.stringify(climateData!),
        crops: JSON.stringify(cropData)
      }
      const response =
        await amplifyClient.queries.getScheduleSummary(scheduleSummaryRequestArguments);
      console.log(response)
      setScheduleSummary(response.data!);
    } catch (error) {
      console.error('Error fetching schedule summary:', error);
    }
  };

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
      { error &&
        <Overlay blur={2}>
          <Center>
            <Stack justify="center" h="60vh" >
              <Notification
                title="Sorry, something went wrong."
                w="22em"
                color="red"
                withCloseButton={false}
              >
                {error}
              </Notification>
            </Stack>
          </Center>
        </Overlay>
      }
    </>
  )
}

export default Planner
