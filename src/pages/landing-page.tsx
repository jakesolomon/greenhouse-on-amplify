import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  Title,
  Text,
  useMantineTheme,
  Card,
  Timeline, AppShell, Image, Modal, Group, BackgroundImage, Box, AspectRatio, Center,
} from "@mantine/core";
import {useDisclosure, useScrollIntoView} from '@mantine/hooks';
import useWindowSize from "../helpers/useWindowSize.ts";
import {useEffect, useState} from "react";
import KaleFrost from "../assets/kale-frost-lowres.png"
import LandingPageVideo from "../assets/landing-page-video.mov";
import LandingPageVideoTiny from "../assets/landing-page-video-tiny.mov";
import LandingPageStill from '../assets/landing-page-video-still.png'
import Harvest from "../assets/harvest_lowres.png";
import Faq from "../components/faq.tsx";
import Footer from "../components/footer.tsx";
import BookletMockupLeft from "../assets/booklet-mockup-left.png";
import RaisedBed from "../assets/succession-planting-sketch.png"
import Testimonials from "../components/testimonials.tsx";

const LandingPage = () => {

  const navigate = useNavigate(); // React Router navigation

  // Redirect to v2 if v2 user is revisiting the site
  useEffect(() => {
    const isV2User = localStorage.getItem('isV2User');
    if (isV2User === 'true') {
      navigate('/home-v2', { replace: true });
    }
  }, [navigate]);

  // Check if mobile device is running on low battery mode. Will suspend landing page video.
  const [canAutoplay, setCanAutoplay] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAutoplay = async () => {
      const video = document.createElement('video');
      video.src = LandingPageVideoTiny;
      video.muted = true;
      video.playsInline = true;
      try {
        await video.play();
        setCanAutoplay(true);
        video.pause();
      } catch (err) {
        console.log("Will not autoplay video, error: ", err);
        setCanAutoplay(false);
      }
    };
    checkAutoplay();
  }, []);

  const theme = useMantineTheme();

  const [opened, { open, close }] = useDisclosure(false);

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

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
    duration: 600,
  });

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
            {
              canAutoplay === false || canAutoplay === null
                ? (
                  <img
                    alt="Garden with planner"
                    src={LandingPageStill}
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
                )
                : (
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
                )
            }
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
                    style={{fontSize: isSmallScreen ? "2rem" : "2.5rem"}}
                    c={isSmallScreen ? "white" : undefined}
                    textWrap="balance"
                  >
                    Generic planting charts aren't made for succession planting.
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
                    Get a planting schedule for your climate in minutes—designed for continuous harvests.
                  </Text>
                  <Group mt="lg">
                    <Button
                      component={Link}
                      to="/planner"
                      onClick={handleGetStartedClick}
                      size={isSmallScreen ? "md" :"lg"}
                      color={theme.colors.green[7]}
                      radius="md"
                    >
                      Get Started Now
                    </Button>
                    {
                      !isSmallScreen &&
                      <Button
                        onClick={() => scrollIntoView({ alignment: 'center' }) }
                        size={isSmallScreen ? "md" :"lg"}
                        color={isSmallScreen ? "white" : theme.colors.green[7]}
                        radius="md"
                        variant="outline"
                      >
                        Find Out More
                      </Button>
                    }
                  </Group>
                </Grid.Col>
              </Grid>
            </Container>
        </BackgroundImage>

      </Container>

      {/*Spaces out the content below the Hero, which is absolute*/}
      <Container h={isSmallScreen ? "70vh" : "90vh"} m={0} p={0}/>

      {/* Problem Section */}
      <Container size="lg" py="xl" px={0} ref={targetRef}>
        <Grid gutter="xl" pb="xl">
          <Grid.Col span={{ base: 12, md: 6}}>
            <Center h="100%"><Box>
              <Text mb='xs' c="#333"><b><em>The challenge is timing.</em></b></Text>
              <Text size="2rem" mb="md" mr="md" c="#333">
                <b>Most planting charts assume one crop per bed.</b>
              </Text>
              <Text size="md" mb="md" mr="md">
                Succession planting means using the same garden space for multiple crops throughout the season.
                {/*Plant radishes in early spring, then tomatoes in the same bed after harvest. Follow summer beans with fall carrots.*/}
              </Text>
              <Text size="md" mb="md" mr="md">
                Planting charts don't tell you how to sequence crops or which ones can follow each other in your climate. Without calculated timing, you either leave beds empty or miss planting windows.
              </Text>
              <Button
                component={Link}
                to="/planner"
                onClick={handleGetStartedClick}
                // size={isSmallScreen ? "md" :"lg"}
                color={theme.colors.green[8]}
                radius="md"
                variant="transparent"
              >
                Get Your Optimal Crop Sequence →
              </Button>
            </Box></Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6}}>
            <Card p="0">
              {/*<ThemeIcon size="xl" color="yellow">*/}
              {/*  <IconSun size={28} />*/}
              {/*</ThemeIcon>*/}
                <AspectRatio ratio={1.3}>
                  <Image
                    src={RaisedBed}
                    alt="Raised Bed"
                  />
                </AspectRatio>
            </Card>
            {/*<Card h={isSmallScreen ? "300px" : "450px"} w="100%">*/}
            {/*  <video*/}
            {/*    autoPlay*/}
            {/*    muted*/}
            {/*    loop*/}
            {/*    playsInline*/}
            {/*    src={SeedingEdit}*/}
            {/*    poster={SeedingEditStill}*/}
            {/*    style={{*/}
            {/*      position: 'absolute',*/}
            {/*      top: 0,*/}
            {/*      left: 0,*/}
            {/*      inset: 0,*/}
            {/*      width: '100%',*/}
            {/*      height: '100%',*/}
            {/*      objectFit: 'cover',*/}
            {/*      zIndex: 0,*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</Card>*/}
          </Grid.Col>
        </Grid>
      </Container>

      <Container size="md" px={0}>
        {/*<Container size="sm" px={0} my="xl">*/}
          <Text size="2rem" mb="md" c="#333" style={!isSmallScreen ? {textAlign: "center"} : undefined}>
            <b>A Planting Schedule That Maximizes Every Bed</b>
          </Text>
          <Text size="md" mb="xl" style={!isSmallScreen ? {textAlign: "center"} : undefined}>
            The Growing Guide calculates how to sequence crops in the same space throughout your growing season. You get a planting schedule showing which crops to plant when—and which crops can follow each other in the same bed.
          </Text>
        {/*</Container>*/}
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 6}}>
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
          <Grid.Col span={{ base: 12, md: 6}}>
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

      <Container size="md" my="xl" px={0} py="xl">
        <Text size="2rem" mb="md" c="#333"><b>Three Steps to Your Planting Schedule</b></Text>
        <Text c="#333" mb="md"><b><em>It takes less than a minute.</em></b></Text>

        <Timeline
          active={hoveredTimelineElement}
          bulletSize={20}
          lineWidth={3}
          color="green"
          // mt="xl"
          w={isSmallScreen ? "100%" : "60%"}
        >
          {/* Step 1 */}
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(0)}
            title="Step 1: Enter your location"
          >
            <Text c="dimmed" size="sm" mt="sm">
              We use your area's climate data to calculate planting windows specific to your growing season.
            </Text>
          </Timeline.Item>

          {/* Step 2 */}
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(1)}
            title="Step 2: Choose your crops"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Select what you want to grow from our database of crops. We're adding new ones all the time.
            </Text>
          </Timeline.Item>

          {/* Step 3 */}
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(2)}
            title="Step 3: Get your planting schedule"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Receive a full-season timeline showing when to plant each crop for continuous production.
            </Text>
          </Timeline.Item>

          {/*/!* Step 4 *!/*/}
          {/*<Timeline.Item*/}
          {/*  onMouseEnter={() => setHoveredTimelineElement(3)}*/}
          {/*  title="Step 4: Your Monthly Guide"*/}
          {/*>*/}
          {/*  <Text c="dimmed" size="sm" mt="sm">*/}
          {/*    Download a detailed monthly schedule with diagrams and tasks to keep your garden on track throughout the season.*/}
          {/*  </Text>*/}
          {/*</Timeline.Item>*/}

          {/*/!* Step 5 *!/*/}
          {/*<Timeline.Item*/}
          {/*  onMouseEnter={() => setHoveredTimelineElement(4)}*/}
          {/*  title="Step 5: Grow with Confidence"*/}
          {/*>*/}
          {/*  <Text c="dimmed" size="sm" mt="sm">*/}
          {/*    Follow your plan, watch your garden flourish, and enjoy the rewards of a productive and thriving vegetable patch.*/}
          {/*  </Text>*/}
          {/*</Timeline.Item>*/}
        </Timeline>
      </Container>

      <Container size='lg' my='xl' px={0}>
        {/*<Title order={2}>Don’t Just Take Our Word For It</Title>*/}
        {/*<Text fs='italic' mb='sm'>See what others are saying</Text>*/}
        <Text size="2rem" mb="md" c="#333" style={{textAlign: "center"}}><b>Don’t Just Take Our Word For It</b></Text>
        {/*<Text c="#333" mb="md" style={{textAlign: "center"}}><b><em>See what others are saying</em></b></Text>*/}
        <Testimonials />
      </Container>

      {/* Final CTA */}
      <Container size="lg" py="lg" px={0} ref={targetRef}>
        <Grid gutter="xl" pb="xl">
          <Grid.Col span={{ base: 12, md: 6}}>
            <Center h="100%"><Box>
              {/*<Text mb='xs' c="#333"><b><em>The challenge is timing.</em></b></Text>*/}
              <Text size="2rem" mb="md" mr="md" c="#333">
                <b>Get Your Free Planting Schedule</b>
              </Text>
              <Text size="md" mb="md" mr="md">
                Personalized for your climate. No credit card required.
              </Text>
              <Button
                component={Link}
                to="/planner"
                onClick={handleGetStartedClick}
                // size={isSmallScreen ? "md" :"lg"}
                color={theme.colors.green[8]}
                radius="md"
                variant="transparent"
              >
                Get Started →
              </Button>
            </Box></Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6}}>
            <Card>
              <AspectRatio ratio={2}>
                <Image
                  src={BookletMockupLeft}
                  alt="Gardening booklet"
                />
              </AspectRatio>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      <Container size="sm" py="lg" px={0}>
        <Text size="large" c="#333" mb="md"><b>Frequently Asked Questions</b></Text>
        {/*<Title order={2} mb='xs'>Frequently Asked Questions</Title>*/}
        <Faq />
      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )
}

export default LandingPage
