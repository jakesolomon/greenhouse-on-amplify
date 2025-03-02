import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  Title,
  Text,
  useMantineTheme,
  Card,
  ThemeIcon,
  Timeline, AppShell, Center, Image, Modal, Group, BackgroundImage
} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import {
  IconSun,
  IconChartBar,
  IconLeaf,
} from '@tabler/icons-react';
import useWindowSize from "../helpers/useWindowSize.ts";
import { useState } from "react";
import Logo from "../assets/full-logo-text-color.svg";
import Booklet from "../assets/Booklet Mockup large lowres.png";
import Faq from "./faq.tsx";

const LandingPage = () => {

  const theme = useMantineTheme();

  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate(); // React Router navigation

  const [ hoveredTimelineElement, setHoveredTimelineElement ] = useState<number>()

  const { width } = useWindowSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.xl

  const handleGetStartedClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const existingPlan = localStorage.getItem("scheduleSummary");

    if (existingPlan !== "undefined" && existingPlan !== null) {
      event.preventDefault(); // Prevent default navigation
      open(); // Show modal
    }
  };

  const viewExistingPlan = () => {
    close();
    navigate("/planner"); // Navigate to existing plan
  };

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

  return(
    <>
      <Modal opened={opened} onClose={close} title={<b>Continue or Start Over?</b>} centered>
        <Text>You already have a saved garden plan. Would you like to open it or start a new one?</Text>
        <Group justify="right" mt="md">
          <Button onClick={viewExistingPlan} variant="light">View My Plan</Button>
          <Button onClick={startNewPlan} variant="filled">Create New Plan</Button>
        </Group>
      </Modal>
      <Container p={0} m={0} w="100vw" fluid style={{position: "absolute", top: 0, right: 0, background: "#F7F4ED"}}>
        {/* set small screen to 83vh to show booklet in mobile view*/}
        <BackgroundImage
          src={isSmallScreen ? "undefined" : Booklet}
          style={{backgroundPosition: "right"}}
          h={isSmallScreen ? "85vh" : "90vh"}
        >
          <Container size="xl">
            {/* Hero Section */}
            {/* set small screen to 100vh to show booklet in mobile view*/}
            <Grid
              align="center"
              justify="center"
              gutter="xl"
              m="lg"
              h={isSmallScreen ? "85vh" : "90vh"}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'left',
              }}
            >
              <Grid.Col mb={0} pb={0}>
                {/*<Title order={1}>Your AI-Powered Vegetable Garden Planner</Title>*/}
                {/*<Title order={1}>Your Vegetable Garden Plan, In Seconds</Title>*/}
                <Title order={1} w={isSmallScreen ? undefined : "60%"} style={{fontSize: isSmallScreen ? "2.3rem" : "3.8rem"}} >Your Vegetable Garden Plan, {isSmallScreen && <br/>}In Under A Minute</Title>
                <Text size="lg" mt="md">
                  {/*Tailored planting schedules for your goals and space—made effortless with AI.*/}
                  Personalized plans for a thriving vegetable garden—made effortless with AI.
                  {/*Plan, plant, and harvest with ease using a personalized schedule, generated for you in seconds.*/}
                  {/* ^^ this is a good one for lower down. Sounds great but too many words for subtitle.*/}
                  {/*Take a short quiz to get your plan, tailored to your resources and goals.*/}
                  {/*Get a personalized month-by-month planting schedule tailored to your garden, resources, and goals.*/}
                  {/*Start your gardening journey with confidence and ease.*/}
                </Text>
                <Button component={Link} to="/planner" onClick={handleGetStartedClick} mt="lg" size="lg" color={theme.colors.green[7]} radius="md">
                  Get Started Now
                </Button>
              </Grid.Col>
              {/* Uncomment to show booklet in mobile view*/}
              {/*{*/}
              {/*  isSmallScreen &&*/}
              {/*  <Image*/}
              {/*    src={BookletCroppedNoEdgeShadows}*/}
              {/*    w="100vw"*/}
              {/*    height={310}*/}
              {/*    alt="Print Booklet"*/}
              {/*  />*/}
              {/*}*/}
            </Grid>
          </Container>
        </BackgroundImage>
      </Container>

      {/*Spaces out the content below the Hero, which is absolute*/}
      <Container h={isSmallScreen ? "85vh" : "90vh"} m={0} p={0} />

      {/* Features */}
      <Container size="lg" py="xl">
        <Title ta="center" order={2} mb="md">
          Why use Growing Guide?
        </Title>
        <Text ta="center" size="lg" mb="xl" c="dimmed">
          Designed to make gardening simple and productive, our app provides personalized insights tailored to your needs.
        </Text>
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 4}}>
            <Card shadow="sm" padding="lg" radius="md">
              <ThemeIcon size="xl" color="green">
                <IconLeaf size={28} />
              </ThemeIcon>
              <Title order={4} mt="md">Custom Garden Plans</Title>
              <Text mt="sm" c="dimmed">
                Get a month-by-month planting schedule tailored to your garden size, location, and goals.
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4}}>
            <Card shadow="sm" padding="lg" radius="md">
              <ThemeIcon size="xl" color="yellow">
                <IconSun size={28} />
              </ThemeIcon>
              <Title order={4} mt="md">Adapt to Your Climate</Title>
              <Text mt="sm" c="dimmed">
                Incorporates local temperature conditions to provide tailored advice.
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4}}>
            <Card shadow="sm" padding="lg" radius="md">
              <ThemeIcon size="xl" color="blue">
                <IconChartBar size={28} />
              </ThemeIcon>
              <Title order={4} mt="md">Maximize Your Harvest</Title>
              <Text mt="sm" c="dimmed">
                Optimize planting and harvesting schedules to increase your garden's productivity.
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      {/*How it works*/}
      <Container size="sm" py="xl" my="xl">
        <Title order={2} ta="center" mb="md">
          Planting Made Simple
        </Title>
        <Text size="lg" ta="center" mb="xl" c="dimmed">
          Transform your gardening experience with our step-by-step process. It's simple, quick, and tailored to you.
        </Text>

        <Timeline
          active={hoveredTimelineElement}
          bulletSize={20}
          lineWidth={3}
          color="green"
          mt="xl"
        >
          {/* Step 1 */}
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(0)}
            title="Step 1: Share Your Garden Details"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Let us know about your garden’s size, location, goals, and resources. We’ll use this to tailor a personalized plan just for you.
            </Text>
          </Timeline.Item>

          {/* Step 2 */}
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(1)}
            title="Step 2: Instant Personalized Plan"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Get an overview of your planting and harvest schedule, including optimized succession planting, crop suggestions, and climate-specific advice.
            </Text>
          </Timeline.Item>

          {/* Step 3 */}
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(2)}
            title="Step 3: Refine and Customize"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Adjust crop selections, explore companion planting, and add varieties to create a robust and personalized garden design.
            </Text>
          </Timeline.Item>

          {/* Step 4 */}
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(3)}
            title="Step 4: Your Month-by-Month Planner"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Download a detailed monthly schedule with diagrams and tasks to keep your garden on track throughout the season.
            </Text>
          </Timeline.Item>

          {/* Step 5 */}
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(4)}
            title="Step 5: Grow with Confidence"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Follow your plan, watch your garden flourish, and enjoy the rewards of a productive and thriving vegetable patch.
            </Text>
          </Timeline.Item>
        </Timeline>
      </Container>
      <Container size="md" py="xl" px={0}>
        <Title order={2} ta="center" mb="lg">
          Frequently Asked Questions
        </Title>
        <Text size="lg" ta="center" mb="xl" c="dimmed">
          Have questions? We’ve got answers.
        </Text>
        <Faq />
        <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
          <Center py="md">
            <Image src={Logo} className="footer-logo" alt="logo" />
          </Center>
        </AppShell.Footer>
      </Container>
    </>
  )
}

export default LandingPage
