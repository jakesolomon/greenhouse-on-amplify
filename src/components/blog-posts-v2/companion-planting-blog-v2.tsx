import {Text, Container, Title, Stack, Box, Divider, AppShell} from "@mantine/core";
import {Link} from "react-router-dom";
import Footer from "../footer.tsx";

const CompanionPlantingBlogV2 = () => {

  return (
    <>
      <Container size='sm'>
        <Title order={2} >Companion Planting: Symbiotic Relationships in Your Backyard</Title>
        <Text c="dimmed" fs="italic">March 3, 2024</Text>
        <Divider my="md" w="60%"/>
        <Stack gap='md' mb='lg'>
          <Box>
            <Text mb='sm'>Gardening is both art and science, and one practice that combines both is companion planting. This old technique involves placing different plants together to enhance growth, protect from pests and improve yield—without the use of any chemical treatments. By understanding companion planting, gardeners can create a thriving ecosystem in their own backyard.</Text>
            <Text mb='sm'>At the core of companion planting is relationships. Just like humans need a supportive community, plants thrive with compatible neighbors. This method uses the natural preferences and traits of different plants to create a balanced and healthy garden. It’s not just about two species side by side; it’s about how they interact and influence each other’s growth.</Text>
          </Box>

          <Box>
            <Text size='xl' mb='sm'>Benefits of Companion Planting</Text>
            <Text mb='sm'>One of the main benefits of companion planting is pest control. Some plants emit scents or have properties that repel pests, reducing the need for chemical pesticides. For example marigolds repel nematodes and other pests, making them great companions for many vegetables.</Text>
            <Text mb='sm'>Also, companion planting can improve soil fertility. Leguminous plants like beans and peas fix nitrogen in the soil, benefitting neighboring plants that need more nitrogen. This natural fertilization process means healthier plants and better yields without the need for synthetic fertilizers.</Text>
            <Text mb='sm'>Another benefit is space efficiency. By pairing plants with different growth habits—deep rooted and shallow rooted species—gardeners can use the soil more and minimize competition for nutrients. This is especially useful in small gardens where space is limited.</Text>
            <Text mb='sm'>One famous example is the “Three Sisters” method, an old Native American practice of planting corn, beans and squash together. Corn provides a natural trellis for the bean vines, beans fix nitrogen in the soil for the corn and squash, and squash spreads along the ground and suppresses weeds and retains soil moisture.</Text>
          </Box>

          <Box>
            <Text size='xl' mb='sm'>Tips for Successful Companion Planting</Text>
            <Text mb='sm'>Knowing plant compatibility is key. Some plants when grown together can inhibit each other’s growth due to allelopathy—a biological process where one plant releases chemicals that can harm another. So researching and planning which plants are good neighbors is important.</Text>
            <Text mb='sm'>Another tip is to consider the growth timing. Fast growing plants can provide shade for those that prefer cooler conditions, tall plants can offer support for climbing varieties. Rotating companion plants each season can also prevent soil depletion and reduce disease buildup.</Text>
          </Box>

          <Box>
            <Text size='xl' mb='sm'>Make Companion Planting Easy with The Growing Guide</Text>
            <Text mb='sm'>While companion planting requires some planning, it is one of the most effective ways to keep a garden productive. That’s why we’ve included it as a feature in The Growing Guide—each guide comes with companion planting pairings suggested for each crop you select in your plan.</Text>
            <Text mb='sm'>We’ve kept it simple and only recommend herbs and flowers that don’t take up much space, and avoid pairings that would require additions of whole new crops into your plan. But, for those who want to go above and beyond, we encourage you to look up pairings to crops you would enjoy growing, and build your Growing Guide plan accordingly.</Text>
          </Box>

          <Link to={'/learn-v2'}><Text c="dimmed" td="underline" >Back to All Articles</Text></Link>
        </Stack>
      </Container>

      <AppShell.Footer style={{position: "relative", bottom: "0px"}} >
        <Footer />
      </AppShell.Footer>
    </>
  )

}

export default CompanionPlantingBlogV2
