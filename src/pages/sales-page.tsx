import {
  Container,
  Grid,
  Title,
  Text,
  useMantineTheme,
  AppShell,
  Image,
  BackgroundImage, Card, Box, Divider
} from "@mantine/core";
import useWindowSize from "../helpers/useWindowSize.ts";
import BookletMockupRight from "../assets/booklet-mockup-right-extended.png";
import {useEffect, useState} from "react";
import Footer from "../components/footer.tsx";
import {NavLink} from "react-router-dom";
import LandingPageVideoTiny from "../assets/landing-page-video-tiny.mov";
import SeedingEdit from "../assets/seeding-edit-1.mp4"
import SeedingEditStill from "../assets/seeding-edit-still.png";
import Faq from "../components/faq.tsx";
import Testimonials from "../components/testimonials.tsx";
import SalesCardPrintPlan from "../components/sales-card-print-guide.tsx";
import SalesCardDigitalGuide from "../components/sales-card-digital-guide.tsx";

const SalesPage = () => {

  const theme = useMantineTheme();

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

  // Scroll to top on first render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { width } = useWindowSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.xl

  // const printPlanCard = (
  //   <Box style={{position: "relative"}}>
  //     <Center w="100%">
  //       <Badge color={theme.colors.green[7]} variant="filled" size="lg" radius='xs' fullWidth style={{ position: 'absolute', top: -10 }} />
  //       <Badge color={theme.colors.green[7]} variant="filled" size="lg" radius='md' fullWidth style={{ position: 'absolute', top: -24 }}>
  //         Best for Outdoor Use
  //       </Badge>
  //     </Center>
  //     <Card shadow="md" padding="lg" radius="md" withBorder style={{ border: `2px solid ${theme.colors.green[7]}` }} >
  //     {/*<Card shadow="lg" padding="lg" radius="md" withBorder >*/}
  //       <Card.Section mb="sm">
  //         <AspectRatio ratio={1.7}>
  //           <Image
  //             src={BookletMockupLeft}
  //             alt="Print Booklet"
  //           />
  //         </AspectRatio>
  //       </Card.Section>
  //       <Title order={4}>Printed Plan ($39.99)</Title>
  //       <Text fs="italic" mb='xs' size='sm'>Printed on thick, matte stock that resists water and tearing—perfect for muddy hands and sunny days.</Text>
  //       <List mb="sm">
  //         {/*<ListItem>Custom printed and shipped</ListItem>*/}
  //         {/*<ListItem>Professionally printed & shipped</ListItem>*/}
  //         {/*<ListItem>Water-resistant, high-quality paper</ListItem>*/}
  //         <ListItem>Built for garden use—no smudgy screens</ListItem>
  //         <ListItem>Free digital copy included</ListItem>
  //         {/*<ListItem>Perfect for hands-on reference</ListItem>*/}
  //         {/*<ListItem>Free digital copy</ListItem>*/}
  //       </List>
  //       <Button component={Link} to="/checkout?product=print" color={theme.colors.green[7]}>Buy Now</Button>
  //       {/*<Button disabled>Coming soon</Button>*/}
  //     </Card>
  //   </Box>
  // )
  //
  // const digitalPlanCard = (
  //   <>
  //     <Card shadow="md" padding="lg" radius="md" withBorder>
  //       <Card.Section mb="sm">
  //         <AspectRatio ratio={1.7}>
  //           <Image
  //             src={DigitalMockup}
  //             alt="Digital Booklet"
  //           />
  //         </AspectRatio>
  //       </Card.Section>
  //       <Title order={4} mb="sm">Digital Plan ($24.99)</Title>
  //       <List mb="sm">
  //         <ListItem>Instantly emailed as a PDF</ListItem>
  //         <ListItem>Print at home or use digitally</ListItem>
  //       </List>
  //       <Button component={Link} to="/checkout?product=digital" color={theme.colors.green[7]}>Buy Now</Button>
  //       {/*<Button disabled>Coming soon</Button>*/}
  //     </Card>
  //   </>
  // )

  // const featureList = (
  //   <>
  //     <Text size={isSmallScreen ? "md" : "lg"} mt="sm">🌿 Tailored to Your Garden – Based on your region and selected crops</Text>
  //     <Text size={isSmallScreen ? "md" : "lg"} mt="xs">📅 Step-by-Step Monthly Tasks – Know exactly what to do and when</Text>
  //     <Text size={isSmallScreen ? "md" : "lg"} mt="xs">📖 Beginner-Friendly – Clear, simple guidance for new gardeners</Text>
  //     <Text size={isSmallScreen ? "md" : "lg"} mt="xs">✅ Checklist Format – Stay on track with easy-to-follow lists</Text>
  //     <Text size={isSmallScreen ? "md" : "lg"} mt="xs">📊 Track Your Harvests – Note what works for future seasons</Text>
  //   </>
  // )

  if (isSmallScreen) {
    return (
      <>
        <Container size="xl"  >
          <Grid
            justify="center"
            gutter="lg"
            style={{
              position: "relative",
              top: 0,
              left: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'left',
            }}
            w="100%"
          >
            <Grid.Col p={0}>
              <Title order={2} mb='lg' >Get Your Personalized Monthly Guide</Title>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6}} px={0}>
              <SalesCardPrintPlan />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6}} px={0}>
              <SalesCardDigitalGuide />
            </Grid.Col>
            <Grid.Col span={{base: 12}} px={0}>
              {canAutoplay
                ? <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={SeedingEdit}
                  poster={SeedingEditStill}
                  style={{
                    position: 'relative',
                    top: 0,
                    left: 0,
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                />
                : <Image src={SeedingEditStill}></Image>
              }
            </Grid.Col>
            <Grid.Col span={{base: 12}} px={0}>
              <Title size='xl' style={{lineHeight: 1.2}} fw={700} mb="md">Everything you need, organized month-by-month,
                to grow a thriving garden.</Title>
              <Text mb='md'>For each order, we generate a unique guide using the same custom scheduling process we use
                to create your free plan overview, based on your crops and local climate.</Text>
              <Text mb='md'>You get a downloadable PDF or print booklet that includes month-by-month tasks and
                tried-and-true gardening guidance.</Text>
              <Text><strong>Not satisfied? No worries.</strong> Just send us a message—we’ll give you a full refund, no questions asked.</Text>
            </Grid.Col>
            <Divider my="md" w="80%"/>
            <Grid.Col span={{base: 12}} px={0}>
              <Title order={2}>Don’t Just Take Our Word For It</Title>
              <Text fs='italic' size='lg' mb='sm'>See what others are saying</Text>
              <Testimonials />
            </Grid.Col>
            <Divider my="md" w="80%"/>
          </Grid>
        </Container>

        <Container pt="lg" px={0}>
          <Title order={2}>Still have questions?</Title>
          <Text mb='md'>Feel free to <NavLink to='/contact'>contact us</NavLink> or check out our FAQs.</Text>
          <Faq />
        </Container>

        <AppShell.Footer style={{position: "relative", bottom: "0px"}}>
          <Footer/>
        </AppShell.Footer>
      </>
    )
  }

  return (
    <>
      <Container p={0} m={0} w="100vw" fluid style={{position: "absolute", top: 60, right: 0 }}>
        <BackgroundImage
          src={BookletMockupRight}
          style={{backgroundPosition: "right"}}
          h="580px"
          pt="lg"
          m={0}
        >

          {/* Gradient Overlay */}
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background:
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
              justify="center"
              gutter="lg"
              style={{
                position: "relative",
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'left',
              }}
              w="60%"
            >
              <Grid.Col>
                <Title order={1} style={{fontSize: "2rem"}} mb='lg'>Get Your Personalized Monthly Guide</Title>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6}}>
                <SalesCardDigitalGuide />
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6}}>
                <SalesCardPrintPlan />
              </Grid.Col>
            </Grid>
          </Container>
        </BackgroundImage>
      </Container>

      <Container h="580px" />

      {/*<Container size="xl" h="500px" style={{position: "relative"}}>*/}
      {/*  {*/}
      {/*    canAutoplay &&*/}
      {/*    <>*/}
      {/*      <Text size="lg" m="xl">*/}
      {/*        Everything you need, organized month-by-month, to grow a thriving garden in your climate.*/}
      {/*        /!*Know exactly what to plant, when to plant it, and how to care for it—with a plan tailored to your garden.*!/*/}
      {/*      </Text>*/}
      {/*      <video*/}
      {/*        autoPlay*/}
      {/*        muted*/}
      {/*        loop*/}
      {/*        playsInline*/}
      {/*        src={SeedingEdit}*/}
      {/*        // poster={LandingPageStill}*/}
      {/*        style={{*/}
      {/*          position: 'absolute',*/}
      {/*          top: 0,*/}
      {/*          left: 0,*/}
      {/*          inset: 0,*/}
      {/*          width: '100%',*/}
      {/*          height: '500px',*/}
      {/*          objectFit: 'cover',*/}
      {/*          zIndex: 0,*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        /!*<Overlay color="#000" backgroundOpacity={0.55} />*!/*/}
      {/*      </video>*/}
      {/*    </>*/}
      {/*  }*/}
      {/*</Container>*/}

      <Container size="lg" h="370px" mb='lg' style={{zIndex: 1}}>
        <Grid m={0} p={0} gutter="xl">
          <Grid.Col span={{ base: 6, md: 6}}>
            {/*<Text size="xl">Everything you need, organized month-by-month, to grow a thriving garden in your climate.</Text>*/}
            <Title order={2} mb="sm">Everything you need, organized month-by-month, to grow a thriving garden.</Title>
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
          <Grid.Col span={{ base: 6, md: 6}} style={{position: "relative"}}>
            {/*<Title order={1} mt="md" style={{zIndex: 10}}>Everything you need, organized month-by-month, to grow a thriving garden in your climate.</Title>*/}
            <Card h="350px">
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

      <Container size="lg" py="lg">
        {/*<Center>*/}
          <Title order={2} >Don’t Just Take Our Word For It</Title>
        {/*</Center>*/}
        {/*<Center>*/}
          <Text mb='md' fs='italic' size='lg'>See what others are saying.</Text>
        {/*</Center>*/}
        <Testimonials />
      </Container>

      <Container py="lg" px={0}>
        <Title order={2}>Still have questions?</Title>
        <Text mb='md'>Feel free to <NavLink to='/contact'>contact us</NavLink> or check out our FAQs.</Text>
        {/*<Grid>*/}
        {/*  <Grid.Col span={{ base: 12, sm: 6}}>*/}

            {/*<Title order={2} mb="sm">*/}
            {/*  Frequently Asked Questions*/}
            {/*</Title>*/}
            {/*<Text>*/}
            {/*  Still have questions? Feel free to <NavLink to='/contact'>contact us</NavLink> or check out our FAQs:*/}
            {/*</Text>*/}
          {/*</Grid.Col>*/}
          {/**/}
          {/*<Grid.Col span={{ base: 12, sm: 6}}>*/}
            <Faq />
          {/*</Grid.Col>*/}
        {/*</Grid>*/}
      </Container>

      {/*<Container size="sm" pb="lg">*/}
      {/*  <Text size="lg">*/}
      {/*    Everything you need, organized month-by-month, to grow a thriving garden in your climate.*/}
      {/*    /!*Know exactly what to plant, when to plant it, and how to care for it—with a plan tailored to your garden.*!/*/}
      {/*  </Text>*/}
      {/*  {featureList}*/}
      {/*</Container>*/}

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )
}

export default SalesPage
