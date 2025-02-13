import { Container, Text, Title} from "@mantine/core";
import {Link} from "react-router-dom";

const Purchase = () => {

  return (
    <Container size="md" mt="xl">
      <Title>Thank You for Your Purchase!</Title>
      <Text>Check your email for a confirmation and download link. (If you don't see it within a few minutes, check your spam folder!)</Text>
      <Title order={4} mt="md">Ordered a printed copy?</Title>
      <Text>It will be shipped within 3-4 business days. You'll receive tracking information as soon as it’s on the way.</Text>
      <Title order={4} mt="md">Need Help?</Title>
      <Text>If you have any questions about your order, feel free to contact us <Link to="/contact">here</Link>.</Text>
    </Container>
  )

}

export default Purchase
