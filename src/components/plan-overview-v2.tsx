import {
  Text,
  Container,
  Accordion,
  Skeleton,
  Title,
  AppShell,
  useMantineTheme,
  Anchor,
  Alert,
  Box,
  BackgroundImage, Grid, Card, AspectRatio, Image, List, ListItem, Button, Modal, Group, Stack,
} from '@mantine/core';
import {useDisclosure, useViewportSize} from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';
import {useEffect, useState} from "react";

import {
  ClimateDataOutput,
  Crop,
  Planting
} from '../types.ts'

import GanttChart from "./gantt-chart.tsx";
import ClimateChart from "./climate-chart.tsx";
import CropList from "./crop-list.tsx";

import "./plan-overview.css";
import Footer from "./footer.tsx";
import Garden3 from "../assets/garden-3-big.png";
import DigitalMockup from "../assets/digital-plan-mockup.png";
import BookletMockupLeft from "../assets/booklet-mockup-left.png";
import {getLocalStorageNumber} from "../helpers/getLocalStorageNumber.ts";
import {generateClient} from "aws-amplify/api";
import {Schema} from "../../amplify/data/resource.ts";

interface DataDisplayProps {
  crops?: Crop[];
  plantingSchedule: Planting[][];
  climateData?: ClimateDataOutput;
  summary?: string;
  companionPlantingAdvice?: string[],
  companionPlants?: {displayName: string, storeHandle: string}[]
  startPlanOver: () => void
}

