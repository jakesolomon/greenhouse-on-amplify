import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  Title,
  Text,
  useMantineTheme,
  Card,
  Timeline,
  AppShell,
  Image,
  Group,
  BackgroundImage,
  Box,
  AspectRatio,
  Stack,
  List,
  ThemeIcon,
  Divider,
  Center,
} from "@mantine/core";
import {useScrollIntoView} from '@mantine/hooks';
import { IconPlant2, IconArrowForward } from '@tabler/icons-react';
import useWindowSize from "../helpers/useWindowSize.ts";
import {useEffect, useState} from "react";

import SuccessionPlanting from "../assets/succession-planting-sketch.png";
import CompanionPlanting from "../assets/companion-planting-sketch.png";
import KaleFrost from "../assets/kale-frost-lowres.png"
import LandingPageVideo from "../assets/landing-page-video.mov";
import LandingPageVideoTiny from "../assets/landing-page-video-tiny.mov";
import LandingPageStill from '../assets/landing-page-video-still.png'
import Harvest from "../assets/harvest_lowres.png";
import Faq from "../components/faq.tsx";
import Footer from "../components/footer.tsx";
import BookletMockupLeft from "../assets/booklet-mockup-left.png";
import SeedingEdit from "../assets/seeding-edit-1.mp4";
import SeedingEditStill from "../assets/seeding-edit-still.png";
import PlanOverviewDemo from "../assets/plan-overview-demo.mov"
import Testimonials from "../components/testimonials.tsx";

