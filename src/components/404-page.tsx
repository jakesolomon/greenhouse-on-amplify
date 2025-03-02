import { NavLink } from "react-router-dom";
import {
  Button,
  Container,
  Title,
  Text,
} from "@mantine/core";

const NotFound = () => (
  <Container>
    <Title order={1} my="md">Page Not Found</Title>
    <Text my="md">Sorry, the page you're looking for doesn't exist.</Text>
    <NavLink to="/">
        <Button>
          Go Home
        </Button>
    </NavLink>
  </Container>
);

export default NotFound;
