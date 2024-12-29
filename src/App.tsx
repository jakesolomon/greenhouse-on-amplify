import {useEffect, useState} from "react";
import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
  AppShell,
  Center
} from '@mantine/core';
import '@mantine/core/styles.css';
import { NavigationProgress } from '@mantine/nprogress';
import '@mantine/nprogress/styles.css';
import { generateClient } from "aws-amplify/api"

import { Schema } from "../amplify/data/resource.ts";

import { CropDataOutput, PlantingScheduleOutput } from './types.ts'
import Quiz from './components/quiz/quiz.tsx';
import PlanOverview from './components/plan-overview.tsx';
import LogoText from './assets/logo-text.svg'
import './App.css'
import { generateLlmPlantingSchedulePromptFrom } from './LLM/get-planting-schedule-prompt.ts'
import { mockClimateData } from "./mockClimateData.ts"

function App() {

  const myGreen: MantineColorsTuple = [
    '#f5fae7',
    '#eaf1da',
    '#d5e0b8',
    '#becf94',
    '#abc075',
    '#9fb661',
    '#98b255',
    '#849c45',
    '#748b3a',
    '#63782c'
  ];

  const theme = createTheme({
    colors: {
      myGreen
    }
  });

  // TODO: wrap these into a useApiRequestHelper()
  const [ cropData, setCropData ] = useState<CropDataOutput>();
  const [ loadingCropData, setIsLoadingCropData ] = useState<boolean>(false);

  const [ plantingSchedule, setPlantingSchedule ] = useState<PlantingScheduleOutput>();
  const [ loadingPlantingSchedule, setIsLoadingPlantingSchedule ] = useState<boolean>(false);

  const amplifyClient = generateClient<Schema>()

  useEffect(() => {
    const requestPlantingData = async (cropData: CropDataOutput) => {
      setIsLoadingPlantingSchedule(true)
      try {
        const plantingDataPrompt = generateLlmPlantingSchedulePromptFrom(
          mockClimateData,
          JSON.stringify(cropData!.crops)
        )
        const response =
          await amplifyClient.queries.getPlantingScheduleData({ prompt: plantingDataPrompt });
        setPlantingSchedule(JSON.parse(response.data!));
      } catch (error) {
        console.error('Error fetching planting data:', error);
      }
      setIsLoadingPlantingSchedule(false)
    };

    if (cropData) {
      requestPlantingData(cropData);
    }
  }, [cropData]);

  // TODO wrap these in a try/catch
  const requestCropData = async (prompt: string) => {
    setIsLoadingCropData(true)
    const result = await amplifyClient.queries.getCropData({ prompt: prompt });
    setCropData(JSON.parse(result.data!));
    setIsLoadingCropData(false)
  }


  return (
    <MantineProvider theme={theme}>
      <NavigationProgress/>
      <AppShell header={{ height: 60 }} >
        <AppShell.Header >
          <Center>
            <img src={LogoText} className="header-logo" alt="logo"/>
          </Center>
        </AppShell.Header>
        <AppShell.Main>
          {
            cropData === undefined && !loadingCropData &&
            <Quiz requestCropData={requestCropData} />
          }
          {
            cropData === undefined && loadingCropData &&
            "beep boop processing"
          }
          {
            cropData !== undefined && !loadingCropData &&
            <PlanOverview
              cropData={cropData}
              loadingPlantingSchedule={loadingPlantingSchedule}
              plantingSchedule={plantingSchedule}
            />
          }
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}

export default App
