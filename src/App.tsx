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

import Quiz from './components/quiz/quiz.tsx';
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

  const amplifyClient = generateClient<Schema>()
  const callAmplifyClient = (prompt: string) =>
    amplifyClient.queries.promptLLM({ prompt: prompt })
  const sendUserInputsToLLM = async (prompt: string) => {
    const result = await callAmplifyClient(prompt);
    console.log(result);
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
        <Quiz sendUserInputsToLLM={sendUserInputsToLLM} />
      </AppShell>
    </MantineProvider>
  )
}

export default App
