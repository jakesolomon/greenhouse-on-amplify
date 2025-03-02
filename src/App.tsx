import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {
  createTheme,
  MantineProvider,
  AppShell,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import '@mantine/core/styles.css';
import { ToastContainer } from 'react-toastify';

import './fonts.css'

import './App.css'
import Planner from "./components/planner.tsx";
import LandingPage from "./components/landing-page.tsx";
import SalesPage from "./components/sales-page.tsx";
import Checkout from "./components/checkout-page.tsx";
import Purchase from "./components/purchase-page.tsx";
import ContactPage from "./components/contact-page.tsx";
import Header from "./components/header.tsx";
import NotFound from "./components/404-page.tsx";
import NavBar from "./components/navbar.tsx";
import FaqPage from "./components/faq-page.tsx";

function App() {

  const theme = createTheme({
    headings: {
      fontFamily: "merriweather, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
    },
  });

  const [navBarIsOpen, { toggle }] = useDisclosure();

  return (
    <MantineProvider theme={theme}>
      <ToastContainer autoClose={false} position='top-right'/>
      <Router>
        <AppShell
          header={{ height: 60 }}
          footer={{ height: 60 }}
          navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !navBarIsOpen } }}
        >
          <AppShell.Header >
            <Header navBarIsOpen={navBarIsOpen} toggleNavBar={toggle} />
          </AppShell.Header>

          <NavBar toggleNavBar={toggle} />

          <AppShell.Main style={{minHeight: '75vh'}}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/buy" element={<SalesPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
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
