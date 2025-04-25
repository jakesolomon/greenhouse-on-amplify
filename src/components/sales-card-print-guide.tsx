import {
  Title,
  Text,
  Center,
  Box, Badge, Card, AspectRatio, Image, List, ListItem, Button, useMantineTheme
} from "@mantine/core";
import BookletMockupLeft from "../assets/booklet-mockup-left.png";
import {Link} from "react-router-dom";

const SalesCardPrintGuide = () => {

  const theme = useMantineTheme();

  return (
    <>
      <Box style={{position: "relative"}}>
        <Center w="100%">
          <Badge color={theme.colors.green[7]} variant="filled" size="lg" radius='xs' fullWidth style={{ position: 'absolute', top: -10 }} />
          <Badge color={theme.colors.green[7]} variant="filled" size="lg" radius='md' fullWidth style={{ position: 'absolute', top: -24 }}>
            Best for Outdoor Use
          </Badge>
        </Center>
        <Card shadow="md" padding="lg" radius="md" withBorder style={{ border: `2px solid ${theme.colors.green[7]}` }} >
          {/*<Card shadow="lg" padding="lg" radius="md" withBorder >*/}
          <Card.Section mb="sm">
            <AspectRatio ratio={1.7}>
              <Image
                src={BookletMockupLeft}
                alt="Print Booklet"
              />
            </AspectRatio>
          </Card.Section>
          <Title order={4}>Print Booklet ($39.99)</Title>
          <Text fs="italic" mb='xs' size='sm'>Printed on thick, matte stock that resists water and tearing—perfect for muddy hands and sunny days.</Text>
          <List mb="sm">
            {/*<ListItem>Custom printed and shipped</ListItem>*/}
            {/*<ListItem>Professionally printed & shipped</ListItem>*/}
            {/*<ListItem>Water-resistant, high-quality paper</ListItem>*/}
            <ListItem>Built for garden use—no smudgy screens</ListItem>
            <ListItem>Free digital copy included</ListItem>
            {/*<ListItem>Perfect for hands-on reference</ListItem>*/}
            {/*<ListItem>Free digital copy</ListItem>*/}
          </List>
          <Button component={Link} to="/checkout?product=print" color={theme.colors.green[7]}>Buy Now</Button>
          {/*<Button disabled>Coming soon</Button>*/}
        </Card>
      </Box>
    </>
  )
}

export default SalesCardPrintGuide
