import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  Title,
  Text,
  useMantineTheme,
  Card,
  Timeline, AppShell, Image, Modal, Group, BackgroundImage, Box, AspectRatio
} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import useWindowSize from "../helpers/useWindowSize.ts";
import { useState } from "react";
import KaleFrost from "../assets/kale-frost-lowres.png"
import LandingPageVideo from "../assets/landing-page-video.mov";
import LandingPageStill from '../assets/landing-page-video-still.png'
import Garden3 from "../assets/garden-3-big.png";
import Harvest from "../assets/harvest_lowres.png";
import Faq from "./faq.tsx";
import Footer from "./footer.tsx";
import BookletMockupLeft from "../assets/booklet-mockup-left.png";

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
          <Button onClick={viewExistingPlan} variant="light" color={theme.colors.green[7]}>View My Plan</Button>
          <Button onClick={startNewPlan} variant="filled" color={theme.colors.green[7]}>Create New Plan</Button>
        </Group>
      </Modal>
      <Container p={0} m={0} w="100vw" fluid style={{position: "absolute", top: 0, right: 0, background: "#F7F4ED"}}>
        {/* set small screen to 83vh to show booklet in mobile view*/}
        <BackgroundImage
          // src={isSmallScreen ? "undefined" : Anime}
          src={"undefined"}
          style={{backgroundPosition: "left", position: "relative", top: 40}}
          h={isSmallScreen ? "75vh" : "90vh"}
        >

          {/*/!* Video overlay *!/*/}
          <Box
            h={isSmallScreen ? "75vh" : "90vh"}
            style={ isSmallScreen ?
              {
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 0,
              }
              :
              {
                position: 'absolute',
                left: "20vw",
                top: 0,
                width: "80vw",
                zIndex: 0,
              }
            }
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              src={LandingPageVideo}
              poster={LandingPageStill}
              style={{
                position: 'relative',
                top: 0,
                left: 0,
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            />
          </Box>

          {/* Gradient or Color Overlay */}
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background: isSmallScreen
                ?
                `rgba(160, 108, 70, 0.2)`
                :
                `linear-gradient(
                  to right, 
                  #F7F4ED 0%,
                  rgba(247, 244, 237, 1) 35%,  
                  rgba(247, 244, 237, 0.5) 55%, 
                  transparent 65%
                )`
            }}
          />

          <Container size="xl" style={{position: 'relative', zIndex: 1}}>
            <Grid
              align="center"
              justify="center"
              gutter="xl"
              m="lg"
              h={isSmallScreen ? "65vh" : "90vh"}
              style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'left',
                }}
              >
                <Grid.Col mb={0} pb={0}>
                  <Title
                    order={1}
                    w={isSmallScreen ? undefined : "50%"}
                    style={{fontSize: isSmallScreen ? "2.3rem" : "3.3rem"}}
                    c={isSmallScreen ? "white" : undefined}
                  >
                    Your Vegetable Garden Plan, {isSmallScreen && <br/>}
                    In Under A Minute
                  </Title>
                  {/*<Text size="lg" mt="md" c={isSmallScreen ? "white" : undefined} >*/}
                  {/*  Personalized plans for a thriving vegetable garden—made effortless with AI.*/}
                  {/*</Text>*/}
                  <Text
                    // order={5}
                    mt="md"
                    w={isSmallScreen ? undefined : "50%"}
                    c={isSmallScreen ? "white" : undefined}
                    style={{fontSize: "1.3rem"}}
                  >
                    Personalized plans for a thriving vegetable garden—made effortless with AI.
                  </Text>
                  <Button
                    component={Link}
                    to="/planner"
                    onClick={handleGetStartedClick}
                    mt="lg"
                    size="lg"
                    color={theme.colors.green[7]}
                    radius="md"
                  >
                    Get Started Now
                  </Button>
                </Grid.Col>
              </Grid>
            </Container>
        </BackgroundImage>

      </Container>

      {/*Spaces out the content below the Hero, which is absolute*/}
      <Container h={isSmallScreen ? "70vh" : "90vh"} m={0} p={0}/>

      {/* Features */}
      <Container size="lg" py="xl" px={0}>
        <Title order={2} mb="sm">
        Why use The Growing Guide?
        </Title>
        <Text size="lg" mb="md" c="dimmed">
          Designed to make gardening simple and productive, our planner provides personalized insights tailored to you.
        </Text>
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 4}}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              {/*<ThemeIcon size="xl" color="green">*/}
              {/*  <IconLeaf size={28} />*/}
              {/*</ThemeIcon>*/}
              <Card.Section mb="sm">
                <AspectRatio ratio={2}>
                  <Image
                    src={BookletMockupLeft}
                    alt="Booklet in garden"
                  />
                </AspectRatio>
              </Card.Section>
              <Title order={4} mt="md">Tailored Garden Guide</Title>
              <Text mt="sm" c="dimmed">
                Get a month-by-month planting schedule, made to order for your unique garden plan.
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4}}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              {/*<ThemeIcon size="xl" color="yellow">*/}
              {/*  <IconSun size={28} />*/}
              {/*</ThemeIcon>*/}
              <Card.Section mb="sm">
                <AspectRatio ratio={2}>
                  <Image
                    src={KaleFrost}
                    alt="Kale seedling with frost"
                  />
                </AspectRatio>
              </Card.Section>
              <Title order={4} mt="md">Adapt to Your Climate</Title>
              <Text mt="sm" c="dimmed">
                Incorporates local temperature conditions to provide tailored advice.
              </Text>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4}}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              {/*<ThemeIcon size="xl" color="blue">*/}
              {/*  <IconChartBar size={28} />*/}
              {/*</ThemeIcon>*/}
              <Card.Section mb="sm">
                <AspectRatio ratio={2}>
                  <Image
                    src={Harvest}
                    alt="Tomato seedling"
                  />
                </AspectRatio>
              </Card.Section>
              <Title order={4} mt="md">Maximize Your Harvest</Title>
              <Text mt="sm" c="dimmed">
                Optimize planting and harvesting schedules to increase your garden's productivity.
              </Text>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      {/*How it works*/}
      {/*<Container size="lg" my="md" >*/}
      {/*  <BackgroundImage*/}
      {/*    src={LittleTomato}*/}
      {/*    style={{backgroundPosition: "bottom", position: "relative", top: 0}}*/}
      {/*  >*/}
      {/*    <Box h="40px"></Box>*/}
      {/*    <Title order={2} ta="center" mb="md" c="white">*/}
      {/*      Garden Planning Made Simple*/}
      {/*    </Title>*/}
      {/*    <Box h="200px"></Box>*/}
      {/*  </BackgroundImage>*/}
      {/*</Container>*/}

      <Container size="sm" my="md" px={0}>
        {/*<Title order={2} ta="center" mb="md">*/}
        {/*  Planting Made Simple*/}
        {/*</Title>*/}
        <Text size="lg" mb="xl" c="dimmed">
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
              Adjust crop selections, explore companion planting, and add variety to create a robust and personalized garden design.
            </Text>
          </Timeline.Item>

          {/* Step 4 */}
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(3)}
            title="Step 4: Your Monthly Guide"
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

      <Container size="md" pt="md" px={0}>
        <BackgroundImage
          src={Garden3}
          style={{backgroundPosition: "bottom", position: "relative", top: 0}}
        >
          <Box h="100px"></Box>
          <Title order={1} ta="center" mb="md" c="white">
            Frequently Asked Questions
          </Title>
          <Box h="100px"></Box>
        </BackgroundImage>
      </Container>

      <Container size="md" py="xl" px={0}>
        <Faq />
      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )
}

export default LandingPage
