import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import {
  createTheme,
  MantineProvider,
  AppShell,
  Center,
  Image,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { ToastContainer } from 'react-toastify';

import './fonts.css'

import LogoText from './assets/logo-text.svg'
import './App.css'
import Planner from "./components/planner.tsx";
import LandingPage from "./components/landing-page.tsx";
import SalesPage from "./components/sales-page.tsx";
import Checkout from "./components/checkout-page.tsx";
import Purchase from "./components/purchase-page.tsx";
import ContactPage from "./components/contact-page.tsx";
import NotFound from "./components/404-page.tsx";

function App() {

  const theme = createTheme({
    headings: {
      fontFamily: "merriweather, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
    },
  });

  return (
    <MantineProvider theme={theme}>
      <ToastContainer autoClose={false} position='top-right'/>
      <Router>
        <AppShell header={{ height: 60 }} footer={{ height: 60 }}>
          <AppShell.Header >
            <Center h="100%">
              <Link to={'/'}>
                <Image src={LogoText} className="header-logo" alt="logo" />
              </Link>
            </Center>
          </AppShell.Header>
          <AppShell.Main style={{minHeight: '75vh'}}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/buy" element={<SalesPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/contact" element={<ContactPage />} />
                {/*Not Found*/}
                <Route path="*" element={<NotFound />} />
              </Routes>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  )
}

export default App
