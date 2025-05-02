import {Modal, Button, Text, Box, Title, Group, useMantineTheme} from '@mantine/core';
import EmailOptInForm from "./email-opt-in-form.tsx";
import {useState} from "react";
import {Link, useLocation} from "react-router-dom";

interface EmailDiscountModalV2Props {
  opened: boolean;
  setOpened: (open: boolean) => void;
}

const EmailDiscountModalV2 = (props: EmailDiscountModalV2Props) => {

  const { opened, setOpened } = props;

  const location = useLocation();
  const isV2 = location.pathname.includes('v2');

  const theme = useMantineTheme();

  const [displayCode, setDisplayCode] = useState(false);

  const setUserData = ( userName: string, userEmail: string ) => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", userEmail);
    setDisplayCode(true)
  }

  if (!isV2) {
    return null
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={3}>Get 15% Off Your Growing Guide</Title>}
      centered
      size="lg"
    >
      <Box>
        {
          displayCode
          ? <>
              <Text mb="sm">
                Welcome to the community! Use code <strong>WELCOME15</strong> at checkout for your discount.
              </Text>
              <Group justify="flex-end" mt="md">
                <Button
                  component={Link}
                  to="/buy-v2"
                  // variant="default"
                  // mt="md"
                  color={theme.colors.green[7]}
                  onClick={() => setOpened(false)}
                >
                  Get My Guide
                </Button>
              </Group>
            </>
          :
            <>
              <Text mb="sm">
                Sign up for our email list to receive 15% off your Growing Guide—plus seasonal gardening tips!
              </Text>
              <EmailOptInForm setUserData={setUserData} />
            </>

        }
      </Box>
    </Modal>
  );
}

export default EmailDiscountModalV2;