const PlanOverviewV2 = (props: DataDisplayProps) => {
  const { crops, plantingSchedule, climateData, summary, companionPlantingAdvice, companionPlants, startPlanOver } = props;

  // Scroll to top on first render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [digitalOpened, { open: openDigital, close: closeDigital }] = useDisclosure(false);
  const [printOpened, { open: openPrint, close: closePrint }] = useDisclosure(false);

  const amplifyClient = generateClient<Schema>()

  const plantingScheduleLoading = plantingSchedule.length === 0;
  const noSuccessionPlanting =
    !plantingScheduleLoading && plantingSchedule?.every((p) => p.length === 1);

  const [ showRunningBehindAlert, setShowRunningBehindAlert ] = useState<boolean>(true)

  const [ showNoSuccessionPlantingAlert, setShowNoSuccessionPlantingAlert ] = useState<boolean>(false)

  // noSuccessionPlanting will be false on first render, since plantingSchedule is not sent yet.
  // Checks for updates and then setShowNoSuccessionPlantingAlert.
  useEffect(() => {
    if (plantingSchedule.length > 0) {
      setShowNoSuccessionPlantingAlert(noSuccessionPlanting);
    }
  }, [plantingSchedule, noSuccessionPlanting]);

  const plantingCounts = plantingSchedule.reduce((acc, row) => {
    return row.reduce((innerAcc, planting) => {
      innerAcc[planting.name] = (innerAcc[planting.name] || 0) + 1;
      return innerAcc;
    }, acc);
  }, {} as Record<string, number>);
  const plantingScheduleIsRepetitive = Object.values(plantingCounts).some(count => count > 3 && count > plantingSchedule.length*3/5);

  const [ showRepetitivePlantingsAlert, setShowRepetitivePlantingsAlert ] = useState<boolean>(false)

  // plantingScheduleIsRepetitive will be false on first render, since plantingSchedule is not sent yet.
  // Checks for updates and then setShowRepetitivePlantingsAlert.
  useEffect(() => {
    if (plantingSchedule.length > 0) {
      setShowRepetitivePlantingsAlert(plantingScheduleIsRepetitive);
    }
  }, [plantingSchedule, plantingScheduleIsRepetitive]);

  const [ showLoadingTimeWarning, setShowLoadingTimeWarning ] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setShowLoadingTimeWarning(true)
    }, 7000);
  }, []);

  const { width } = useViewportSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const theme = useMantineTheme();
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.md

  // Extract growing tips. Remove any sentence that refers to crop rotation.
  const growingTips = crops?.map(crop => ({
    name: crop.name,
    content: crop.guidance.split(".").filter(sentence => !sentence.includes("rotat")).map(sentence => sentence + ".").slice(0, -1).join(" "),
  }))

  const skeletonParagraph =
    <>
      <Skeleton height={10} radius="xl" mb="sm" />
      <Skeleton height={10} mt={6} radius="xl" mb="sm" />
      <Skeleton height={10} mt={6} radius="xl" mb="sm" />
      <Skeleton height={10} mt={6} radius="xl" mb="sm" />
      {
        isSmallScreen &&
        <>
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
          <Skeleton height={10} mt={6} radius="xl" mb="sm" />
        </>
      }
      <Skeleton height={10} mt={6} width="70%" radius="xl" mb="sm" />
    </>

  const infoIcon = <IconInfoCircle />;

  const replaceCompanionPlantsWithLinks = (advice: string, plantsWithLinks: {displayName: string, storeHandle: string}[]) => {
    // Create a map for faster lookup of storeHandles by plant name
    const plantMap: Record<string, string> = plantsWithLinks.reduce((map, plant) => {
      map[plant.displayName.toLowerCase()] = plant.storeHandle;
      return map;
    }, {} as Record<string, string>);

    // Generate a regex to match all plant names
    const plantNames = plantsWithLinks.map(plant => plant.displayName);
    const regex = new RegExp(`\\b(${plantNames.map(name => `${name}s?`).join('|')})\\b`, 'i');

    // Track which plants have already been linked
    const linkedPlants = new Set<string>();

    // Replace plant names with React links
    return advice.split(regex).map((chunk, index) => {
      const normalizedChunk = chunk.toLowerCase();
      // Check for uppercase, lowercase, and remove last letter from each (in case plural).
      if ((plantMap[chunk] || plantMap[normalizedChunk]) && !linkedPlants.has(normalizedChunk)) {
        linkedPlants.add(normalizedChunk); // Mark this plant as linked
        return (
          <a key={index} href={`https://trueleafmarket.com/products/${plantMap[normalizedChunk]}`} target="_blank" rel="noopener noreferrer">
            {chunk}
          </a>
        );
      }
      if ((plantMap[chunk.slice(0, chunk.length -1)] || plantMap[normalizedChunk.slice(0, normalizedChunk.length -1)]) && !linkedPlants.has(normalizedChunk)) {
        linkedPlants.add(normalizedChunk); // Mark this plant as linked
        return (
          <a key={index} href={`https://trueleafmarket.com/products/${plantMap[normalizedChunk.slice(0, normalizedChunk.length -1)]}`} target="_blank" rel="noopener noreferrer">
            {chunk}
          </a>
        );
      }
      return chunk;
    });
  }

  // const moreInfoCards = (
  //   <>
  //     <Card my='lg' p='lg' shadow="sm" withBorder style={{borderWidth: "1px"}} radius="md">
  //       <Title order={2} mb='sm'>
  //         🥦 Your Crops
  //       </Title>
  //       <Text size="sm" c="dimmed" mb="sm">We've selected the following best-selling varieties for each of the crops you selected, supplied by True Leaf Market, a leading seed supplier. The timing of your plan is based on the time to maturity for each of these varieties. </Text>
  //       <CropList crops={crops}/>
  //     </Card>
  //
  //     <Grid>
  //       <Grid.Col py={0} span={{base: 12, md: 6}}>
  //         <Card my='lg' p='lg' withBorder shadow="sm">
  //           <Title order={2} mb='sm'>
  //             📝 Growing Tips
  //           </Title>
  //           {
  //             growingTips
  //               ? growingTips.map((advice, index) =>
  //                 <Text key={index} mb="sm"><b>{advice.name}:</b> {advice.content}</Text>)
  //               : <>
  //                 <Skeleton height={10} width="70%" mb={14} radius="xl"/>
  //                 <Skeleton height={10} width="80%" mb={14} radius="xl"/>
  //                 <Skeleton height={10} width="75%" mb={14} radius="xl"/>
  //                 <Skeleton height={10} width="70%" mb={14} radius="xl"/>
  //                 <Skeleton height={10} width="80%" mb={14} radius="xl"/>
  //               </>
  //           }
  //         </Card>
  //       </Grid.Col>
  //       <Grid.Col py={0} span={{base: 12, md: 6}}>
  //         <Card my='lg' p='lg' withBorder shadow="sm">
  //           <Title order={2} mb='sm'>
  //             🤝 Companion Plants
  //           </Title>
  //           <Text size="sm" c="dimmed" mb="sm">Companion planting involves pairing plants that benefit each other. By planting your crops together with certain flowers or herbs, you can boost your garden's health and productivity. It’s a natural way to improve growth and protect against pests.</Text>
  //           {
  //             companionPlantingAdvice && companionPlants
  //               ? companionPlantingAdvice.map((advice, index) =>
  //                 <Text key={index} mb="sm"><b>{advice.split("***")[0]}</b> {replaceCompanionPlantsWithLinks(advice.split("***")[1], companionPlants)}</Text>)
  //               : <>
  //                 <Skeleton height={10} width="70%" mb={14} radius="xl"/>
  //                 <Skeleton height={10} width="80%" mb={14} radius="xl"/>
  //                 <Skeleton height={10} width="75%" mb={14} radius="xl"/>
  //                 <Skeleton height={10} width="70%" mb={14} radius="xl"/>
  //                 <Skeleton height={10} width="80%" mb={14} radius="xl"/>
  //               </>
  //           }
  //         </Card>
  //       </Grid.Col>
  //     </Grid>
  //     <Card my='lg' p='lg' withBorder shadow="sm">
  //       <Title order={2} mb='sm'>
  //         ☀️ Climate Predictions
  //       </Title>
  //       {
  //         climateData &&
  //         <ClimateChart data={climateData}/>
  //       }
  //     </Card>
  //   </>
  // )

  const moreInfoAccordion = (
    <>
      <Accordion mt="md" transitionDuration={350} variant="contained">
        <Accordion.Item value="crops">
          <Accordion.Control icon="🥦">Your Crops</Accordion.Control>
          <Accordion.Panel>
            <CropList crops={crops}/>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="additionalAdvice">
          <Accordion.Control icon="📝">Growing Tips</Accordion.Control>
          <Accordion.Panel style={{position: "relative", overflow: "hidden"}} >
            {
              growingTips
                ? growingTips.map((advice, index) =>
                  <Text key={index} mb="sm"><b>{advice.name}:</b> {advice.content}</Text>)
                : <>
                  <Skeleton height={10} width="70%" mb={14} radius="xl"/>
                  <Skeleton height={10} width="80%" mb={14} radius="xl"/>
                  <Skeleton height={10} width="75%" mb={14} radius="xl"/>
                  <Skeleton height={10} width="70%" mb={14} radius="xl"/>
                  <Skeleton height={10} width="80%" mb={14} radius="xl"/>
                </>
            }
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="companionPlants">
          <Accordion.Control icon="🤝">Companion Plants</Accordion.Control>
          <Accordion.Panel style={{position: "relative", overflow: "hidden"}} >

            <Text size="sm" c="dimmed" mb="sm">Companion planting involves pairing plants that benefit each other. By planting your crops together with certain flowers or herbs, you can boost your garden's health and productivity. It’s a natural way to improve growth and protect against pests.</Text>
            {
              companionPlantingAdvice && companionPlants
                ? companionPlantingAdvice.map((advice, index) =>
                  <Text key={index} mb="sm"><b>{advice.split("***")[0]}</b> {replaceCompanionPlantsWithLinks(advice.split("***")[1], companionPlants)}</Text>)
                : <>
                  <Skeleton height={10} width="70%" mb={14} radius="xl"/>
                  <Skeleton height={10} width="80%" mb={14} radius="xl"/>
                  <Skeleton height={10} width="75%" mb={14} radius="xl"/>
                  <Skeleton height={10} width="70%" mb={14} radius="xl"/>
                  <Skeleton height={10} width="80%" mb={14} radius="xl"/>
                </>
            }
          </Accordion.Panel>
        </Accordion.Item>
        {
          climateData &&
          <Accordion.Item value="climateData">
            <Accordion.Control icon="☀️">Climate Predictions</Accordion.Control>
            <Accordion.Panel>
              <ClimateChart data={climateData}/>
            </Accordion.Panel>
          </Accordion.Item>
        }
      </Accordion>
    </>
  )

  function DigitalGuideModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
    const [remaining, setRemaining] = useState(() => getLocalStorageNumber('digitalGuidesRemainingV2'));
    const [modalState, setModalState] = useState<'ready' | 'loading' | 'success' | 'failed'>('ready')

    const sessionId = localStorage.getItem("purchaseSessionId");
    const gantt = localStorage.getItem("capturedImage");

    if (gantt === null) {
      return (
        <Modal opened={opened} onClose={onClose} title={<Title order={3}>Generate Monthly Guide</Title>} centered>
          <Text>
            Some data was unable to be retrieved. Please refresh the page and try again.
          </Text>
        </Modal>
      )
    }

    if (sessionId === null) {
      return (
        <Modal opened={opened} onClose={onClose} title={<Title order={3}>Generate Monthly Guide</Title>} centered>
          <Text>
            Your purchase was unable to be found. Please refresh the page or contact customer service.
          </Text>
        </Modal>
      )
    }

    const handleGenerate = async () => {
      const newCount = remaining! - 1;
      localStorage.setItem('digitalGuidesRemainingV2', newCount.toString());
      setModalState('loading')

      // Call backend to generate digital guide
      await amplifyClient.queries.fulfillV2Guide({
        sessionId: sessionId,
        product: "digital",

        scheduleSummary: summary!,
        crops: JSON.stringify(crops),
        gantt: gantt!,

        plantingSchedule: JSON.stringify(plantingSchedule),
        climateData: JSON.stringify(climateData),
        companionPlantingAdvice: JSON.stringify(companionPlantingAdvice)
      })
        .then(() => setModalState('success'))
        .then(() => setRemaining(newCount))
        .catch(() => setModalState('failed'))
    };

    if (modalState === 'success') {
      return (
        <Modal opened={opened} onClose={onClose} title={<Title order={3}>Generate Monthly Guide</Title>} centered>
          <Text mb='sm'>
            Your guide is being generated! This usually takes a minute or two.
          </Text>
          <Text mb='sm'>
            You should receive an email (to the address you used at checkout) with a download link. If you don't, check your spam folder, or contact customer service.
          </Text>
        </Modal>
      )
    }

    if (modalState === 'failed') {
      return (
        <Modal opened={opened} onClose={onClose} title={<Title order={3}>Generate Monthly Guide</Title>} centered>
          <Text>
            Something went wrong. Please reload the page and try again, or contact customer service.
          </Text>
        </Modal>
      )
    }

    if (remaining === 0 || remaining === undefined) {
      return (
        <Modal opened={opened} onClose={onClose} title={<Title order={3}>Generate Monthly Guide</Title>} centered>
          <Text>
            Looks like you've generated all three of the digital guides included with your purchase. Purchase three more for 14.99?
          </Text>
          <Group mt="md" justify="right">
            <Button variant="default" onClick={onClose}>Cancel</Button>
            {/*<Button color={theme.colors.green[7]}>Continue</Button>*/}
            <Button color={theme.colors.green[7]} disabled>This Feature Not Available</Button>
          </Group>
        </Modal>
      )
    }

    return (
      <Modal opened={opened} onClose={onClose} title={<Title order={3}>Generate Monthly Guide</Title>} centered>
        <Stack gap='sm'>
          <Text>
            Your Monthly Guide will be generated using your current active Plan Overview.
          </Text>
          <Text size='sm' c='dimmed'>
            You can generate up to 3 guides from your purchase. {remaining} remaining.
          </Text>
        </Stack>
        <Group mt="md" justify="right">
          <Button variant='light' color={theme.colors.green[7]} onClick={onClose}>Cancel</Button>
          <Button onClick={handleGenerate} color={theme.colors.green[7]} loading={modalState === 'loading'}>
            Generate Guide
          </Button>
        </Group>
      </Modal>
    );
  }

  function PrintGuideModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
    // const navigate = useNavigate();
    const [remaining, setRemaining] = useState(() => getLocalStorageNumber('printGuidesRemainingV2'));
    const [modalState, setModalState] = useState<'ready' | 'loading' | 'success' | 'failed'>('ready')

    const sessionId = localStorage.getItem("purchaseSessionId");
    const gantt = localStorage.getItem("capturedImage");

    if (gantt === null) {
      return (
        <Modal opened={opened} onClose={onClose} title={<Title order={3}>Print Monthly Guide</Title>} centered>
          <Text>
            Some data was unable to be retrieved. Please refresh the page and try again.
          </Text>
        </Modal>
      )
    }

    if (sessionId === null) {
      return (
        <Modal opened={opened} onClose={onClose} title={<Title order={3}>Print Monthly Guide</Title>} centered>
          <Text>
            Your purchase was unable to be found. Please refresh the page or contact customer service.
          </Text>
        </Modal>
      )
    }

    const handleGenerate = async () => {
      localStorage.setItem('printGuidesRemainingV2', '0');
      setModalState('loading')

      // Call backend to generate + print
      await amplifyClient.queries.fulfillV2Guide({
        sessionId: sessionId,
        product: "print",

        scheduleSummary: summary!,
        crops: JSON.stringify(crops),
        gantt: gantt!,

        plantingSchedule: JSON.stringify(plantingSchedule),
        climateData: JSON.stringify(climateData),
        companionPlantingAdvice: JSON.stringify(companionPlantingAdvice)
      })
        .then(() => setModalState('success'))
        .then(() => setRemaining(0))
        .catch(() => setModalState('failed'))
    };

    // const handlePurchase = () => {
    //   navigate('/checkout-v2?product=printExisting');
    // };

    if (modalState === 'success') {
      return (
        <Modal opened={opened} onClose={onClose} title={<Title order={3}>Print Monthly Guide</Title>} centered>
          <Text mb='sm'>
            We're preparing your guide! We'll let you know when it's printed and on its way.
          </Text>
          <Text mb='sm'>
            In a minute or two, you should receive an email (to the address you used at checkout) with a download link to your digital copy. If you don't, check your spam folder, or contact customer service.
          </Text>
        </Modal>
      )
    }

    if (modalState === 'failed') {
      return (
        <Modal opened={opened} onClose={onClose} title={<Title order={3}>Print Monthly Guide</Title>} centered>
          <Text>
            Something went wrong. Please reload the page and try again, or contact customer service.
          </Text>
        </Modal>
      )
    }

    return (
      <Modal opened={opened} onClose={onClose} title={<Title order={3}>Print Monthly Guide</Title>} centered>
        {remaining === 1 && (
          <>
            <Text>
              You can print one guide per purchase. It will be generated using your current active Plan Overview. Proceed?
            </Text>
            <Group mt="md" justify="right">
              <Button variant="light" color={theme.colors.green[7]} onClick={onClose}>Cancel</Button>
              <Button color={theme.colors.green[7]} onClick={handleGenerate} loading={modalState === 'loading'}>Print and Ship Guide</Button>
            </Group>
          </>
        )}
        {remaining === 0 && (
          <>
            <Text>
              Looks like you've used your one print order included in your purchase. Purchase another for 14.99?
            </Text>
            {/*<Text>*/}
            {/*  You can purchase another print guide to*/}
            {/*</Text>*/}
            <Group mt="md" justify="right">
              <Button variant="light" color={theme.colors.green[7]} onClick={onClose}>Cancel</Button>
              {/*<Button color={theme.colors.green[7]} onClick={handleGenerate}>Continue</Button>*/}
              <Button color={theme.colors.green[7]} disabled>This Feature Not Available</Button>
            </Group>
          </>
        )}
        {remaining === undefined && (
          <>
            <Text>
              This option isn’t included in your current purchase. Want to upgrade and print this guide for $14.99?
            </Text>
            <Group mt="md" justify="right">
              <Button variant="light" color={theme.colors.green[7]} onClick={onClose}>Cancel</Button>
              {/*<Button color={theme.colors.green[7]} onClick={handlePurchase}>Upgrade</Button>*/}
              <Button color={theme.colors.green[7]} disabled>This Feature Not Available</Button>
            </Group>
          </>
        )}
      </Modal>
    );
  }

  return (
    <>
      <DigitalGuideModal opened={digitalOpened} onClose={closeDigital} />
      <PrintGuideModal opened={printOpened} onClose={closePrint} />

      <BackgroundImage
        src={Garden3}
        style={{ backgroundPosition: "center", position: "absolute", left: 0, top: 60 }}
      >

        <Box
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: `rgba(160, 108, 14, 0.1)`,
          }}
        />

        <Box h={isSmallScreen ? "12vh" : "13vh"} />
        <Container px={isSmallScreen ? 0 : 0} style={{position: "relative", zIndex: 0}}>
          <Title order={1} mb="sm" c="white" style={{fontSize: isSmallScreen ? "1.9rem" : "3.2rem"}} ta={isSmallScreen ? 'center' : 'left'}>
            Your Plan Overview
          </Title>
        </Container>
        <Box h={isSmallScreen ? "4vh" : "3vh"} />
      </BackgroundImage>

      <Box h={isSmallScreen ? "21vh" : "24vh"} />

      <Container px={0}>
        <Text size="md" mb={summary ? "sm" : "lg"}>
          {/*Your 2025 planting schedule is designed to optimize your garden's productivity by strategically timing the planting and harvesting of each crop. The diagram is color-coded to match specific areas in your garden, helping you keep track of where each crop belongs throughout the season. You’ll notice that some crops may be scheduled to follow others in the same areas—this is called <i>succession planting</i>, and it helps you maximize your space by rotating crops throughout the season.*/}
          Your 2025 planting schedule optimizes the productivity of your garden by timing when to plant and harvest each crop. The color-coded diagram shows where each crop belongs, and some crops are scheduled to follow others in the same areas—a method called <i>succession planting</i> that maximizes space by staggering planting times.
        </Text>
        <GanttChart
          plantingSchedule={plantingScheduleLoading ? undefined : plantingSchedule}
          loading={plantingScheduleLoading}
          showLoadingTimeWarning={showLoadingTimeWarning}
        />
        {
          showNoSuccessionPlantingAlert &&
          <Alert
            className="alert-warning"
            variant="light"
            color="yellow"
            withCloseButton
            closeButtonLabel="Close alert."
            onClose={() => setShowNoSuccessionPlantingAlert(false)}
            title="It looks like we couldn't plant anything in succession."
            icon={isSmallScreen ? undefined : infoIcon}
            my="md"
          >
            <Text size="sm">This may be because you haven’t selected enough crops or ones with different growing seasons. If your garden is empty in spring or fall, try adding cool-weather crops like lettuce, kale, cabbage, or radishes to make better use of your space. <Anchor onClick={startPlanOver} style={{ whiteSpace: "nowrap" }}>Start a new plan here.</Anchor></Text>
          </Alert>
        }
        {
          showRepetitivePlantingsAlert &&
          <Alert
            className="alert-warning"
            variant="light"
            color="yellow"
            withCloseButton
            closeButtonLabel="Close alert."
            onClose={() => setShowRepetitivePlantingsAlert(false)}
            title="It looks like the same crops are being planted repeatedly."
            icon={isSmallScreen ? undefined : infoIcon}
            my="md"
          >
            <Text size="sm">This may be because there aren’t enough crops with different growing seasons in your selection. If you notice lots of plantings of the same cool-weather crop (like lettuce, kale, cabbage, or radishes), try adding other cool-weather crops for more variety. <Anchor onClick={startPlanOver} style={{ whiteSpace: "nowrap" }}>Start a new plan here.</Anchor></Text>
          </Alert>
        }
        {
          showRunningBehindAlert &&
          <Alert
            className="alert-warning"
            variant="light"
            color="yellow"
            withCloseButton
            closeButtonLabel="Close alert."
            onClose={() => setShowRunningBehindAlert(false)}
            title="Running a bit behind? No problem."
            icon={isSmallScreen ? undefined : infoIcon}
            my="md"
          >
            <Text size="sm">Don't worry if it looks like you should already have started planting in your garden. Your Monthly Planner will give instructions on growing from seed, but you can save time by buying mature seedlings from a local supplier and jumping straight to the transplanting stage.</Text>
          </Alert>
        }
        {
          summary
            ? <Text size="md" my="lg">{summary}</Text>
            : <>{skeletonParagraph}<br/></>
        }

        {moreInfoAccordion}

        <Container my="md" display="flex" px={0}>
          <Text c="dimmed">Want to create a different plan? {isSmallScreen && <br/>}<Anchor onClick={startPlanOver}>Start over here.</Anchor></Text>
        </Container>

        <Title order={3} mb='sm'>Ready to Generate Your Monthly Guide?</Title>
        <Grid mb='sm'>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="md" padding="lg" radius="md" withBorder>
              <Card.Section mb="sm">
                <AspectRatio ratio={1.7}>
                  <Image
                    src={DigitalMockup}
                    alt="Digital Booklet"
                  />
                </AspectRatio>
              </Card.Section>
              <List mb="sm">
                <ListItem>Instantly emailed as a PDF</ListItem>
                <ListItem>Print at home or use digitally</ListItem>
              </List>
              <Button onClick={openDigital} color={theme.colors.green[7]} loading={!summary}>Continue to Digital Monthly Guide</Button>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Card shadow="md" padding="lg" radius="md" withBorder >
              <Card.Section mb="sm">
                <AspectRatio ratio={1.7}>
                  <Image
                    src={BookletMockupLeft}
                    alt="Print Booklet"
                  />
                </AspectRatio>
              </Card.Section>
              <Text fs="italic" mb='xs' size='sm'>Printed on thick, matte stock that resists water and tearing.</Text>
              <List mb="sm">
                <ListItem>Built for garden use—no smudgy screens</ListItem>
                <ListItem>Free digital copy included</ListItem>
              </List>
              <Button onClick={openPrint} color={theme.colors.green[7]} loading={!summary}>Continue to Print Monthly Guide</Button>
            </Card>
          </Grid.Col>
        </Grid>

      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  );
};

export default PlanOverviewV2;

