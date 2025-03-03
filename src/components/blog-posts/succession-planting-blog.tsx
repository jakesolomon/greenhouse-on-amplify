import {Text, Container, Title, Stack, Box, Divider, AppShell, Center, Image} from "@mantine/core";
import {Link} from "react-router-dom";
import Logo from "../../assets/full-logo-text-color.svg";

const SuccessionPlantingBlog = () => {

  return (
    <Container size='sm'>
      <Title order={2} >Succession Planting: How to Keep Your Garden Producing All Season Long</Title>
      <Text c="dimmed" fs="italic">March 1, 2024</Text>
      <Divider my="xs" w="30%"/>
      <Stack gap='md' mb='lg'>
        <Box>
          <Text size='xl' mb='sm'>The Problem with Planting Everything at Once</Text>
          <Text mb='sm'>One of the most common mistakes new gardeners make is planting everything at the same time. While this may seem like an efficient way to fill a garden, it often results in a short-lived harvest, with an overwhelming abundance of produce all at once, followed by weeks or months of little to nothing. Succession planting is a method that prevents this by staggering plantings throughout the season, ensuring a continuous supply of fresh vegetables.</Text>
        </Box>

        <Box>
          <Text size='xl' mb='sm'>Different Methods of Succession Planting</Text>
          <Text mb='sm'>This technique can be done in several ways. Some gardeners choose to plant the same crop in intervals, sowing new seeds every few weeks to maintain a steady harvest. Others replace early-season crops with new varieties once the first harvest is complete, making full use of available garden space. Another approach is intercropping, where fast-growing crops are planted alongside slower-growing ones, allowing both to thrive without competing for space. Seasonal succession is another useful strategy, where gardeners transition from cool-season crops in spring to warm-season crops in summer and then back to cold-hardy vegetables in the fall.</Text>
        </Box>

        <Box>
          <Text size='xl' mb='sm'>Planning for Success</Text>
          <Text mb='sm'>Planning is key to successful succession planting. Understanding first and last frost dates helps determine when to start and when to transition to different crops. Keeping a schedule or calendar ensures plantings happen at the right time, preventing missed opportunities. Soil health is also important, as frequent planting can deplete nutrients. Adding compost or fertilizer between plantings helps keep the soil fertile and productive. Gardeners should also consider the space needed for crops at different growth stages, ensuring new plantings have room to develop without being crowded.</Text>
        </Box>

        <Box>
          <Text size='xl' mb='sm'>Make Succession Planting Easy with The Growing Guide</Text>
          <Text mb='sm'>While succession planting requires some planning, it is one of the most effective ways to keep a garden productive from early spring to late fall. Experimenting with different schedules and combinations can help gardeners find the best approach for their climate and space. For those looking for an easier way to organize their planting schedule, The Growing Guide simplifies the process by creating a customized, month-by-month plan based on climate, crop selection, and gardening goals.</Text>
        </Box>

        <Link to={'/learn'}><Text c="dimmed" td="underline" >Back</Text></Link>
      </Stack>
      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Center py="md">
          <Image src={Logo} className="footer-logo" alt="logo" />
        </Center>
      </AppShell.Footer>
    </Container>
  )

}

export default SuccessionPlantingBlog
