import { useState } from "react";
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

import { GardenPlan } from './types.ts'
import Quiz from './components/quiz/quiz.tsx';
import PlanOverview from './components/plan-overview.tsx';
import LogoText from './assets/logo-text.svg'
import './App.css'

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
  const [ data, setData ] = useState<GardenPlan>();
  const [ loading, setIsLoading ] = useState<boolean>(false);

  const amplifyClient = generateClient<Schema>()
  const callAmplifyClient = (prompt: string) =>
    amplifyClient.queries.promptLLM({ prompt: prompt })
  const sendUserInputsToLLM = async (prompt: string) => {
    setIsLoading(true)
    const result = await callAmplifyClient(prompt);
    setData(JSON.parse(result.data!));
    setIsLoading(false)
  }

  return (
    <MantineProvider theme={theme}>
      <NavigationProgress/>
      <AppShell header={{ height: 60 }} >
        <AppShell.Header>
          <Center>
            <img src={LogoText} className="header-logo" alt="logo"/>
          </Center>
        </AppShell.Header>
        {
          data === undefined && !loading &&
          <Quiz sendUserInputsToLLM={sendUserInputsToLLM} />
        }
        {
          data === undefined && loading &&
          "beep boop processing"
        }
        {
          data !== undefined && !loading &&
          <PlanOverview data={data} />
        }
      </AppShell>
    </MantineProvider>
  )
}

export default App
