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
import {useDisclosure, useScrollIntoView} from '@mantine/hooks';
import useWindowSize from "../helpers/useWindowSize.ts";
import {useEffect, useState} from "react";
import KaleFrost from "../assets/kale-frost-lowres.png"
import LandingPageVideo from "../assets/landing-page-video.mov";
import LandingPageVideoTiny from "../assets/landing-page-video-tiny.mov";
import LandingPageStill from '../assets/landing-page-video-still.png'
import Harvest from "../assets/harvest_lowres.png";
import Faq from "./faq.tsx";
import Footer from "./footer.tsx";
import BookletMockupLeft from "../assets/booklet-mockup-left.png";
import SeedingEdit from "../assets/seeding-edit-1.mp4";
import SeedingEditStill from "../assets/seeding-edit-still.png";
import Testimonials from "./testimonials.tsx";

const LandingPage = () => {

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

  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
    duration: 600,
  });

  const salesCard = (
    <Card my='lg' py='md' px={isSmallScreen ? undefined : 'lg'} withBorder>
      {
        isSmallScreen &&
        <Card.Section mb='sm'>
          <AspectRatio ratio={1080 / 540}>
            <Image
              src={BookletMockupLeft}
              alt="Booklet mockup"
            />
          </AspectRatio>
        </Card.Section>
      }
      <Title order={2} mb='xs'>Ready to Get Started?</Title>
      <Text mb='md'>The Monthly Guide shows you exactly how to make your garden plan happen.</Text>
      <Text mb='md'>Start with your free Plan Overview to learn when to plant, how to maximize the use of your available space, and more.</Text>
      <Text mb='md'>It's free to get started, no account required.</Text>
      {/*<List spacing="sm" size='md' style={{alignItems: "start"}} mb='lg'>*/}
      {/*  <List.Item icon={<Box>🗓</Box>}>We take the same custom planning process — tailored to your climate and crops — and break it down into monthly, easy-to-follow instructions.</List.Item>*/}
      {/*  <List.Item icon="📦">Printed and shipped to your door (or delivered as a digital PDF) with your name on the cover, so you know it's made just for you.</List.Item>*/}
      {/*</List>*/}

      <Button component={Link} to="/planner" size="md" mb='xs'
              style={{boxShadow: "0 4px 8px 0 rgba(0,0,0,0.4), 0 3px 5px 0 rgba(0,0,0,0.19)"}}
              color={theme.colors.green[7]}
      >
        Plan My Garden
      </Button>
    </Card>
  )

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

      {/* Features */}
      <Container size="lg" py="xl" px={0} ref={targetRef}>
        <Title order={1}>
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
              <Title order={4} mt="md">Tailored Monthly Guide</Title>
              <Text mt="sm" c="dimmed">
                Get a month-by-month planting and maintainence guide, made to order for your unique garden plan.
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

      <Container size="lg" px={0} my='xl' style={{zIndex: 1}}>
        <Grid m={0} p={0} gutter="xl">
          <Grid.Col span={{ base: 12, md: 6}}>
            <Title order={2} mb="sm">Everything you need, organized month-by-month, to grow a thriving garden.</Title>
            {/*<Text size="xl">Everything you need, organized month-by-month, to grow a thriving garden in your climate.</Text>*/}
            {/*<Text mt="sm" c="dimmed">*/}
            {/*  Get a month-by-month planting and maintainence guide, made to order for your unique garden plan.*/}
            {/*</Text>*/}
            {/*{featureList}*/}
            {/*<Text fw={700} mb='xs'>This is a custom garden guide, created just for you.</Text>*/}
            <Text mb='md'>For each order, we generate a unique guide using the same custom scheduling process we use to create your free plan overview, based on your crops and local climate.</Text>
            <Text mb='md'>You get a downloadable PDF or print booklet that includes month-by-month tasks and tried-and-true gardening guidance.</Text>
            {/*<Text fw={700}>Not satisfied? No worries.</Text>*/}
            <Text><strong>Not satisfied? No worries.</strong> Just send us a message—we’ll give you a full refund, no questions asked.</Text>
            {/*<Text mb='xs' style={{layout: "inline-block"}}>Just send us a message—we’ll give you a full refund, no questions asked.</Text>*/}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6}} style={{position: "relative"}}>
            {/*<Title order={1} mt="md" style={{zIndex: 10}}>Everything you need, organized month-by-month, to grow a thriving garden in your climate.</Title>*/}
            <Card h={isSmallScreen ? "300px" : "300px"}>
              <video
                autoPlay
                muted
                loop
                playsInline
                src={SeedingEdit}
                poster={SeedingEditStill}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0,
                }}
              />
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      <Container size="md" my="xl" px={0}>
        {/*<Title order={2} ta="center" mb="md">*/}
        {/*  Planting Made Simple*/}
        {/*</Title>*/}
        <Title order={2}>
          Transform your gardening experience with our step-by-step process. It's simple, quick, and tailored to you.
        </Title>

        <Timeline
          active={hoveredTimelineElement}
          bulletSize={20}
          lineWidth={3}
          color="green"
          mt="xl"
          w={isSmallScreen ? "100%" : "60%"}
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

      <Container size='lg' my='xl' px={0}>
        <Title order={2}>Don’t Just Take Our Word For It</Title>
        <Text fs='italic' mb='sm'>See what others are saying</Text>
        <Testimonials />
      </Container>

      {
        isSmallScreen
          ?
          <>{salesCard}</>
          :
          <Container size='md' my="md" px={0} display="flex">
            <BackgroundImage
              src={BookletMockupLeft}
              style={{backgroundPosition: "center", position: "relative"}}
            >
              <Box h={30} />
              <Grid
                justify="right"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'left',
                }}
              >
                <Grid.Col span={5} m='xl'>
                  {salesCard}
                </Grid.Col>
              </Grid>
              <Box h={30} />
            </BackgroundImage>
          </Container>
      }

      {/*<Container size="lg" pt="md" px={0}>*/}
      {/*  <BackgroundImage*/}
      {/*    src={Garden3}*/}
      {/*    style={{backgroundPosition: "bottom", position: "relative", top: 0}}*/}
      {/*  >*/}
      {/*    <Box h="100px"></Box>*/}
      {/*    <Title order={1} ta="center" mb="md" c="white">*/}
      {/*      Frequently Asked Questions*/}
      {/*    </Title>*/}
      {/*    <Box h="100px"></Box>*/}
      {/*  </BackgroundImage>*/}
      {/*</Container>*/}

      <Container size="md" py="xl" px={0}>
        <Title order={2} mb='xs'>Frequently Asked Questions</Title>
        <Faq />
      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )
}

export default LandingPage
