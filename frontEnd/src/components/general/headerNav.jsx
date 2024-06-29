import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Navbar, Container } from "react-bootstrap";
import { useSelector } from "react-redux";

import "../../stylesheets/headerNav.css";
import logo from "../../images/logo.png";

const HeaderNav = () => {
  const user = useSelector((state) => state.user);
  const theme = user.theme;

  return (
    <Navbar key={false} expand={false} className={`mb-0 mb-0 navbar-${theme}`}>
      <Container
        fluid
        className=" d-flex justify-content-end align-items-center"
      >
        <Navbar.Brand href="#" className={`navBrand-${theme} d-flex`}>
          <img src={logo} width="60" height="60" alt="" className="appLogo" />
          <Navbar.Text className="appName me-2">Inventory!</Navbar.Text>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default HeaderNav;
