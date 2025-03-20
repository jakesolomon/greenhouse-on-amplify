import {
  Container,
  Title,
  Text,
  AppShell,
  Center,
  Box,
  BackgroundImage,
  Grid
} from "@mantine/core";
import ContactForm from "./contact-form.tsx";
import {NavLink} from "react-router-dom";
import Garden4 from "../assets/garden-4-big.png";
import Footer from "./footer.tsx";

const ContactPage = () => {

  return (
    <>
      <BackgroundImage
        src={Garden4}
        style={{ backgroundPosition: "50% 60%", position: "absolute", left: 0, top: 60 }}
      >

        <Box
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            // background: `rgba(160, 108, 14, 0.16)`,
            background: `rgba(160, 108, 70, 0.2)`,
          }}
        />

        <Box h="20vh" />
        <Center style={{ position: 'relative', zIndex: 0 }}>
          <Title order={1} mb="sm" c="white" size={40} style={{ fontSize: "2.5rem" }}>
            Get in Touch
          </Title>
        </Center>
        <Box h="20vh" />
      </BackgroundImage>

      <Box h="48vh" />

      <Container size="md" px={0}>

        <Grid mb="xl">
          <Grid.Col span={{ base: 12, sm: 6}}>
            {/*<Title mb='md'>Get in touch</Title>*/}
            <Text mb='sm'>We value your feedback. Whether you have suggestions to enhance our app or need help with an order, please don't hesitate to reach out.</Text>
            <Text mb='sm'>For additional info, check out our <NavLink to='/faq'>FAQs</NavLink>.</Text>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6}}>
            <ContactForm />
          </Grid.Col>
        </Grid>

      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )

}

export default ContactPage
