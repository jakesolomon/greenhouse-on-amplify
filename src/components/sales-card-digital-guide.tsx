import {
  Title,
  Card, AspectRatio, Image, List, ListItem, Button, useMantineTheme
} from "@mantine/core";
import {Link} from "react-router-dom";
import DigitalMockup from "../assets/digital-plan-mockup.png";

const SalesCardDigitalGuide = () => {

  const theme = useMantineTheme();

  return (
    <>
      <Card shadow="md" padding="lg" radius="md" withBorder>
        <Card.Section mb="sm">
          <AspectRatio ratio={1.7}>
            <Image
              src={DigitalMockup}
              alt="Digital Booklet"
            />
          </AspectRatio>
        </Card.Section>
        <Title order={4} mb="sm">Digital Guide ($24.99)</Title>
        <List mb="sm">
          <ListItem>Instantly emailed as a PDF</ListItem>
          <ListItem>Print at home or use digitally</ListItem>
        </List>
        <Button component={Link} to="/checkout?product=digital" color={theme.colors.green[7]}>Buy Now</Button>
        {/*<Button disabled>Coming soon</Button>*/}
      </Card>
    </>
  )
}

export default SalesCardDigitalGuide