const LandingPageV2 = () => {

  // Add local storage variable to make sure v2 customers get back to v2 user flow
  useEffect(() => {
    localStorage.setItem('isV2User', 'true');
  }, []);


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

  const navigate = useNavigate(); // React Router navigation

  const [ hoveredTimelineElement, setHoveredTimelineElement ] = useState<number>()

  const { width } = useWindowSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.xl

  const handleGetStartedClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const isPayingCustomer = localStorage.getItem("digitalGuidesRemainingV2");

    if (isPayingCustomer !== "undefined" && isPayingCustomer !== null) {
      event.preventDefault(); // Prevent default navigation
      navigate("/planner-v2"); // Navigate to plan overview
    }
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

      <Button component={Link} to="/buy-v2" size="md" mb='xs'
              style={{boxShadow: "0 4px 8px 0 rgba(0,0,0,0.4), 0 3px 5px 0 rgba(0,0,0,0.19)"}}
              color={theme.colors.green[7]}
      >
        Plan My Garden
      </Button>
    </Card>
  )

  return(
    <>
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
                      to="/buy-v2"
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
                Get a planting and maintenance guide, made to order for your unique garden plan.
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

        <Center mt='md'>
          <Button
            component={Link}
            to="/buy-v2"
            onClick={handleGetStartedClick}
            size={isSmallScreen ? "md" :"lg"}
            color={theme.colors.green[7]}
            radius="md"
          >
            Start Your Custom Garden Plan
          </Button>
        </Center>
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

      {/*<Container size="lg" px={0} my='xl' style={{zIndex: 1}}>*/}
      {/*  <Grid m={0} p={0} gutter="xl">*/}
      {/*    <Grid.Col span={{ base: 12, md: 6}}>*/}
      {/*      <Title order={2} mb="sm">Everything you need, organized month-by-month, to grow a thriving garden.</Title>*/}
      {/*      /!*<Text size="xl">Everything you need, organized month-by-month, to grow a thriving garden in your climate.</Text>*!/*/}
      {/*      /!*<Text mt="sm" c="dimmed">*!/*/}
      {/*      /!*  Get a month-by-month planting and maintainence guide, made to order for your unique garden plan.*!/*/}
      {/*      /!*</Text>*!/*/}
      {/*      /!*{featureList}*!/*/}
      {/*      /!*<Text fw={700} mb='xs'>This is a custom garden guide, created just for you.</Text>*!/*/}
      {/*      <Text mb='md'>We use a planting algorithm to custom build each guide from scratch based on your crop selections and local climate—so you’re never guessing when to plant, transplant, or harvest.</Text>*/}
      {/*      <Text mb='md'>You get a downloadable PDF or print booklet that includes month-by-month tasks and tried-and-true gardening guidance.</Text>*/}
      {/*      /!*<Text fw={700}>Not satisfied? No worries.</Text>*!/*/}
      {/*      <Text><strong>Not satisfied? No worries.</strong> Just send us a message—we’ll give you a full refund, no questions asked.</Text>*/}
      {/*      /!*<Text mb='xs' style={{layout: "inline-block"}}>Just send us a message—we’ll give you a full refund, no questions asked.</Text>*!/*/}
      {/*    </Grid.Col>*/}
      {/*    <Grid.Col span={{ base: 12, md: 6}} style={{position: "relative"}}>*/}
      {/*      /!*<Title order={1} mt="md" style={{zIndex: 10}}>Everything you need, organized month-by-month, to grow a thriving garden in your climate.</Title>*!/*/}
      {/*      <Card h={isSmallScreen ? "300px" : "300px"}>*/}
      {/*        <video*/}
      {/*          autoPlay*/}
      {/*          muted*/}
      {/*          loop*/}
      {/*          playsInline*/}
      {/*          src={SeedingEdit}*/}
      {/*          poster={SeedingEditStill}*/}
      {/*          style={{*/}
      {/*            position: 'absolute',*/}
      {/*            top: 0,*/}
      {/*            left: 0,*/}
      {/*            inset: 0,*/}
      {/*            width: '100%',*/}
      {/*            height: '100%',*/}
      {/*            objectFit: 'cover',*/}
      {/*            zIndex: 0,*/}
      {/*          }}*/}
      {/*        />*/}
      {/*      </Card>*/}
      {/*    </Grid.Col>*/}
      {/*  </Grid>*/}
      {/*</Container>*/}

      <Container my="lg" size='lg' px={0}>
        {/*<Card p='xl' withBorder>*/}
          <Center>
            <Title order={2} mb='sm'>What You Get with The Growing Guide</Title>
          </Center>
          <Grid gutter="xl" align='center'>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="sm">
                <Text size="xl" fw={500}>The Plan Overview</Text>
                <Text size="md">
                  Your season at a glance. We start with a bird’s-eye view of your entire growing season, based on your climate and crop choices.
                </Text>
                <List>
                  <List.Item>Discover your region’s frost dates and growing conditions</List.Item>
                  <List.Item>Suggests when to start seeds, transplant, and expect harvests</List.Item>
                  <List.Item>Helps you stagger plantings and re-use garden space effectively</List.Item>
                  <List.Item>Learn how specific companion plants can help you reach your goals naturally</List.Item>
                  <List.Item>Takes just seconds to create, so you can keep tweaking until you love your plan</List.Item>
                </List>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card mx='md' withBorder>
                <AspectRatio ratio={2}>
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={PlanOverviewDemo}
                    poster={SeedingEditStill}
                    style={{width: '100%', height: '100%', border: 'none'}}
                  />
                </AspectRatio>
              </Card>
            </Grid.Col>

            {/*<Divider w='100%' my='md'/>*/}

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Stack gap="sm">
                <Text size="xl" fw={500}>The Monthly Guide</Text>
                <Text size="md">
                  Your step-by-step game plan for each month. Instead of sorting through articles and videos, you get everything distilled into a single, easy-to-follow format—built for your garden and growing goals.
                </Text>
                <List>
                  <List.Item>Monthly task list based on your unique garden plan</List.Item>
                  <List.Item>Seeding, transplanting, maintenance, and harvest instructions for your specific crops</List.Item>
                  <List.Item>Key concepts like soil health and essential tools</List.Item>
                  <List.Item>Notes section to track problems, solutions, or changes</List.Item>
                  <List.Item>Available digitally or as a booklet, printed using durable paper stock perfect for outdoor use</List.Item>
                  <Button
                    component={Link}
                    to="/buy-v2"
                    onClick={handleGetStartedClick}
                    size='md'
                    color={theme.colors.green[7]}
                    radius="md"
                    mt='sm'
                  >
                    See What Your Guide Has In Store For You
                  </Button>
                </List>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              {/*<Card withBorder>*/}
                <AspectRatio ratio={2} mx='md'>
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    src={SeedingEdit}
                    poster={SeedingEditStill}
                    style={{width: '100%', height: '100%', border: 'none', borderRadius: '4px'}}
                  />
                </AspectRatio>
              {/*</Card>*/}
            </Grid.Col>
          </Grid>
        {/*</Card>*/}

        {/*  <Grid.Col span={{base: 12}}>*/}
        {/*    <Stack gap="sm">*/}
        {/*      <Title order={3}>Monthly Guide</Title>*/}
        {/*      <Text size="md">*/}
        {/*        Your personalized checklist for each month—complete with tasks, diagrams, notes, and more. Designed for*/}
        {/*        print or mobile so it’s easy to use in the garden.*/}
        {/*      </Text>*/}
        {/*      <Image*/}
        {/*        src={SuccessionPlanting}*/}
        {/*        alt="Monthly Guide preview"*/}
        {/*        radius="md"*/}
        {/*        // onClick={openGuidePreview}*/}
        {/*        style={{ cursor: 'pointer' }}*/}
        {/*      />*/}
        {/*      /!*<Modal opened={openedGuidePreview} onClose={closeGuidePreview} size="auto" title="Monthly Guide Preview" centered>*!/*/}
        {/*      /!*  <Image src={SuccessionPlanting} alt="Monthly Guide full view" />*!/*/}
        {/*      /!*</Modal>*!/*/}
        {/*    </Stack>*/}
        {/*  </Grid.Col>*/}
        {/*</Grid>*/}

      </Container>

      <Center>
        <Divider w='50%' my='md'/>
      </Center>

      {/*Succession Planting Section*/}
      <Container my="xl" size='lg' px={0}>
        <Grid gutter="xl" align="stretch">
          <Grid.Col span={{ base: 12, md: 6}}>
            <Image
              src={SuccessionPlanting}
              alt="Succession planting image"
              h="100%"
              fit="cover"
              radius="md"
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6}}>
            <Stack gap="sm">
              <Title order={2}>Keep Your Garden Producing All Season</Title>
              {/*<Text size="lg" fw={500}>Succession Planting, Done For You</Text>*/}
              <Text size="lg" fw={500}>The Growing Guide bakes succession planting right into your monthly plan.</Text>
              <Text>
                One of the biggest mistakes new gardeners make is planting everything all at once. While this might seem like a great way to fill your garden, it often leads to a feast-or-famine situation—too much harvest at one time, followed by a long stretch of nothing.
              </Text>
              <Text>
                Succession planting solves this problem by staggering your plantings so you can enjoy a continuous harvest throughout the season. The Growing Guide spaces out your planting dates according to the best planting times for each of your crops, so you can reuse garden space as crops finish.
              </Text>
              <Link to='/buy-v2'><IconArrowForward size={14} />Keep harvesting fresh veggies all season long</Link>
              {/*<Text>*/}
              {/*  Keep harvesting fresh veggies all season long, without needing to figure out the timing yourself.*/}
              {/*</Text>*/}
            </Stack>
          </Grid.Col>

        </Grid>
      </Container>

      {/*Companion Planting Section*/}
      <Container my="xl" size='lg' px={0}>
        <Grid gutter="xl" align="stretch">
          <Grid.Col span={{ base: 12, md: 6}}>
            <Stack gap="sm">
              <Title order={2} >Companion Planting Guidance</Title>
              <Text size="lg" fw={500}>Built-in Plant Pairing Suggestions for Healthier Growth</Text>
              <Text>
                Some plants love being neighbors.
                The Growing Guide gives you <strong>easy companion planting tips</strong> tailored to your crop list—so you can reduce pests, support soil health, and help your garden thrive without extra sprays or stress.
              </Text>
              <List
                spacing="sm"
                icon={<ThemeIcon color="green" size={20} radius="xl"><IconPlant2 size={14} /></ThemeIcon>}
              >
                <List.Item>Includes herb and flower pairings specific to the crops in your plan</List.Item>
                <List.Item>Naturally reduce pests without chemicals</List.Item>
                <List.Item>Increases the diversity and resilience of your garden</List.Item>
              </List>
              <Link to='/buy-v2'><IconArrowForward size={14} />See what companion plants will work for you</Link>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6}}>
            <Image
              h="100%"
              src={CompanionPlanting}
              alt="Companion planting image"
              radius="md"
              fit="cover"
            />
          </Grid.Col>
        </Grid>
      </Container>

      <Center>
        <Divider w='50%' my='md'/>
      </Center>

      <Container size="sm" my="xl" px={0}>
        {/*<Title order={2} ta="center" mb="md">*/}
        {/*  Planting Made Simple*/}
        {/*</Title>*/}
        <Title order={2}>
          {/*Transform your gardening experience with our step-by-step process. It's simple, quick, and tailored to you.*/}
          How It Works
        </Title>
        <Text size="lg" fw={500}>Transform your gardening experience with our step-by-step process.</Text>

        <Timeline
          active={hoveredTimelineElement}
          bulletSize={20}
          lineWidth={3}
          color="green"
          mt="xl"
          w="100%"
        >
          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(0)}
            title="Step 1: Tell Us About Your Garden"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Share a few quick details—where you live, and what you want to grow.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(1)}
            title="Step 2: Instant Personalized Plan"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Using your info, we generate a complete growing plan tailored to your crops and climate.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(2)}
            title="Step 3: Refine and Customize"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Adjust crop selections, explore companion planting, and add variety to revise your garden design until you love it.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(3)}
            title="Step 4: Get Your Personalized Guide"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Choose between a downloadable PDF or a printed booklet. Inside, you’ll find month-by-month tasks and note-taking space to track your journey, with smart techniques like succession planting and companion planting all built in.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(4)}
            title="Step 5: Your Monthly Guide"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Each chapter tells you what to do that month—what to plant, transplant, prune, or harvest. Keep your garden productive all season long without the need to reasearch every step of the way.
            </Text>
          </Timeline.Item>

          <Timeline.Item
            onMouseEnter={() => setHoveredTimelineElement(5)}
            title="Step 6: Grow with Confidence"
          >
            <Text c="dimmed" size="sm" mt="sm">
              Follow your plan, watch your garden flourish, and enjoy the rewards of a productive and thriving vegetable garden!
            </Text>
          </Timeline.Item>

          <Button
            component={Link}
            to="/buy-v2"
            onClick={handleGetStartedClick}
            size="md"
            color={theme.colors.green[7]}
            radius="md"
            mt='md'
            ml='md'
          >
            Get Started Now
          </Button>
        </Timeline>
      </Container>

      <Center>
        <Divider w='50%' my='md'/>
      </Center>

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

export default LandingPageV2
