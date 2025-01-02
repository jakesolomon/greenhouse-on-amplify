import { Link } from "react-router-dom";
import { Button } from "@mantine/core";

const LandingPage = () => {

  return(
    <>
      <Button component={Link} to="/planner">router link (polymorphic)
      </Button>
    </>
  )
}

export default LandingPage