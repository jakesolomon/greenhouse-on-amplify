import { useState } from "react";
import { generateClient } from "aws-amplify/api";

import {Schema} from "../../amplify/data/resource.ts";

import PlanOverview from "./plan-overview.tsx";
import Quiz from "./quiz/quiz.tsx";
import { ClimateDataOutput, CropDataOutput, PlantingScheduleOutput, SeedVariety } from "../types.ts";
import { generateLlmPlantingSchedulePromptFrom } from "../LLM/get-planting-schedule-prompt.ts";
import { trueLeafCropTypes, SelectableCropType } from "../helpers/true-leaf-crop-types.ts";

const Planner = () => {

  // TODO: wrap these into a useApiRequestHelper()

  const [ climateData, setClimateData ] = useState<ClimateDataOutput>();
  const [ loadingClimateData, setIsLoadingClimateData ] = useState<boolean>(false);

  const [ cropData, setCropData ] = useState<CropDataOutput>();
  const [ loadingCropData, setIsLoadingCropData ] = useState<boolean>(false);

  const [ plantingSchedule, setPlantingSchedule ] = useState<PlantingScheduleOutput>();

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
    if (results.errors) {
      console.error("Error fetching crop varieties: ", results.errors)
      setIsLoadingCropData(false)
    }

    const varietyResults = JSON.parse(results.data!)
    console.log("varieties: ", varietyResults)

    // TODO: need to see what happens if a general data handle doesn't come back? Or subTypeParameters?
    const topVarieties: SeedVariety[] = varietyResults.map(varietyResult => ({
      trueSeedTitle: varietyResult.data.results[0].title,
      descriptionHtml: varietyResult.data.results[0].descriptionHtml,
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

      seedlingDuration: result.data.seedlingDuration,
      growthDuration: result.data.growthDuration,
      harvestDuration: result.data.harvestDuration,

      lowerTempBound: result.data.lowerTempBound,
      upperTempBound: result.data.upperTempBound
    }))

    const cropData = {
      summary: "Summy of the plan",
      crops: cropsWithData,
      additionalAdvice: [
        "peepee",
        "poopoo"
      ]
    }

    setCropData(cropData)
    setIsLoadingCropData(false)

    await requestPlantingData(cropData);
  }

  const requestPlantingData = async (cropData: CropDataOutput) => {
    while (loadingClimateData && !climateData) {
      setTimeout('', 2000);
    }
    try {
      const plantingDataPrompt = generateLlmPlantingSchedulePromptFrom(
        JSON.stringify(climateData!),
        JSON.stringify(cropData!.crops)
      )
      const response =
        await amplifyClient.queries.getPlantingScheduleData({ prompt: plantingDataPrompt });
      setPlantingSchedule(JSON.parse(response.data!));
    } catch (error) {
      console.error('Error fetching planting data:', error);
    }
  };

  return(
    <>
      {
        cropData === undefined && !loadingCropData
          ? <Quiz getAllCropData={getAllCropData} submitZipCode={submitZipCode} />
          : <PlanOverview
              cropData={cropData}
              plantingSchedule={plantingSchedule}
              climateData={climateData}
            />
      }
    </>
  )
}

export default Planner
