import { Link, useMatch, NavLink } from "react-router-dom";
import {
  Button,
  Container,
  useMantineTheme,
  Group,
  Image,
  Burger
} from "@mantine/core";

import LogoText from '../assets/logo-text.svg'

interface HeaderProps {
  navBarIsOpen: boolean;
  toggleNavBar: () => void;
}

const Header = (props: HeaderProps) => {

  const { navBarIsOpen, toggleNavBar } = props;

  const theme = useMantineTheme();
  const plannerIsOpen = useMatch('/planner');

  const renderNavItem = (label: string, to: string) => (
    <NavLink to={to}>
      {({ isActive }) => (
        <Button
          variant={isActive ? 'outline' : 'subtle'}
          // color="#6C584C"
          color="#333"
        >
          {label}
        </Button>
      )}
    </NavLink>
  )

  const renderPlanButton = () => (
    <NavLink to='/planner'>
      <Button
        color={theme.colors.green[7]}
        ml='xs'
      >
        Plan
      </Button>
    </NavLink>
  )

  return(
    <>
      <Container size='xl' h={60}>
        <Group h="100%" px="md">
          <Burger opened={navBarIsOpen} onClick={toggleNavBar} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Link to={'/'} >
              <Image h={35} src={LogoText} className="header-logo" alt="logo" />
            </Link>
            <Group ml="xl" gap={0} visibleFrom="sm">
              {renderNavItem("Contact", "/contact")}
              {renderNavItem("FAQ", "/faq")}
              {renderNavItem("About", "/about")}
              {renderNavItem("Learn", "/learn")}
              {
                !plannerIsOpen &&
                renderPlanButton()
              }
            </Group>
          </Group>
        </Group>
      </Container>
    </>
  )
}

export default Header
