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
    <NavLink to="/planner">
      <Button
        color={theme.colors.green[7]}
        ml='xs'
      >
        My Plan
      </Button>
    </NavLink>
  )

  return(
    <>
      <Container size='xl' h={60}>
        <Group h="100%">
          <Burger opened={navBarIsOpen} onClick={toggleNavBar} hiddenFrom="sm" size="sm" />
          <Group justify="space-between" style={{ flex: 1 }}>
            <Link to="/" >
              {/*<Image h={45} src={LogoTree} hiddenFrom="sm" className="header-logo" alt="logo" fit="contain" />*/}
              <Image h={45} src={LogoText} className="header-logo" alt="logo" fit="contain" />
            </Link>
            <Group gap={0} visibleFrom="sm">
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
