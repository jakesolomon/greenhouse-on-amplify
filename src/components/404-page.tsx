import { NavLink } from "react-router-dom";
import {
  Button,
  Container,
  Title,
  Text, AppShell, useMantineTheme,
} from "@mantine/core";
import Footer from "./footer.tsx";

const NotFound = () => {

  const theme = useMantineTheme();

  return (
    <>
      <Container my="xl" h="50vh">
        <Title order={1} my="md">Page Not Found</Title>
        <Text my="md">Sorry, the page you're looking for doesn't exist.</Text>
        <NavLink to="/">
          <Button color={theme.colors.green[7]}>
            Go Home
          </Button>
        </NavLink>
      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )
};

export default NotFound;
