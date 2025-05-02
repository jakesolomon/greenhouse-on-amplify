import { Link, useMatch, NavLink, useLocation } from "react-router-dom";
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

  const location = useLocation();
  const isV2 = location.pathname.includes('v2');

  const renderNavItem = (label: string, to: string) => (
    <NavLink to={isV2 ? `${to}-v2` : to}>
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
    <NavLink to={isV2 ? '/planner-v2' : '/planner'}>
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
            <Link to={isV2 ? `/home-v2` : '/'} >
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
