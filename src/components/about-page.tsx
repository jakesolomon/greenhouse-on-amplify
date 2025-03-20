import {Container, Title, Text, Grid, Stack, Image, AppShell, Center, BackgroundImage, Box} from "@mantine/core";
import Jake from "../assets/jake-edit3.jpg"
import Me from "../assets/me.jpg"
import Anime from "../assets/anime-product-edit-extended-lowres.png";
import Footer from "./footer.tsx";

const AboutPage = () => {

  return (
    <>
      <BackgroundImage
        src={Anime}
        style={{ backgroundPosition: "50% 30%", position: "absolute", left: 0, top: 60 }}
      >

        <Box
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: `rgba(160, 108, 14, 0.16)`,
          }}
        />

        <Box h="20vh" />
        <Center style={{ position: 'relative', zIndex: 0 }}>
          <Title order={1} mb="sm" c="white" size={40} style={{ fontSize: "2.5rem" }}>
            About Us
          </Title>
        </Center>
        <Center style={{ position: 'relative', zIndex: 1 }}>
          {/*<Text size="lg" c="white">*/}
          {/*  Have questions? We’ve got answers.*/}
          {/*</Text>*/}
        </Center>
        <Box h="20vh" />
      </BackgroundImage>

      <Box h="48vh" />

      <Container size='md' px={0}>
        <Stack mb='md'>
          <Title order={2}>We're gardeners that want to skip the boring stuff and get to the fun part.</Title>
          <Text>Gardening should be simple, but finding a guide that fits your needs isn’t. And, if you’ve ever tried planning a vegetable garden from scratch, you know how overwhelming it can be. Neither option is ideal—one is too generic, and the other is time-consuming and complicated.</Text>
          <Text>The Growing Guide takes a different approach. Instead of making you adjust someone else’s plan to your needs or piece together scattered advice, it builds a fully customized month-by-month planting schedule based on your location, crops, and gardening goals. With a clear, personalized plan in hand, you can skip the stress of planning and get straight to growing.</Text>

          <Title order={2} mt="sm">How It Works</Title>
          <Text>Using climate predictions about your growing region and the crops you’d like to grow, we calculate the best planting times for your future garden. Our algorithm allocates your plantings to different plots to make the most of your available space—maximizing harvests by aligning planting and harvest times so you can replant beds multiple times in one season. Finally, using an AI model trained on tried-and-true agricultural knowledge, The Growing Guide transforms your planting schedule into a completely unique-to-you guide that lays out your tasks month by month, so you can spend less time planning and more time growing.</Text>

          <Title order={2} mt="sm">Meet the Team</Title>
          <Grid gutter='xl'>
            <Grid.Col span={{ base: 12, md: 5 }} style={{maxWidth: 400}}>
              <Image src={Me} h={350} radius='lg' mb='md'></Image>
              <Text size='lg' ><b>Jake S. - Gardener & Developer</b></Text>
              <Text>Jake built The Growing Guide to solve the one part of gardening he never enjoyed—planning. After years of growing his own food and working on organic farms, he saw firsthand how much time and effort went into making a planting schedule. Now, he’s using his background in tech to make garden planning easier for everyone.</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }} style={{maxWidth: 400}}>
              <Image src={Jake} h={350} radius='lg' mb='md'></Image>
              <Text size='lg' ><b>Jake M. - Product & Operations</b></Text>
              <Text>Jake keeps The Growing Guide moving forward, managing product development and making sure everything comes together smoothly. From testing early versions of the planner to overseeing its launch, he’s been hands-on every step of the way.</Text>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )

}

export default AboutPage
