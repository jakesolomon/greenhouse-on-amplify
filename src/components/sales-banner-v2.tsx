import {Alert, Transition, useMantineTheme, Text, Center} from '@mantine/core';
import {useLocation} from "react-router-dom";

interface SalesBannerV2Props {
  hasOptedIn: boolean;
  onClickOpenModal: () => void;
}

const SalesBannerV2 = (props: SalesBannerV2Props) => {

  const { hasOptedIn, onClickOpenModal } = props;

  const location = useLocation();
  const isV2 = location.pathname.includes('v2');

  const theme = useMantineTheme();

  if (!isV2) {
    return null;
  }

  return (
    <Transition mounted={!hasOptedIn} transition="slide-down" duration={300} timingFunction="ease">
      {(styles) => (
        <>
          <Alert
            color="black"
            radius={0}
            py={3}
            style={{ ...styles, position: 'fixed', top: 60, left: 0, right: 0, zIndex: 10, background: theme.colors.yellow[5] }}
          >
            <Center>
              <Text size='sm' py={0} my={0} fw={500}>
                Get 15% off your Growing Guide when you join our email list!{' '}
                <Text
                  span
                  // px="1em"
                  c="blue"
                  td="underline"
                  fw={700}
                  style={{ cursor: 'pointer' }}
                  onClick={onClickOpenModal}
                >
                  Sign up
                </Text>
              </Text>
            </Center>
          </Alert>
        </>
      )}
    </Transition>
  );
}

export default SalesBannerV2
