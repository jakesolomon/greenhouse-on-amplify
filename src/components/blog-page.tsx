import {Text, Container, Title, Stack, Box, Divider, AppShell, Center, Image} from "@mantine/core";
import {Link} from "react-router-dom";
import Logo from "../assets/full-logo-text-color.svg";

const BlogPage = () => {

  return (
    <Container size='md'>
      <Title order={1} >Growing Insights</Title>
      <Divider my="md" w="0%"/>
      <Stack gap='xs' mb='lg'>
        <Box>
          <Text size='xl'>Companion Planting: Symbiotic Relationships in Your Backyard</Text>
          <Text c="dimmed" fs="italic" size='sm' mb='sm'>March 3, 2024</Text>
          <Text>When planning a garden, most people think about what they want to grow, but not necessarily what should grow together. That’s where companion planting comes in—a time-tested technique that groups plants in a way that improves growth, deters pests, and maximizes space. By understanding which plants make good neighbors (and which ones don’t), you can create a healthier, more productive garden with less effort.</Text>
          <Link to={'/learn/companion-planting'}><Text c="dimmed" td="underline">Read more</Text></Link>
        </Box>
        <Divider my="xs" w="30%"/>
        <Box>
          <Text size='xl'>Succession Planting: How to Keep Your Garden Producing All Season Long</Text>
          <Text c="dimmed" fs="italic" size='sm' mb='sm'>March 1, 2024</Text>
          <Text>One of the biggest mistakes new gardeners make is planting everything all at once. While this might seem like a great way to fill your garden, it often leads to a feast-or-famine situation—too much harvest at one time, followed by a long stretch of nothing. Succession planting solves this problem by staggering your plantings so you can enjoy a continuous harvest throughout the season.</Text>
          <Link to={'/learn/succession-planting'}><Text c="dimmed" td="underline">Read more</Text></Link>
        </Box>
      </Stack>
      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Center py="md">
          <Image src={Logo} className="footer-logo" alt="logo" />
        </Center>
      </AppShell.Footer>
    </Container>
  )

}

export default BlogPage
