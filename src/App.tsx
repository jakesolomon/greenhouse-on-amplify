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
import FaqPage from "./pages/faq-page.tsx";
import AboutPage from "./pages/about-page.tsx";
import BlogPage from "./pages/blog-page.tsx";
import SuccessionPlantingBlog from "./components/blog-posts/succession-planting-blog.tsx";
import CompanionPlantingBlog from "./components/blog-posts/companion-planting-blog.tsx";
import PrivacyPolicyPage from "./pages/privacy-policy-page.tsx";
import CookiesPage from "./pages/cookies-page.tsx";
import CropRotationBlog from "./components/blog-posts/crop-rotation-blog.tsx";

import PlannerV2 from "./pages-v2/planner-v2.tsx";
import LandingPageV2 from "./pages-v2/landing-page-v2.tsx";
import SalesPageV2 from "./pages-v2/sales-page-v2.tsx";
import CheckoutV2 from "./pages-v2/checkout-page-v2.tsx";
import PurchaseV2 from "./pages-v2/purchase-page-v2.tsx";
import ContactPageV2 from "./pages-v2/contact-page-v2.tsx";
import FaqPageV2 from "./pages-v2/faq-page-v2.tsx";
import AboutPageV2 from "./pages-v2/about-page-v2.tsx";
import BlogPageV2 from "./pages-v2/blog-page-v2.tsx";
import PrivacyPolicyPageV2 from "./pages-v2/privacy-policy-page-v2.tsx";
import CookiesPageV2 from "./pages-v2/cookies-page-v2.tsx";
import SuccessionPlantingBlogV2 from "./components/blog-posts-v2/succession-planting-blog-v2.tsx";
import CompanionPlantingBlogV2 from "./components/blog-posts-v2/companion-planting-blog-v2.tsx";
import CropRotationBlogV2 from "./components/blog-posts-v2/crop-rotation-blog-v2.tsx";
import FullPlan from "./components/full-plan/full-plan.tsx";
import EmailDiscountModalV2 from "./components/email-discount-modal-v2.tsx";
import SalesBannerV2 from "./components/sales-banner-v2.tsx";
import {useEffect, useState} from "react";

function App() {

  const theme = createTheme({
    headings: {
      fontFamily: "merriweather, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
    },
  });

  const [navBarIsOpen, { toggle }] = useDisclosure();

  const hasOptedIn = typeof window !== 'undefined' && localStorage.getItem('userEmail');
  const [emailOptInOpened, setEmailOptInOpened] = useState(false);

  useEffect(() => {
    if (!hasOptedIn) {
      const timer = setTimeout(() => setEmailOptInOpened(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [hasOptedIn]);

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

          <SalesBannerV2 onClickOpenModal={() => setEmailOptInOpened(true)} hasOptedIn={!!hasOptedIn} />
          <EmailDiscountModalV2 opened={emailOptInOpened} setOpened={setEmailOptInOpened} />

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
                <Route path="/full-plan" element={<FullPlan />} />

                <Route path="/learn/succession-planting" element={<SuccessionPlantingBlog />} />
                <Route path="/learn/companion-planting" element={<CompanionPlantingBlog />} />
                <Route path="/learn/crop-rotation" element={<CropRotationBlog />} />

                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                {/*Not Found*/}
                <Route path="*" element={<NotFound />} />

                {/* V2 */}
                <Route path="/home-v2" element={<LandingPageV2 />} />
                <Route path="/planner-v2" element={<PlannerV2 />} />
                <Route path="/buy-v2" element={<SalesPageV2 />} />
                <Route path="/checkout-v2" element={<CheckoutV2 />} />
                <Route path="/purchase-v2" element={<PurchaseV2 />} />
                <Route path="/contact-v2" element={<ContactPageV2 />} />
                <Route path="/faq-v2" element={<FaqPageV2 />} />
                <Route path="/about-v2" element={<AboutPageV2 />} />
                <Route path="/learn-v2" element={<BlogPageV2 />} />

                <Route path="/learn/succession-planting-v2" element={<SuccessionPlantingBlogV2 />} />
                <Route path="/learn/companion-planting-v2" element={<CompanionPlantingBlogV2 />} />
                <Route path="/learn/crop-rotation-v2" element={<CropRotationBlogV2 />} />

                <Route path="/privacy-v2" element={<PrivacyPolicyPageV2 />} />
                <Route path="/cookies-v2" element={<CookiesPageV2 />} />
              </Routes>
          </AppShell.Main>
        </AppShell>
      </Router>
    </MantineProvider>
  )
}

export default App
