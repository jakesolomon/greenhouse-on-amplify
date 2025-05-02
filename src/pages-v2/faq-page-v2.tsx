import {
  Container,
  Title,
  Text,
  AppShell,
  Center,
  Grid,
  BackgroundImage,
  Box, useMantineTheme
} from "@mantine/core";
import Faq from "../components/faq.tsx";
import Garden3 from "../assets/garden-3-big.png";
import Footer from "../components/footer.tsx";
import {useViewportSize} from "@mantine/hooks";

const FaqPageV2 = () => {

  const { width } = useViewportSize();
  const theme = useMantineTheme();
  const isSmallScreen = width.toString() > theme.breakpoints.xs

  return (
    <>
      <BackgroundImage
        src={Garden3}
        style={{ backgroundPosition: "center", position: "absolute", left: 0, top: 60 }}
      >

        <Box
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            // background: `rgba(247, 244, 237, 0.1)`,
            background: `rgba(160, 108, 14, 0.1)`,
          }}
        />

        <Box h="20vh" />
        <Center style={{ position: 'relative', zIndex: 0 }}>
          <Title order={1} mb="sm" c="white" size={40} style={{ fontSize: "2.5rem" }}>
            {isSmallScreen ? "FAQ" : "Frequently Asked Questions"}
          </Title>
        </Center>
        <Box h="20vh" />
      </BackgroundImage>

      <Box h="48vh" />

      <Container size="md" px={0}>

        <Grid>
          <Grid.Col span={{ base: 12, sm: 6}}>

            {/*<Title order={2} mb="sm">*/}
            {/*  Frequently Asked Questions*/}
            {/*</Title>*/}
            <Text size="lg" c="dimmed" mt="sm">
              Have questions? We’ve got answers.
            </Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6}}>
            <Faq />
          </Grid.Col>
        </Grid>
      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )

  // return (
  //   <>
  //     <BackgroundImage
  //       src={Garden3}
  //       style={{ backgroundPosition: "center", position: "relative" }} // make sure it's relative
  //     >
  //
  //       <Box
  //         style={{
  //           position: 'absolute',
  //           inset: 0,
  //           zIndex: 0,
  //           // background: `rgba(247, 244, 237, 0.1)`,
  //           background: `rgba(160, 108, 14, 0.1)`,
  //           // background: `rgba(71, 48, 6, 0.2)`,
  //         }}
  //       />
  //
  //       <Box h="20vh" />
  //       <Center style={{ position: 'relative', zIndex: 1 }}>
  //         <Title order={1} mb="sm" c="white" size={40} style={{ fontSize: "2.5rem" }}>
  //           Frequently Asked Questions
  //         </Title>
  //       </Center>
  //       <Center style={{ position: 'relative', zIndex: 1 }}>
  //         {/*<Text size="lg" c="white">*/}
  //         {/*  Have questions? We’ve got answers.*/}
  //         {/*</Text>*/}
  //       </Center>
  //       <Box h="20vh" />
  //     </BackgroundImage>
  //     <Container size="md" mt="xl">
  //       {/*<Faq />*/}
  //
  //
  //       <Grid>
  //         <Grid.Col span={isSmallScreen ? 6 : 12}>
  //
  //           {/*<Title order={2} mb="sm">*/}
  //           {/*  Frequently Asked Questions*/}
  //           {/*</Title>*/}
  //           <Center>
  //             <Text size="lg" c="dimmed" mt="sm">
  //               Have questions? We’ve got answers.
  //             </Text>
  //           </Center>
  //         </Grid.Col>
  //
  //         <Grid.Col span={isSmallScreen ? 6 : 12}>
  //           <Faq />
  //         </Grid.Col>
  //       </Grid>
  //     </Container>
  //     <AppShell.Footer style={isSmallScreen ? {position: "relative", bottom: "0px"} : {position: "absolute", bottom: "100px"}} >
  //       <Center py="md">
  //         <Image src={Logo} className="footer-logo" alt="logo" h={120}/>
  //       </Center>
  //     </AppShell.Footer>
  //   </>
  // )

}

export default FaqPageV2
