import {
  Title,
  Card, AspectRatio, Image, List, ListItem, Button, useMantineTheme, Text
} from "@mantine/core";
import {Link, useLocation} from "react-router-dom";
import DigitalMockup from "../assets/digital-plan-mockup.png";

interface SalesCardDigitalGuideProps {
  applyEmailDiscount: boolean;
}

const SalesCardDigitalGuide = (props: SalesCardDigitalGuideProps) => {

  const { applyEmailDiscount } = props;

  const location = useLocation();
  const isV2 = location.pathname.includes('v2');

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
        {
          applyEmailDiscount
            ? <>
                <Title order={4} mb={0}>Digital Guide <Text span td="line-through" c="dimmed">$24.99</Text> $21.24</Title>
                {/*<Text mb='sm' size='sm' fs="italic" c="dimmed">Discount code automatically applied at checkout.</Text>*/}
              </>
            : <Title order={4} mb="sm">Digital Guide ($24.99)</Title>
        }
        {/*<Title order={4} mb="sm">Digital Guide ($24.99)</Title>*/}
        <List mb="sm">
          <ListItem>Instantly emailed as a PDF</ListItem>
          <ListItem>Print at home or use digitally</ListItem>
        </List>
        <Button component={Link} to={isV2 ? '/checkout-v2?product=digital' : '/checkout?product=digital'} color={theme.colors.green[7]}>Buy Now</Button>
        {/*<Button disabled>Coming soon</Button>*/}
      </Card>
    </>
  )
}

export default SalesCardDigitalGuide
