import {useCallback, useState, useRef} from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { generateClient } from "aws-amplify/api";
import { AppShell, Center, Container, Image } from "@mantine/core";
import { pdf, Document, Page, Text, Image as PDFImage } from '@react-pdf/renderer';

import { Schema } from "../../amplify/data/resource.ts";
import { useViewportSize } from "@mantine/hooks";
import Logo from "../assets/logo-no-text.svg";
import Booklet from "../assets/Booklet Mockup cropped lowres.png"
import PurchasePage from "./purchase-page.tsx";

const stripePromise = loadStripe('pk_live_51QqzXAKXcuXgnQQoI7W92SOXf33wFGGvQOBQCsBGo2msG1XlYg7VFI8DVHfjvYYXkJhZnPncxtUnlsYeVcETeq3V00pW4AVNnV');

const Checkout = () => {

  const amplifyClient = generateClient<Schema>()

  const sessionIdRef = useRef<string | null>(null);
  const [ isComplete, setIsComplete ] = useState(false);

  const { width } = useViewportSize();
  const embeddedCheckoutIsVertical = width < 1088

  const MyDocument = () => (
    <Document>
      <Page>
        <Text>Hello, this is your PDF!</Text>
        <PDFImage src={Booklet} />
      </Page>
    </Document>
  );

  const handleComplete = async () => {
    if (!sessionIdRef.current) {
      console.error("Session ID is missing!");
      return;
    }
    setIsComplete(true);

    const blob = await pdf(<MyDocument />).toBlob();

    // Convert Blob to Base64
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      if (typeof reader.result === "string") {
        const base64Pdf = reader.result.split(',')[1]; // Remove the "data:application/pdf;base64," prefix

        amplifyClient.queries.handleStripePurchase({sessionId: sessionIdRef.current!, fileData: base64Pdf})
          .then((result) => JSON.parse(result.data!))
          .then((data) => {
            console.log(data)
          })
      } else {
        console.error("Failed to read PDF as Base64");
      }
    }
  }

  const fetchClientSecret = useCallback(() => {
    const origin = window.location.origin
    return amplifyClient.queries.createCheckoutSession({origin: origin})
      .then((result) => JSON.parse(result.data!))
      .then((data) => {
        console.log(data)
        sessionIdRef.current = data.sessionId;
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
