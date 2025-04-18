import {
  Text,
  Grid,
  Tooltip, Card, AspectRatio, Image, Group, Badge, useMantineTheme, Divider, Box
} from "@mantine/core";
import { Carousel } from '@mantine/carousel';

import BroccoliLineArt from "../assets/line-art/broccoli-color.png";
import CarrotLineArt from "../assets/line-art/carrot-color.png";
import CauliflowerLineArt from "../assets/line-art/cauliflower-color.png";
import CucumberLineArt from "../assets/line-art/cucumber-color.png";
import GarlicLineArt from "../assets/line-art/garlic-color.png";
import GreenBeanLineArt from "../assets/line-art/green-bean-color.png";
import KaleLineArt from "../assets/line-art/kale-color.png";
import LettuceLineArt from "../assets/line-art/lettuce-color.png";
import OnionLineArt from "../assets/line-art/onion-color.png";
import PepperLineArt from "../assets/line-art/pepper-color.png";
import RadishLineArt from "../assets/line-art/radish-color.png";
import TomatoLineArt from "../assets/line-art/tomato-color.png";
import WinterRadishLineArt from "../assets/line-art/winter-radish-color.png";

import "./testimonials.css"
import useWindowSize from "../helpers/useWindowSize.ts";

const Testimonials = () => {

  const theme = useMantineTheme();

  const { width } = useWindowSize();
  const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const isSmallScreen = trueWidth.toString() < theme.breakpoints.lg

  const lineArt = (src: string, alt: string) =>
    <Tooltip label={alt}>
      <Card shadow="sm" p={7} radius="md" withBorder style={{borderWidth: "1.2px", borderColor: "#777"}} className="line-art">
        <AspectRatio ratio={1}>
          <Image
            fit="contain"
            src={src}
            alt={alt}
          />
        </AspectRatio>
      </Card>
    </Tooltip>

  const ryan =
    <Card shadow="sm" px="lg" radius="md" withBorder>
      <Text fw={500} style={{lineHeight: "1.5rem"}}>“First time growing anything besides mold in my fridge, and I’ve already got seedlings on the windowsill.”</Text>
      <Text c="dimmed" fs="italic">
        Ryan F. - Greater Boston Area
      </Text>
      <Divider my="md" w="80%"/>
      <Group mb={0}>
        <Text fw={700} >Ryan's Plan</Text>
        <Badge color="green" >Plant Hardiness Zone 6</Badge>
      </Group>

      <Grid mt='sm' gutter="sm">
        <Grid.Col span={{ base: 3 }}>
          {lineArt(TomatoLineArt, "Tomato")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(BroccoliLineArt, "Broccoli")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(CucumberLineArt, "Cucumber")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(LettuceLineArt, "Lettuce")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(GarlicLineArt, "Garlic")}
        </Grid.Col>
      </Grid>
    </Card>

  // const ethan =
  //   <Card shadow="sm" px="lg" radius="md" withBorder>
  //     <Text fw={500} style={{lineHeight: "1.5rem"}}>“Gonna use it for our planning season in Biddeford. Very very cool!”</Text>
  //     <Text c="dimmed" fs="italic">
  //       Ethan B. - Biddeford, ME
  //     </Text>
  //     <Group mt="md" mb={0}>
  //       {/*<Title order={4} >Ethan's Plan</Title>*/}
  //       <Badge color="green" >Plant Hardiness Zone 6</Badge>
  //     </Group>
  //
  //     <Grid mt='sm' gutter="sm">
  //       <Grid.Col span={{ base: 3 }}>
  //         {lineArt(RadishLineArt, "Radish")}
  //       </Grid.Col>
  //       <Grid.Col span={{ base: 3 }}>
  //         {lineArt(BroccoliLineArt, "Broccoli")}
  //       </Grid.Col>
  //       <Grid.Col span={{ base: 3 }}>
  //         {lineArt(CucumberLineArt, "Cucumber")}
  //       </Grid.Col>
  //       <Grid.Col span={{ base: 3 }}>
  //         {lineArt(CauliflowerLineArt, "Cauliflower")}
  //       </Grid.Col>
  //       <Grid.Col span={{ base: 3 }}>
  //         {lineArt(LettuceLineArt, "Lettuce")}
  //       </Grid.Col>
  //       <Grid.Col span={{ base: 3 }}>
  //         {lineArt(WinterRadishLineArt, "Winter Radish")}
  //       </Grid.Col>
  //     </Grid>
  //   </Card>

  const kelly =
    <Card shadow="sm" px="lg" radius="md" withBorder>
      <Text fw={500} style={{lineHeight: "1.5rem"}}>“Saved me hours of googling every single thing I want to grow. Satisfying and easy to have it all done for me.”</Text>
      <Text c="dimmed" fs="italic">
        Kelly M. - Boston, MA
      </Text>
      <Divider my="md" w="80%"/>
      <Group mb={0}>
        <Text fw={700}>Kelly's Plan</Text>
        <Badge color="green" >Plant Hardiness Zone 6</Badge>
      </Group>

      <Grid mt='sm' gutter="sm">
        <Grid.Col span={{ base: 3 }}>
          {lineArt(CarrotLineArt, "Carrot")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(OnionLineArt, "Onion")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(TomatoLineArt, "Tomato")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(PepperLineArt, "Pepper")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(GreenBeanLineArt, "Green Bean")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(BroccoliLineArt, "Broccli")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(LettuceLineArt, "Lettuce")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(KaleLineArt, "Kale")}
        </Grid.Col>
      </Grid>
    </Card>

  const enes =
    <Card shadow="sm" px="lg" radius="md" withBorder>
      <Text fw={500} style={{lineHeight: "1.5rem"}}>“This is the first time I’ve had a garden plan that actually fits my space. I’m really excited for this growing season.”</Text>
      <Text c="dimmed" fs="italic">
        Enes O. - Boulder, CO
      </Text>
      <Divider my="md" w="80%"/>
      <Group mb={0}>
        <Text fw={700} >Enes's Plan</Text>
        <Badge color={theme.colors.cyan[6]} >Plant Hardiness Zone 5</Badge>
      </Group>

      <Grid mt='sm' gutter="sm">
        <Grid.Col span={{ base: 3 }}>
          {lineArt(RadishLineArt, "Radish")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(BroccoliLineArt, "Broccoli")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(CauliflowerLineArt, "Cauliflower")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(CucumberLineArt, "Cucumber")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(LettuceLineArt, "Lettuce")}
        </Grid.Col>
        <Grid.Col span={{ base: 3 }}>
          {lineArt(WinterRadishLineArt, "Winter Radish")}
        </Grid.Col>
      </Grid>
    </Card>

  if (isSmallScreen) {
    return (
      <Box style={{position: "relative"}}>
        <Carousel slideSize="80%" slideGap="md" controlSize={45} loop mt='lg' mb='lg' style={{position: "relative", top: 0, left: -35}} w="100vw">
          <Carousel.Slide>{kelly}</Carousel.Slide>
          <Carousel.Slide>{ryan}</Carousel.Slide>
          <Carousel.Slide>{enes}</Carousel.Slide>
        </Carousel>
      </Box>
      )
  }

  return (
    <>
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, sm: 4}}>
          {ryan}
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4}}>
          {kelly}
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4}}>
          {enes}
        </Grid.Col>
      </Grid>
    </>

  )
}

export default Testimonials
