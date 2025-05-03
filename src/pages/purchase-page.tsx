import { Container, Text, Title } from "@mantine/core";
import {Link} from "react-router-dom";

const Purchase = () => {

  return (
    <Container size="md" my="xl" id="purchase-page">
      <Title>Thank You for Your Purchase!</Title>
      <Text>Check your email for a download link in a few moments. (If you don't see it within a few minutes, check your spam folder!)</Text>
      <Text>You can also go back to your <Link to="/planner">Plan Overview</Link> anytime.</Text>
      <Title order={4} mt="md">Ordered a printed copy?</Title>
      <Text>It will be shipped within 3-4 business days. You'll receive a notification as soon as it’s on the way.</Text>
      <Title order={4} mt="md">Need Help?</Title>
      <Text>If you have any questions about your order, feel free to contact us <Link to="/contact">here</Link>.</Text>
    </Container>
  )

}

export default Purchase
