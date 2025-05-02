import {NavLink, useLocation} from "react-router-dom";
import {
  Button,
  AppShell,
  Stack
} from "@mantine/core";

interface NavBarProps {
  toggleNavBar: () => void;
}

const NavBar = (props: NavBarProps) => {

  const { toggleNavBar } = props;

  const location = useLocation();
  const isV2 = location.pathname.includes('v2');

  const renderNavItem = (label: string, to: string) => (
    <NavLink to={isV2 ? `${to}-v2` : to}>
      {({ isActive }) => (
        <Button
          variant={isActive ? 'outline' : 'subtle'}
          color="#333"
          onClick={toggleNavBar}
        >
          {label}
        </Button>
      )}
    </NavLink>
  )

  return(
    <AppShell.Navbar p="lg">
      <Stack>
        {renderNavItem("Home", "/home")}
        {renderNavItem("Contact", "/contact")}
        {renderNavItem("FAQ", "/faq")}
        {renderNavItem("About", "/about")}
        {renderNavItem("Learn", "/learn")}
      </Stack>
    </AppShell.Navbar>
  )
}

export default NavBar
