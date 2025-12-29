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
  Modal,
  Image,
  Box,
  BackgroundImage,
  Grid,
  Card,
} from '@mantine/core';
import {useDisclosure, useViewportSize} from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';

import {
  ClimateDataOutput,
  Crop,
  Planting
} from '../types.ts'

import GanttChart from "./gantt-chart.tsx";
import ClimateChart from "./climate-chart.tsx";
import CropList from "./crop-list.tsx";
import {useEffect, useState} from "react";

import "./plan-overview.css";
import Footer from "./footer.tsx";
import EmailOptInForm from "./email-opt-in-form.tsx";
import LittleTomato from "../assets/little-tomato-plant-extended-shrunk.png"
import Garden3 from "../assets/garden-3-big.png";

interface DataDisplayProps {
  crops?: Crop[];
  plantingSchedule: Planting[][];
  climateData?: ClimateDataOutput;
  summary?: string;
  companionPlantingAdvice?: string[],
  companionPlants?: {displayName: string, storeHandle: string}[]
  startPlanOver: () => void
}

const PlanOverview = (props: DataDisplayProps) => {
  const { crops, plantingSchedule, climateData, summary, companionPlantingAdvice, companionPlants, startPlanOver } = props;

  const [opened, { open, close }] = useDisclosure(false);

  const [ userName, setUserName ] = useState<string | undefined>((): string | undefined => {
    const saved = localStorage.getItem("userName");
    const initialValue = undefined;
    if (!!saved && saved !== "undefined") {
      return saved
    } else {
      return initialValue;
    }
  });

  const [ userEmail, setUserEmail ] = useState<string | undefined>((): string | undefined => {
    const saved = localStorage.getItem("userEmail");
    const initialValue = undefined;
    if (!!saved && saved !== "undefined") {
      return saved
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    if (!userName || !userEmail) {
      open()
    } else {
      close()
    }
  }, [userName, userEmail]);

  const setUserData = ( _userName: string, _userEmail: string ) => {
    setUserName(_userName)
    localStorage.setItem("userName", _userName);
    setUserEmail(_userEmail)
    localStorage.setItem("userEmail", _userEmail);
  }

  // Scroll to top on first render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const plantingScheduleLoading = plantingSchedule.length === 0;
  const noSuccessionPlanting =
    !plantingScheduleLoading && plantingSchedule?.every((p) => p.length === 1);

  const [ showRunningBehindAlert, setShowRunningBehindAlert ] = useState<boolean>(false)

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

  const moreInfoCards = (
    <>
      <Card my='lg' p='lg' shadow="sm" withBorder style={{borderWidth: "1px"}} radius="md">
        <Title order={2} mb='sm'>
          🥦 Your Crops
        </Title>
        <Text size="sm" c="dimmed" mb="sm">We've selected the following best-selling varieties for each of the crops you selected, supplied by True Leaf Market, a leading seed supplier. The timing of your plan is based on the time to maturity for each of these varieties. </Text>
        <CropList crops={crops}/>
      </Card>

      <Grid>
        <Grid.Col py={0} span={{base: 12, md: 6}}>
          <Card my='lg' p='lg' withBorder shadow="sm">
            <Title order={2} mb='sm'>
              📝 Growing Tips
            </Title>
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
          </Card>
        </Grid.Col>
        <Grid.Col py={0} span={{base: 12, md: 6}}>
          <Card my='lg' p='lg' withBorder shadow="sm">
            <Title order={2} mb='sm'>
              🤝 Companion Plants
            </Title>
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
          </Card>
        </Grid.Col>
      </Grid>
      <Card my='lg' p='lg' withBorder shadow="sm">
        <Title order={2} mb='sm'>
          ☀️ Climate Predictions
        </Title>
        {
          climateData &&
          <ClimateChart data={climateData}/>
        }
      </Card>
    </>
  )

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
          <Accordion.Panel style={{position: "relative", overflow: "hidden"}}>

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
          <Accordion.Panel style={{position: "relative", overflow: "hidden"}}>

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

  return (
    <>
      <Modal
        centered
        closeOnEscape={false}
        closeOnClickOutside={false}
        zIndex={300}
        opened={opened}
        onClose={() => {}}
        withCloseButton={false}
        transitionProps={{enterDelay: 1000}}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          body: {
            padding: 0, // remove default body padding so the image sits flush
          },
        }}
      >

        <Image
          src={LittleTomato}
        ></Image>
        <Box p='lg'>
          <Title order={2}>Almost there!</Title>
          <Text mb='sm'>Just enter your name and email to view your free Plan Overview.</Text>
          <EmailOptInForm setUserData={setUserData} />
        </Box>
      </Modal>

      <BackgroundImage
        src={Garden3}
        style={{ backgroundPosition: "center", position: "absolute", left: 0, top: 60 }}
      >

        <Box
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            // background: `rgba(247, 244, 237, 0.2)`,
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

        {/*<Divider w="100%" />*/}
        <Container my="md" display="flex" px={0}>
          <Text c="dimmed">Want to create a different plan? {isSmallScreen && <br/>}<Anchor onClick={startPlanOver}>Start over here.</Anchor></Text>
        </Container>

        {
          isSmallScreen
            ? <>{moreInfoAccordion}</>
            : <>{moreInfoCards}</>
        }

        {/*<Center>*/}
        {/*  <Divider w="100%"/>*/}
        {/*</Center>*/}

        {/*<Affix w="100vw">*/}
        {/*  <Container px={isSmallScreen ? "30" : "0"}>*/}
        {/*    <Flex justify="flex-end">*/}
        {/*      <Button component={Link} to="/buy" mb="lg" mx={0} loading={!summary} size="md"*/}
        {/*        style={{boxShadow: "0 4px 8px 0 rgba(0,0,0,0.4), 0 3px 5px 0 rgba(0,0,0,0.19)"}}*/}
        {/*        color={theme.colors.green[7]}*/}
        {/*      >*/}
        {/*        Download your Full Plan*/}
        {/*      </Button>*/}
        {/*    </Flex>*/}
        {/*  </Container>*/}
        {/*</Affix>*/}

      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  );
};

export default PlanOverview;

