import {useCallback, useState} from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {generateClient} from "aws-amplify/api";
import {Schema} from "../../amplify/data/resource.ts";
import { AppShell, Center, Container, Image } from "@mantine/core";
import {useViewportSize} from "@mantine/hooks";
import Logo from "../assets/logo-no-text.svg";
import PurchasePage from "./purchase-page.tsx";

const stripePromise = loadStripe('pk_live_51QqzXAKXcuXgnQQoI7W92SOXf33wFGGvQOBQCsBGo2msG1XlYg7VFI8DVHfjvYYXkJhZnPncxtUnlsYeVcETeq3V00pW4AVNnV');

const Checkout = () => {

  const amplifyClient = generateClient<Schema>()

  const [isComplete, setIsComplete] = useState(false);

  const { width } = useViewportSize();
  const embeddedCheckoutIsVertical = width < 1088



  const handleComplete = () => {
    setIsComplete(true);

    // const doc = new PDFDocument;
    // const stream = doc.pipe(blobStream());

    // TODO send request with real values
    amplifyClient.queries.handleStripePurchase({sessionId: '', fileData: ''})
      .then((result) => JSON.parse(result.data!))
      .then((data) => {
        console.log(data)
        // return data.clientSecret
      })
  }

  const fetchClientSecret = useCallback(() => {
    const origin = window.location.origin
    return amplifyClient.queries.createCheckoutSession({origin: origin})
      .then((result) => JSON.parse(result.data!))
      .then((data) => {
        console.log(data)
        return data.clientSecret
      });
  }, []);

  const options = {fetchClientSecret};

  return isComplete ? (
    <>
      <PurchasePage />
      <AppShell.Footer h={125}>
        <Center>
          <Image src={Logo} style={{maxHeight: "125px"}} alt="logo" />
        </Center>
      </AppShell.Footer>
    </>
  ) : (
    <>
      <Container size="xl" mb={embeddedCheckoutIsVertical ? 60 : undefined}>
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
      <AppShell.Footer h={125} >
        <Center>
          <Image src={Logo} style={{maxHeight: "125px"}} alt="logo" />
        </Center>
      </AppShell.Footer>
    </>
  )

}

export default Checkout
