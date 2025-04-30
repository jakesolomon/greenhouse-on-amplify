import {useCallback, useState, useRef, useEffect} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { generateClient } from "aws-amplify/api";
import {
  AppShell,
  Button,
  Center,
  Container,
  Loader,
  Modal,
  Notification,
  Overlay,
  Stack,
  Text, useMantineTheme
} from "@mantine/core";

import { Schema } from "../../amplify/data/resource.ts";
import PurchasePage from "./purchase-page.tsx";
import { Crop, CropDataForFullPlanRequests} from "../types.ts";
import Footer from "../components/footer.tsx";

const stripePromise = loadStripe('pk_live_51QqzXAKXcuXgnQQoI7W92SOXf33wFGGvQOBQCsBGo2msG1XlYg7VFI8DVHfjvYYXkJhZnPncxtUnlsYeVcETeq3V00pW4AVNnV');

declare global {
  interface Window {
    dataLayer: Record<string, string>[];
  }
}

const Checkout = () => {

  const [searchParams] = useSearchParams();
  const product =
    searchParams.get("product") === "print"
      ? "print"
      : "digital"

  const amplifyClient = generateClient<Schema>()

  const theme = useMantineTheme();

  const sessionIdRef = useRef<string | null>(null);
  const [ isComplete, setIsComplete ] = useState(false);
  const [ isGeneratingPlan, setIsGeneratingPlan ] = useState(false);

  const [ fatalError, setFatalError ] = useState<string>();

  const navigate = useNavigate(); // React Router navigation

  // For data we want to parse, we have to check the "undefined" case
  const cropData = localStorage.getItem("cropData");
  const crops = cropData && cropData !== "undefined" ? JSON.parse(cropData) : null;
  const cropsEssential: CropDataForFullPlanRequests[] = crops?.map((crop: Crop) => ({
    name: crop.name,
    variety: crop.variety,
    directSow: crop.directSow,
  }))

  const scheduleSummaryData = localStorage.getItem("scheduleSummary");
  const scheduleSummary = scheduleSummaryData && scheduleSummaryData !== "undefined" ? JSON.parse(scheduleSummaryData) : null;

  // const crops = JSON.parse(localStorage.getItem("cropData")  || `[{"name":"Crops not found","variety":"","shortDescription":""}]`);
  const plantingSchedule = localStorage.getItem("plantingSchedule");
  const gantt = localStorage.getItem("capturedImage")
  // const scheduleSummary: string = localStorage.getItem("scheduleSummary") ? JSON.parse(localStorage.getItem("scheduleSummary")!) : null;
  const climateData = localStorage.getItem("climateData");
  const companionPlantingAdvice = localStorage.getItem("companionPlantingAdvice");

  useEffect(() => {
    if (
      !crops ||
      !cropsEssential ||
      !scheduleSummary ||
      !plantingSchedule ||
      !gantt ||
      !climateData ||
      !companionPlantingAdvice
    ) {
      console.error("Some data is missing.\n\n" +
        `crops: ${crops ? "present" : "not present"} + \n\n` +
        `cropsEssential: ${cropsEssential ? "present" : "not present"} + \n\n` +
        `scheduleSummary: ${scheduleSummary ? "present" : "not present"} + \n\n` +
        `plantingSchedule: ${plantingSchedule ? "present" : "not present"} + \n\n` +
        `gantt: ${gantt ? "present" : "not present"} + \n\n` +
        `climateData: ${climateData ? "present" : "not present"} + \n\n` +
        `companionPlantingAdvice: ${companionPlantingAdvice ? "present" : "not present"}`
      )

      setFatalError("Your Plan Data is Missing")
    }
  }, [
    cropsEssential,
    scheduleSummary,
    plantingSchedule,
    gantt,
    climateData,
    companionPlantingAdvice
  ]);

  const startNewPlan = () => {
    localStorage.removeItem("climateData");
    localStorage.removeItem("cropData");
    localStorage.removeItem("plantingSchedule");
    localStorage.removeItem("scheduleSummary");
    localStorage.removeItem("companionPlantingAdvice");
    localStorage.removeItem("companionPlants");
    localStorage.removeItem("capturedImage");
    localStorage.removeItem("fullPlanIntroExtras");
    localStorage.removeItem("fullPlanTasks");
    localStorage.removeItem("fullPlanSummaries");
    close();
    navigate("/planner"); // Navigate to existing plan
  };

  const handleComplete = async () => {
    if (!sessionIdRef.current) {
      console.error("Session ID is missing!");
      return;
    }
    setIsComplete(true);
    setIsGeneratingPlan(true);

    const cropsStringified = JSON.stringify(crops)

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: product === 'digital' ? 'digitalPurchaseCompleted' : 'printPurchaseCompleted'
    });

    amplifyClient.queries.handleStripePurchase({
      sessionId: sessionIdRef.current!,
      product: product,

      scheduleSummary: scheduleSummary,
      crops: cropsStringified,
      gantt: gantt!,

      plantingSchedule: plantingSchedule!,
      climateData: climateData!,
      companionPlantingAdvice: companionPlantingAdvice!
    })

    localStorage.setItem("purchaseMade", "true")

    setIsGeneratingPlan(false);
  }

  const fetchClientSecret = useCallback(() => {
    const origin = window.location.origin

    return amplifyClient.queries.createCheckoutSession({origin: origin, product: product})
      .then((result) => JSON.parse(result.data!))
      .then((data) => {
        if (!data.sessionId) setFatalError("Could not initialize checkout.")
        sessionIdRef.current = data.sessionId;
        return data.clientSecret
      });
  }, []);

  const options = {fetchClientSecret};

  if (fatalError) {
    return (
      <Overlay blur={2}>
        <Center>
          <Stack justify="center" h="60vh" >
            <Notification
              title={fatalError}
              w="22em"
              color="red"
              withCloseButton={false}
            >
              <Text my='sm' >We couldn’t find your plan details. This may happen if you cleared your storage, switched devices, or haven't created a plan yet. Please generate a new plan before checking out.</Text>
              <Button onClick={startNewPlan} variant="filled">Create New Plan</Button>
            </Notification>
          </Stack>
        </Center>
      </Overlay>
      // <Modal opened={true} title={<b>Your Plan Data is Missing</b>} centered>
      //   <Text>We couldn’t find your plan details. This may happen if you cleared your storage, switched devices, or haven't created a plan yet. Please generate a new plan before checking out.</Text>
      //   <Group justify="right" mt="md">
      //     {/*<Button onClick={viewExistingPlan} variant="light">View My Plan</Button>*/}
      //     <Button onClick={startNewPlan} variant="filled">Create New Plan</Button>
      //   </Group>
      // </Modal>
    )
  }

  if (isGeneratingPlan) {
    return (
      <Modal opened={true} withCloseButton={false} onClose={() => {}} title={<b>Generating your plan<Loader color={theme.black} type="dots" size="sm" ml="0.3rem" style={{ display: 'inline-flex', verticalAlign: 'top'  }}/></b>} centered>
        {/*<Center mb="lg"><Loader size="lg"></Loader></Center>*/}
        <Text id="generating-full-guide-alert">Do not close this window.</Text>
      </Modal>
    )
  }

  if (isComplete) {
    return (
      <>
        <PurchasePage />
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

export default Checkout
