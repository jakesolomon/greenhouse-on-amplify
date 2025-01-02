import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
  AppShell,
  Center,
  Image
} from '@mantine/core';
import '@mantine/core/styles.css';
import { NavigationProgress } from '@mantine/nprogress';
import '@mantine/nprogress/styles.css';

import LogoText from './assets/logo-text.svg'
import './App.css'
import Planner from "./planner.tsx";
import LandingPage from "./landing-page.tsx";

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
      <Router>
        <NavigationProgress/>
        <AppShell header={{ height: 60 }}>
          <AppShell.Header >
            <Center>
              <Link to={'/'}>
                <Image src={LogoText} className="header-logo" alt="logo" />
              </Link>
            </Center>
          </AppShell.Header>
          <AppShell.Main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/planner" element={<Planner />} />
              </Routes>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  )
}

export default App
