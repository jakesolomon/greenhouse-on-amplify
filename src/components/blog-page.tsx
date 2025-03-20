import {
  Text,
  Container,
  Title,
  Stack,
  Box,
  Divider,
  AppShell,
  Center,
  Image,
  Grid,
  useMantineTheme, BackgroundImage
} from "@mantine/core";
import {Link} from "react-router-dom";
import SuccessionPlanting from "../assets/succession-planting-sketch.png";
import CompanionPlanting from "../assets/companion-planting-sketch.png";
import {useViewportSize} from "@mantine/hooks";
import Garden2 from "../assets/garden-2-big.png";
import Footer from "./footer.tsx";

const BlogPage = () => {

  const { width } = useViewportSize();
  const theme = useMantineTheme();
  const isSmallScreen = width.toString() < theme.breakpoints.xs

  return (
    <>
      <BackgroundImage
        src={Garden2}
        style={{ backgroundPosition: "50% 70%", position: "absolute", left: 0, top: 60 }}
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
            Digging Deeper
          </Title>
        </Center>
        <Box h="20vh" />
      </BackgroundImage>

      <Box h="48vh" />

      <Container px={0}>
        <Stack gap='xs' mb='lg'>

          <Grid gutter='lg'>
            {
              !isSmallScreen &&
              <Grid.Col span={{ base: 12, sm: 5 }}>
                <Image src={CompanionPlanting} fit="cover" h="300" radius='sm'/>
              </Grid.Col>
            }
            <Grid.Col span={{ base: 12, sm: 7 }}>
              <Box>
                <Text size='xl' style={{lineHeight: 1.2}} mb="xs">Companion Planting: Symbiotic Relationships in Your Backyard</Text>
                <Text c="dimmed" fs="italic" size='sm' mb='sm'>March 3, 2024</Text>
                <Text mb='xs'>When planning a garden, most people think about what they want to grow, but not necessarily what should grow together. That’s where companion planting comes in—a time-tested technique that groups plants in a way that improves growth, deters pests, and maximizes space. By understanding which plants make good neighbors (and which ones don’t), you can create a healthier, more productive garden with less effort.</Text>
                <Link to={'/learn/companion-planting'}><Text c="dimmed" td="underline">Read more</Text></Link>
              </Box>
            </Grid.Col>
            {
              isSmallScreen &&
              <Grid.Col span={{ base: 12, sm: 5 }}>
                <Image src={CompanionPlanting} fit="cover" h="300" radius='sm'/>
              </Grid.Col>
            }
          </Grid>

          <Center>
            <Divider my="md" w="80%"/>
          </Center>

          <Grid gutter='lg'>
            <Grid.Col span={{ base: 12, sm: 5 }}>
              <Image src={SuccessionPlanting} fit="cover" h="300" radius='sm'/>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 7 }}>
              <Box>
                <Text size='xl' style={{lineHeight: 1.2}} mb="xs">Succession Planting: How to Keep Your Garden Producing All Season Long</Text>
                <Text c="dimmed" fs="italic" size='sm' mb='sm'>March 3, 2024</Text>
                <Text mb='xs'>One of the biggest mistakes new gardeners make is planting everything all at once. While this might seem like a great way to fill your garden, it often leads to a feast-or-famine situation—too much harvest at one time, followed by a long stretch of nothing. Succession planting solves this problem by staggering your plantings so you can enjoy a continuous harvest throughout the season.</Text>
                <Link to={'/learn/succession-planting'}><Text c="dimmed" td="underline">Read more</Text></Link>
              </Box>
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

export default BlogPage
