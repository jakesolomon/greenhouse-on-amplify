import {Link} from "react-router-dom";
import {
  Container,
  Image,
  Grid, Flex, Stack, Title, Anchor
} from "@mantine/core";
import * as Sentry from '@sentry/react';

import Logo from "../assets/full-logo-text-color.svg";

const Footer = () => {

  const reportFeedbackButton = () => {
    const handleClick = () => {
      const eventId = Sentry.captureMessage("User opened general feedback dialog");
      Sentry.showReportDialog({ eventId });
    };

    return (
      <Anchor
        component="button"
        onClick={handleClick}
        c="#333" size="0.9rem" lh="sm" style={{textAlign: "left"}}
      >
        Report an Issue
      </Anchor>
    )
  }

  const errorButton = () => (
    <Anchor component="button" onClick={() => {
      throw new Error('This is your first error!')
    }} c="#333" size="0.9rem" lh="sm" style={{textAlign: "left"}}>Throw Error</Anchor>
  )

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
              <Anchor component={Link} to="/faq" size="sm" c="#333">FAQ</Anchor>
              <Anchor component={Link} to="/about" size="sm" c="#333">About</Anchor>
              <Anchor component={Link} to="/learn" size="sm" c="#333">Blog</Anchor>
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
              <Anchor component={Link} to="/contact" size="sm" c="#333">Contact</Anchor>
              <Anchor component={Link} to="/privacy" size="sm" c="#333">Privacy Policy</Anchor>
              <Anchor component={Link} to="/cookies" size="sm" c="#333">Cookie Policy</Anchor>
              {reportFeedbackButton()}
              {errorButton()}
            </Stack>
          </Flex>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Footer
