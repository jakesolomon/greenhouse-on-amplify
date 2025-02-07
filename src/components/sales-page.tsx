import {
  Container,
  Grid,
  Title,
  Text,
  useMantineTheme,
  AppShell,
  Center,
  Image,
  BackgroundImage, Card, List, ListItem, Button, AspectRatio
} from "@mantine/core";
import useWindowSize from "../helpers/useWindowSize.ts";
import Logo from "../assets/full-logo-text-color.svg";
import BookletCropped from "../assets/Booklet Mockup cropped lowres.png";
import Booklet from "../assets/Booklet Mockup large lowres.png";
import {useEffect} from "react";

const SalesPage = () => {

  const theme = useMantineTheme();

  // Scroll to top on first render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { width } = useWindowSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.xl

  const isMediumScreen = width > 1150

  const printPlanCard = (
    <>
      <Card shadow="md" padding="lg" radius="md">
        {
          !isMediumScreen &&
          <Card.Section mb="sm">
            <AspectRatio ratio={1.7}>
              <Image
                src={BookletCropped}
                // height={200}
                alt="Print Booklet"
              />
            </AspectRatio>
          </Card.Section>
        }
        <Title order={4} mb="sm">Printed Plan ($24.99)</Title>
        <List mb="sm">
          <ListItem>Custom printed and shipped</ListItem>
          <ListItem>Perfect for hands-on reference</ListItem>
          <ListItem>Free digital copy</ListItem>
        </List>
        <Button disabled>Coming soon</Button>
      </Card>
    </>
  )

  const digitalPlanCard = (
    <>
      <Card shadow="md" padding="lg" radius="md">
        <Title order={4} mb="sm">Digital Plan ($14.99)</Title>
        <List mb="sm">
          <ListItem>Instantly emailed as a PDF</ListItem>
          <ListItem>Print at home or use digitally</ListItem>
        </List>
        <Button disabled>Coming Soon</Button>
      </Card>
    </>
  )

  const featureList = (
    <>
      <Text size={isSmallScreen ? "md" : "lg"} mt="sm">🌿 Tailored to Your Garden – Based on your region and selected crops</Text>
      <Text size={isSmallScreen ? "md" : "lg"} mt="xs">📅 Step-by-Step Monthly Tasks – Know exactly what to do and when</Text>
      <Text size={isSmallScreen ? "md" : "lg"} mt="xs">📖 Beginner-Friendly – Clear, simple guidance for new gardeners</Text>
      <Text size={isSmallScreen ? "md" : "lg"} mt="xs">✅ Checklist Format – Stay on track with easy-to-follow lists</Text>
      <Text size={isSmallScreen ? "md" : "lg"} mt="xs">📊 Track Your Harvests – Note what works for future seasons</Text>
    </>
  )

  // const featureList = (
  //   <>
  //     <Text size={isSmallScreen ? "md" : "lg"} mt="sm">🌿 Based on your region and selected crops</Text>
  //     <Text size={isSmallScreen ? "md" : "lg"} mt="xs">📅 Step-by-Step Tasks by Month</Text>
  //     <Text size={isSmallScreen ? "md" : "lg"} mt="xs">📖 Clear, simple guidance for new gardeners</Text>
  //     <Text size={isSmallScreen ? "md" : "lg"} mt="xs">📊 Track Your Harvests</Text>
  //   </>
  // )

  if (isSmallScreen) {
    return (
      <>
        <Container p={0} m={0} fluid>
          <Grid>
            <Grid.Col>
              {/*<Title order={1} style={{fontSize: isSmallScreen ? "1.6rem" : "2.3rem"}} >Your Personalized Month-to-Month Garden Plan</Title>*/}
              <Title order={1} style={{fontSize: "1.7rem"}} >Your Month-to-Month Garden Plan</Title>
            </Grid.Col>
            <Grid.Col pt={0}>
              <Text size="md">
                Know exactly what to plant, when to plant it, and how to care for it—with a plan tailored to your garden.
              </Text>
            </Grid.Col>
            <Grid.Col>
              {printPlanCard}
            </Grid.Col>
            <Grid.Col>
              {digitalPlanCard}
            </Grid.Col>
            <Grid.Col mb="xl">
              {featureList}
            </Grid.Col>
          </Grid>
        </Container>
        <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
          <Center py="md">
            <Image src={Logo} className="footer-logo" alt="logo" />
          </Center>
        </AppShell.Footer>
      </>
    )
  }

  if (!isMediumScreen) {
    return(
      <>
        <Container px={0} mx={0} mb={60} fluid>
          <Center>
            <Grid
              justify="center"
              gutter="lg"
              my="lg"
              h="90vh"
              style={{
                position: "relative",
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'center',
                alignItems: 'left',
              }}
              w={isMediumScreen ? "55%" : "70%"}
            >
              <Grid.Col>
                {/*<Title order={1} style={{fontSize: isSmallScreen ? "1.6rem" : "2.3rem"}} >Your Personalized Month-to-Month Garden Plan</Title>*/}
                <Title order={1} style={{fontSize: "2.3rem"}} >Your Month-to-Month Garden Plan</Title>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6}}>
                {digitalPlanCard}
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6}}>
                {printPlanCard}
              </Grid.Col>
              <Grid.Col>
                <Text size="lg">
                  Know exactly what to plant, when to plant it, and how to care for it—with a plan tailored to your garden.
                </Text>
                {featureList}
              </Grid.Col>
            </Grid>
          </Center>
        </Container>
        <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
          <Center py="md">
            <Image src={Logo} className="footer-logo" alt="logo" />
          </Center>
        </AppShell.Footer>
      </>
    )
  }

  return(
    <>
      <Container p={0} m={0} w="100vw" fluid style={{position: "absolute", top: 60, right: 0, background: "#F7F4ED"}}>
        <BackgroundImage
          src={isMediumScreen ? Booklet : "undefined"}
          style={{backgroundPosition: "right"}}
          h="90vh"
          pt="xl"
          m={0}
        >
          <Container size="xl">
            <Grid
              justify="center"
              gutter="lg"
              my="lg"
              h="90vh"
              style={{
                position: "relative",
                top: 0,
                left: 0,
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'center',
                alignItems: 'left',
              }}
              w={isMediumScreen ? "55%" : "70%"}
            >
              <Grid.Col>
                {/*<Title order={1} style={{fontSize: isSmallScreen ? "1.6rem" : "2.3rem"}} >Your Personalized Month-to-Month Garden Plan</Title>*/}
                <Title order={1} style={{fontSize: "2.3rem"}} >Your Month-to-Month Garden Plan</Title>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6}}>
                {digitalPlanCard}
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6}}>
                {printPlanCard}
              </Grid.Col>
              <Grid.Col>
                <Text size="lg">
                  {/*Everything you need, organized month-by-month, to grow a thriving garden in your climate.*/}
                  Know exactly what to plant, when to plant it, and how to care for it—with a plan tailored to your garden.
                </Text>
                {featureList}
              </Grid.Col>
            </Grid>
          </Container>
        </BackgroundImage>
      </Container>

      <Container h="90vh" m={0} p={0} />

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Center py="md">
          <Image src={Logo} className="footer-logo" alt="logo" />
        </Center>
      </AppShell.Footer>
    </>
  )
}

export default SalesPage
