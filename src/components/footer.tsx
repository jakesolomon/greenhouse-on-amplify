import {Link, useLocation} from "react-router-dom";
import {
  Container,
  Image,
  Grid, Flex, Stack, Title, Anchor
} from "@mantine/core";

import Logo from "../assets/full-logo-text-color.svg";

const Footer = () => {

  const location = useLocation();
  const isV2 = location.pathname.includes('v2');

  return(
    <Container py='md'>
      <Grid align='center'>
        <Grid.Col span={{ base: 12, xs: 4 }}>
          <Image src={Logo} className="footer-logo" alt="logo" fit="fill" h={140}/>
        </Grid.Col>
        <Grid.Col span={{ base: 1, xs: 2 }} visibleFrom="xs" />
        <Grid.Col span={{ base: 6, xs: 3 }} >
          <Flex justify="center">
            <Stack gap={4}>
              <Title order={4} c="dimmed">Learn</Title>
              {/*<Button className="termly-display-preferences"></Button>*/}
              {/*<Anchor size="sm" href="#" className="termly-display-preferences">Consent Preferences</Anchor>*/}
              <Anchor component={Link} to={isV2 ? "/faq-v2" : "/faq"} size="sm" c="#333">FAQ</Anchor>
              <Anchor component={Link} to={isV2 ? "/about-v2" : "/about"} size="sm" c="#333">About</Anchor>
              <Anchor component={Link} to={isV2 ? "/learn-v2" : "/learn"} size="sm" c="#333">Blog</Anchor>
              {/*<a href="#" className="termly-display-preferences">Consent Preferences</a>*/}
              {/*<a href="#" className="termly-display-preferences">Consent Preferences</a>*/}
              {/*<a href="#" className="termly-display-preferences">Consent Preferences</a>*/}
            </Stack>
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 6, xs: 3 }} >
          <Flex justify="center">
            <Stack gap={4}>
              <Title order={4} c="dimmed">Support</Title>
              <Anchor component={Link} to={isV2 ? "/contact-v2" : "/contact"} size="sm" c="#333">Contact</Anchor>
              <Anchor component={Link} to={isV2 ? "/privacy-v2" : "/privacy"} size="sm" c="#333">Privacy Policy</Anchor>
              <Anchor component={Link} to={isV2 ? "/cookies-v2" : "/cookies"} size="sm" c="#333">Cookie Policy</Anchor>
            </Stack>
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Footer
