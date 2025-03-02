import {Container, Title, Text, AppShell, Center, Image, Box} from "@mantine/core";
import ContactForm from "./contact-form.tsx";
import Logo from "../assets/full-logo-text-color.svg";

const ContactPage = () => {

  return (
    <Container size="sm" mt="xl">
      <Title mb='md'>Get in touch</Title>
      <Text mb='sm'>We value your feedback. Whether you have suggestions to enhance our app or need help with an order, please don't hesitate to reach out.</Text>
      {/*TODO: FAQs page*/}
      <Text mb='sm'>For additional info, check out our FAQs.</Text>
      <Box my='md'>
        <ContactForm />
      </Box>
      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Center py="md">
          <Image src={Logo} className="footer-logo" alt="logo" />
        </Center>
      </AppShell.Footer>
    </Container>
  )

}

export default ContactPage
