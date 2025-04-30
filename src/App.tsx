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
import '@mantine/carousel/styles.css';

import Planner from "./pages/planner.tsx";
import LandingPage from "./pages/landing-page.tsx";
import SalesPage from "./pages/sales-page.tsx";
import Checkout from "./pages/checkout-page.tsx";
import Purchase from "./pages/purchase-page.tsx";
import ContactPage from "./pages/contact-page.tsx";
import Header from "./components/header.tsx";
import NotFound from "./components/404-page.tsx";
import NavBar from "./components/navbar.tsx";
import FaqPage from "./components/faq-page.tsx";
import AboutPage from "./pages/about-page.tsx";
import BlogPage from "./pages/blog-page.tsx";
import SuccessionPlantingBlog from "./components/blog-posts/succession-planting-blog.tsx";
import CompanionPlantingBlog from "./components/blog-posts/companion-planting-blog.tsx";
import PrivacyPolicyPage from "./pages/privacy-policy-page.tsx";
import CookiesPage from "./pages/cookies-page.tsx";
import CropRotationBlog from "./components/blog-posts/crop-rotation-blog.tsx";

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
                <Route path="/about" element={<AboutPage />} />
                <Route path="/learn" element={<BlogPage />} />

                <Route path="/learn/succession-planting" element={<SuccessionPlantingBlog />} />
                <Route path="/learn/companion-planting" element={<CompanionPlantingBlog />} />
                <Route path="/learn/crop-rotation" element={<CropRotationBlog />} />

                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
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
