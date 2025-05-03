import {useCallback, useState, useRef} from "react";
import {Link, useLocation, useSearchParams} from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { generateClient } from "aws-amplify/api";
import {
  AppShell, Button,
  Container, Stack, Text, Title, useMantineTheme,
} from "@mantine/core";

import { Schema } from "../../amplify/data/resource.ts";
import Footer from "../components/footer.tsx";

const stripePromise = loadStripe('pk_live_51QqzXAKXcuXgnQQoI7W92SOXf33wFGGvQOBQCsBGo2msG1XlYg7VFI8DVHfjvYYXkJhZnPncxtUnlsYeVcETeq3V00pW4AVNnV');

declare global {
  interface Window {
    dataLayer: Record<string, string>[];
  }
}

const CheckoutV2 = () => {

  const theme = useMantineTheme();

  const [searchParams] = useSearchParams();
  const product =
    searchParams.get("product") === "print"
      ? "print"
      : "digital"

  const location = useLocation();
  const isV2 = location.pathname.includes('v2');
  const hasOptedIn = typeof window !== 'undefined' && localStorage.getItem('userEmail');
  const automaticallyApplyWelcome15 = !!(isV2 && hasOptedIn);

  const amplifyClient = generateClient<Schema>()

  const sessionIdRef = useRef<string | null>(null);
  const [ isComplete, setIsComplete ] = useState(false);

  const handleComplete = async () => {
    if (!sessionIdRef.current) {
      console.error("Session ID is missing!");
      return;
    }
    setIsComplete(true);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: product === 'digital' ? 'digitalPurchaseCompleted' : 'printPurchaseCompleted'
    });

    localStorage.setItem("digitalGuidesRemainingV2", "3")
    if (product === 'print') {
      localStorage.setItem("printGuidesRemainingV2", "1")
    }
    localStorage.setItem("purchaseSessionId", sessionIdRef.current)
  }

  const fetchClientSecret = useCallback(() => {
    const origin = window.location.origin

    return amplifyClient.queries.createCheckoutSession({origin: origin, product: product, automaticallyApplyWelcome15: JSON.stringify(automaticallyApplyWelcome15)})
      .then((result) => JSON.parse(result.data!))
      .then((data) => {
        sessionIdRef.current = data.sessionId;
        return data.clientSecret
      });
  }, []);

  const options = {fetchClientSecret};

  if (isComplete) {
    return (
      <>
        <Container size="md" my="xl" id="purchase-page">
          <Stack gap='sm' align='right'>
            <Title order={2}>Thank You for Your Purchase!</Title>
            {/*<Text><Link to="/planner-v2">Get Started</Link></Text>*/}
            <Text size='lg' fw={500}>Ordered a printed copy?</Text>
            <Text>Once you create your plan you like, you can get it printed and shipped from your Plan Overview.</Text>
            <Text size='lg' fw={500}>Need Help?</Text>
            <Text>If you have any questions about your order, feel free to contact us <Link to="/contact">here</Link>.</Text>
          </Stack>
          <Button
            component={Link}
            to="/planner-v2"
            size="md"
            color={theme.colors.green[7]}
            mt='sm'
          >
            Continue To My Plan
          </Button>
        </Container>
        <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
          <Footer />
        </AppShell.Footer>
      </>
    )
  }

  return (
    <>
      <Container size="xl" mb='xl' >
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{
            ...options,
            onComplete: handleComplete
          }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </Container>
      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )

}

export default CheckoutV2
