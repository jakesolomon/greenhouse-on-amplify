import { NavLink } from "react-router-dom";
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

  const renderNavItem = (label: string, to: string) => (
    <NavLink to={to}>
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
        {renderNavItem("Home", "/")}
        {renderNavItem("Contact", "/contact")}
        {renderNavItem("FAQ", "/faq")}
        {renderNavItem("About", "/about")}
      </Stack>
    </AppShell.Navbar>
  )
}

export default NavBar
