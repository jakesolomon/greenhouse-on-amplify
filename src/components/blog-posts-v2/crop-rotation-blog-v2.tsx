import {Text, Container, Title, Stack, Box, Divider, AppShell} from "@mantine/core";
import {Link} from "react-router-dom";
import Footer from "../footer.tsx";

const CropRotationBlogV2 = () => {

  return (
    <>
      <Container size='sm'>
        <Title order={2} >Rotate Your Crops Year-Round: Smarter Planting, Fewer Pests</Title>
        <Text c="dimmed" fs="italic">March 22, 2024</Text>
        <Divider my="md" w="60%"/>
        <Stack gap='md' mb='lg'>
          <Box>
            <Text mb='sm'>When most gardeners hear “crop rotation,” they think of switching crops from one year to the next to prevent pests and diseases and keep the soil balanced. But crop rotation isn’t just a long-term strategy for farmers — it can happen on a smaller scale, right in your home garden, over the course of a single season. By changing what you grow in each spot throughout the season, you help prevent pests, reduce disease risk, and make better use of your space.</Text>
          </Box>

          <Box>
            <Text size='xl' mb='sm'>Why Rotate Crops in a Single Season?</Text>
            <Text mb='sm'>Even if you’re not planting in the same space for multiple years, rotating crops within the same growing season can help keep your garden healthy and productive. Pests often target specific crops, and if a particular vegetable stays in one spot for too long, pests (or the eggs they leave behind) can build up in the soil. The same goes for certain soil-borne diseases, which can persist if one type of plant remains in place.</Text>
            <Text mb='sm'>Rotation also helps balance soil health, since different crops have different nutrient needs. For example, leafy greens are heavy nitrogen users, while legumes (like beans or peas) can actually return nitrogen to the soil. Changing up what grows where — even within a season — keeps the soil from getting exhausted and reduces the need for constant fertilizing.</Text>
          </Box>

          <Box>
            <Text size='xl' mb='sm'>More Diversity—Less Chemical Intervention</Text>
            <Text mb='sm'>The key to effective rotation is timing — planting at the right moment for your climate, so each crop has the chance to thrive before making room for the next. When rotations are lined up carefully, you can often fit two or even three plantings into a single bed in one year, all while maintaining good diversity.</Text>
            <Text mb='sm'>In this way, crop rotation offers similar benefits to companion planting. Nature has already come up with balances that keep disease and infestations in check. Every ecosystem has its own intricate relationships and cycles—the more we can emulate them in our own gardens, the less we’ll need to apply modern interventions (like chemical fertilizers or pesticides).</Text>
          </Box>

          <Box>
            <Text size='xl' mb='sm'>We take the Guesswork Out of Planning</Text>
            <Text mb='sm'>This built-in rotation helps prevent crop-specific pest buildup. Instead of kale occupying the same spot for months on end (and potentially inviting cabbage worms or aphids), the guide moves on to a totally different crop after harvest. Over time, this kind of diversity naturally lowers the risk of pest problems without requiring chemical intervention.</Text>
            <Text mb='sm'>In this way, crop rotation offers similar benefits to <Link to={'/learn/companion-planting-v2'} style={{display: "inline-block"}}><Text td="underline">companion planting</Text></Link>. Nature has already come up with balances that keep disease and infestations in check. Every ecosystem has its own intricate relationships and cycles—the more we can emulate them in our own gardens, the less we’ll need to apply modern interventions (like chemical fertilizers or pesticides).</Text>
            <Text mb='sm'>Rotation doesn’t have to be complicated. With the right plan — one that balances timing, crop diversity, and succession — you can build a healthier, more productive garden without spending hours figuring out what goes where. The result? Fewer pests, stronger plants, and more food from the same space.</Text>
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

export default CropRotationBlogV2
