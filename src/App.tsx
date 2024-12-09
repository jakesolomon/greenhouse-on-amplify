import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
  AppShell,
  Center
} from '@mantine/core';
import '@mantine/core/styles.css';
import Quiz from './components/quiz.tsx';
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

  return (
    <MantineProvider theme={theme}>
      <AppShell header={{ height: 60 }} >
        <AppShell.Header>
          <Center>
            <img src={LogoText} className="header-logo" alt="logo"/>
          </Center>
        </AppShell.Header>
        <Quiz/>
      </AppShell>
    </MantineProvider>
  )
}

export default App
