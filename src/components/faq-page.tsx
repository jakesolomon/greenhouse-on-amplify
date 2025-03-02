import {Container, Title, Text, AppShell, Center, Image, Grid, useMantineTheme} from "@mantine/core";
import Logo from "../assets/full-logo-text-color.svg";
import Faq from "./faq.tsx";
import {useViewportSize} from "@mantine/hooks";

const FaqPage = () => {

  const { width } = useViewportSize();
  // const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const theme = useMantineTheme();
  const isSmallScreen = width.toString() < theme.breakpoints.md

  return (
    <Container size="xl" mt="xl">
      <Grid>
        <Grid.Col span={isSmallScreen ? 12 : 6}>

          <Title order={2} mb="sm">
            Frequently Asked Questions
          </Title>
          <Text size="lg" c="dimmed">
            Have questions? We’ve got answers.
          </Text>
        </Grid.Col>

        <Grid.Col span={isSmallScreen ? 12 : 6}>
          <Faq />
        </Grid.Col>
      </Grid>
      <AppShell.Footer style={isSmallScreen ? {position: "relative", bottom: "0px"} : {position: "absolute", bottom: "100px"}} >
        <Center py="md">
          <Image src={Logo} className="footer-logo" alt="logo" h={120}/>
        </Center>
      </AppShell.Footer>
    </Container>
  )

}

export default FaqPage
