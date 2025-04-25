import { useEffect, useState } from 'react';
import {Alert, Transition, useMantineTheme, Text, Container} from '@mantine/core';

function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(23, 59, 59, 999);
  const diff = midnight.getTime() - now.getTime();

  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${hours}h ${minutes}m ${seconds}s`;
}

const SalesBanner = () => {
  const theme = useMantineTheme();

  const [showBanner, setShowBanner] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // e.g., "2025-04-25"
    const storedDate = localStorage.getItem('firstVisitDate');

    if (!storedDate) {
      // First visit ever – set the date and show the banner
      localStorage.setItem('firstVisitDate', today);
      setShowBanner(true);
    } else if (storedDate === today) {
      // Still the same day – keep showing the banner
      setShowBanner(true);
    } else {
      // Different day – don't show
      setShowBanner(false);
    }

    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Transition mounted={showBanner} transition="slide-down" duration={300} timingFunction="ease">
      {(styles) => (
        <>
          <Alert
            color="black"
            radius={0}
            p='sm'
            style={{ ...styles, position: 'fixed', top: 60, left: 0, right: 0, zIndex: 10, background: theme.colors.yellow[5] }}
          >
            <Container size='md' p={0}>
              <Text size='sm'>
                <strong>Enjoy 10% off your order</strong> with code <strong>WELCOME10</strong>. Just make sure to use it by midnight — <em>{timeLeft} left</em>!
              </Text>
            </Container>
          </Alert>
        </>
      )}
    </Transition>
  );
}

export default SalesBanner
