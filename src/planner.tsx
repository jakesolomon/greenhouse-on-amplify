import { useState } from "react";
import { generateClient } from "aws-amplify/api";

import {Schema} from "../amplify/data/resource.ts";

import PlanOverview from "./components/plan-overview.tsx";
import Quiz from "./components/quiz/quiz.tsx";
import { ClimateDataOutput, CropDataOutput, PlantingScheduleOutput } from "./types.ts";
import { generateLlmPlantingSchedulePromptFrom } from "./LLM/get-planting-schedule-prompt.ts";

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

  const requestCropData = async (prompt: string) => {
    setIsLoadingCropData(true)
    const result = await amplifyClient.queries.getCropData({ prompt: prompt });
    setCropData(JSON.parse(result.data!));
    setIsLoadingCropData(false)
    await requestPlantingData(JSON.parse(result.data!));
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
          ? <Quiz requestCropData={requestCropData} submitZipCode={submitZipCode} />
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