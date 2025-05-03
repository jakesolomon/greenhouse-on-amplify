import {Modal, Button, Text, Box, Title, Group, useMantineTheme} from '@mantine/core';
import EmailOptInForm from "./email-opt-in-form.tsx";
import {useState} from "react";
import {useLocation} from "react-router-dom";

interface EmailDiscountModalV2Props {
  opened: boolean;
  setOpened: (open: boolean) => void;
}

const EmailDiscountModalV2 = (props: EmailDiscountModalV2Props) => {

  const { opened, setOpened } = props;

  const location = useLocation();
  const isV2 = location.pathname.includes('v2');
  const isPayingV2 = localStorage.getItem('digitalGuidesRemainingV2');

  const theme = useMantineTheme();

  const [displayCode, setDisplayCode] = useState(false);

  const setUserData = ( userName: string, userEmail: string ) => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", userEmail);
    setDisplayCode(true)
  }

  if (!isV2 || !!isPayingV2) {
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
                Welcome to the community! Code <strong>WELCOME15</strong> will be automatically applied at checkout.
              </Text>
              <Group justify="flex-end" mt="md">
                <Button
                  color={theme.colors.green[7]}
                  onClick={() => setOpened(false)}
                >
                  Done
                </Button>
              </Group>
            </>
          :
            <>
              <Text mb="sm">
                Sign up for our email list to receive 15% off your Growing Guide—plus seasonal gardening tips!
              </Text>
              <EmailOptInForm setUserData={setUserData} isV2={true}/>
            </>

        }
      </Box>
    </Modal>
  );
}

export default EmailDiscountModalV2;
