import {
  Container,
  Grid,
  Title,
  Text,
  useMantineTheme,
  AppShell,
  Image,
  BackgroundImage, Card, List, ListItem, Button, AspectRatio, Box
} from "@mantine/core";
import useWindowSize from "../helpers/useWindowSize.ts";
import BookletMockupRight from "../assets/booklet-mockup-right-extended.png";
import BookletMockupLeft from "../assets/booklet-mockup-left.png";
import {useEffect} from "react";
import Footer from "./footer.tsx";

const SalesPage = () => {

  const theme = useMantineTheme();

  // Scroll to top on first render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { width } = useWindowSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.xl

  const printPlanCard = (
    <>
      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Card.Section mb="sm">
          <AspectRatio ratio={1.7}>
            <Image
              src={BookletMockupLeft}
              alt="Print Booklet"
            />
          </AspectRatio>
        </Card.Section>
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
      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Title order={4} mb="sm">Digital Plan ($14.99)</Title>
        <List mb="sm">
          <ListItem>Instantly emailed as a PDF</ListItem>
          <ListItem>Print at home or use digitally</ListItem>
        </List>
        {/*<Button component={Link} to="/checkout" color={theme.colors.green[7]}>Buy Now</Button>*/}
        <Button disabled>Coming soon</Button>
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

  if (isSmallScreen) {
    return (
      <>
        <Container size="xl" p={0} >
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
            w={isSmallScreen ? "100%" : "60%"}
          >
            <Grid.Col>
              <Title order={2} >Get Your Personalized Monthly Guide</Title>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6}}>
              {printPlanCard}
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6}}>
              {digitalPlanCard}
            </Grid.Col>
          </Grid>
        </Container>

        <Container size="sm" py="lg">
          <Text size="lg">
            Everything you need, organized month-by-month, to grow a thriving garden in your climate.
            {/*Know exactly what to plant, when to plant it, and how to care for it—with a plan tailored to your garden.*/}
          </Text>
          {featureList}
        </Container>

        <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
          <Footer />
        </AppShell.Footer>
      </>
    )
  }

  return(
    <>
      <Container p={0} m={0} w="100vw" fluid style={{position: "absolute", top: 60, right: 0 }}>
        <BackgroundImage
          src={BookletMockupRight}
          style={{backgroundPosition: "right"}}
          h="540px"
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
                <Title order={1} style={{fontSize: "2rem"}} >Get Your Personalized Monthly Guide</Title>
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6}}>
                {printPlanCard}
              </Grid.Col>
              <Grid.Col span={{ base: 12, xs: 6}}>
                {digitalPlanCard}
              </Grid.Col>
            </Grid>
          </Container>
        </BackgroundImage>
      </Container>

      <Container h="540px" />

      <Container size="sm" pb="lg">
        <Text size="lg">
          Everything you need, organized month-by-month, to grow a thriving garden in your climate.
          {/*Know exactly what to plant, when to plant it, and how to care for it—with a plan tailored to your garden.*/}
        </Text>
        {featureList}
      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )
}

export default SalesPage
