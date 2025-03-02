import {Container, Title, Text, AppShell, Center, Image, Box, useMantineTheme} from "@mantine/core";
import ContactForm from "./contact-form.tsx";
import Logo from "../assets/full-logo-text-color.svg";
import {useViewportSize} from "@mantine/hooks";
import {NavLink} from "react-router-dom";

const ContactPage = () => {

  // TODO this is a terrible way to do the footer
  // TODO also extract these smallScreen helpers out
  const { width } = useViewportSize();
  // const trueWidth = width < 960 + 32 * 2 ? width - 32 * 2 : 960
  const theme = useMantineTheme();
  const isSmallScreen = width.toString() < theme.breakpoints.md

  return (
    <Container size="sm" mt="md">
      <Title mb='md'>Get in touch</Title>
      <Text mb='sm'>We value your feedback. Whether you have suggestions to enhance our app or need help with an order, please don't hesitate to reach out.</Text>
      {/*TODO: FAQs page*/}
      <Text mb='sm'>For additional info, check out our <NavLink to='/faq'>FAQs</NavLink>.</Text>
      <Box my='md'>
        <ContactForm />
      </Box>
      <AppShell.Footer style={isSmallScreen ? {position: "relative", bottom: "0px"} : {position: "absolute", bottom: "100px"}} >
        <Center py="md">
          <Image src={Logo} className="footer-logo" alt="logo" h={120}/>
        </Center>
      </AppShell.Footer>
    </Container>
  )

}

export default ContactPage
