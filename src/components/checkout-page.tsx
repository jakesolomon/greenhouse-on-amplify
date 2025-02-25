import {useCallback, useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
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
  Image,
  Loader,
  Modal,
  Notification,
  Overlay,
  Stack,
  Text, useMantineTheme
} from "@mantine/core";
import { pdf } from '@react-pdf/renderer';

import { Schema } from "../../amplify/data/resource.ts";
import { useViewportSize } from "@mantine/hooks";
import Logo from "../assets/logo-no-text.svg";
import PurchasePage from "./purchase-page.tsx";
import FullPlan from "./full-plan/full-plan.tsx";
import { Crop, CropDataForFullPlanRequests} from "../types.ts";

const stripePromise = loadStripe('pk_live_51QqzXAKXcuXgnQQoI7W92SOXf33wFGGvQOBQCsBGo2msG1XlYg7VFI8DVHfjvYYXkJhZnPncxtUnlsYeVcETeq3V00pW4AVNnV');

const Checkout = () => {

  const amplifyClient = generateClient<Schema>()

  const theme = useMantineTheme();

  const sessionIdRef = useRef<string | null>(null);
  const [ isComplete, setIsComplete ] = useState(false);
  const [ isGeneratingPlan, setIsGeneratingPlan ] = useState(false);

  const [ fatalError, setFatalError ] = useState<string>();

  const navigate = useNavigate(); // React Router navigation

  const { width } = useViewportSize();
  const embeddedCheckoutIsVertical = width < 1088

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

      console.log("cropsEssential: ", cropsEssential);
      console.log("scheduleSummary: ", scheduleSummary);
      console.log("plantingSchedule: ", plantingSchedule);
      console.log("gantt: ", !!gantt);
      console.log("climateData: ", climateData);
      console.log("companionPlantingAdvice: ", companionPlantingAdvice);

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
    localStorage.removeItem("proceedToPlan");
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

    // TODO no failsafe if full plan content API requests fail
    const [fullPlanIntroExtras, fullPlanTasks] = await Promise.all([
      amplifyClient.queries.getFullPlanIntroExtras({
        crops: JSON.stringify(cropsEssential)
      }),
      amplifyClient.queries.getFullPlanTasks({
        crops: JSON.stringify(cropsEssential),
        plantingSchedule: plantingSchedule!,
        climateData: climateData!
      })
    ]);

    const fullPlanIntroExtrasParsed = JSON.parse(fullPlanIntroExtras.data!);
    const fullPlanTasksParsed = JSON.parse(fullPlanTasks.data!);

    const fullPlanSummaries = await amplifyClient.queries.getFullPlanSummaries({
      tasks: fullPlanTasks.data!,
      climateData: climateData!,
      companionPlantingAdvice: companionPlantingAdvice!
    })
    const fullPlanSummariesParsed = JSON.parse(fullPlanSummaries.data!)

    const blob = await pdf(
      <FullPlan
        introExtras={fullPlanIntroExtrasParsed}
        allTasks={fullPlanTasksParsed}
        summaries={fullPlanSummariesParsed}
        scheduleSummary={scheduleSummary}
        crops={crops}
        gantt={gantt!}
      />
    ).toBlob();

    // Convert Blob to Base64
    const reader = new FileReader();
    // TODO !
    reader.readAsDataURL(blob!);
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
    setIsGeneratingPlan(false);
  }

  const fetchClientSecret = useCallback(() => {
    const origin = window.location.origin
    return amplifyClient.queries.createCheckoutSession({origin: origin})
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
        <Text>Do not close this window.</Text>
      </Modal>
    )
  }

  if (isComplete) {
    return (
      <>
        <PurchasePage />
        <AppShell.Footer h={125}>
          <Center>
            <Image src={Logo} style={{maxHeight: "125px"}} alt="logo" />
          </Center>
        </AppShell.Footer>
      </>
    )
  }

  return (
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
