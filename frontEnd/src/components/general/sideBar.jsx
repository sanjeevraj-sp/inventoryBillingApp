import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { useDispatch, useSelector } from "react-redux";
import Nav from "react-bootstrap/Nav";
import { Image } from "react-bootstrap";

import "../../stylesheets/sideBar.css";
import sidebararrow from "../../images/sideBarArrow.png";
import { useSwitchTheme } from "../../hooks/theme";
import useLogout from "../../hooks/logout";
import brandsIcon from "../../images/brandsIcon.png";
import invoiceIcon from "../../images/invoiceIcon.png";
import reportIcon from "../../images/reportIcon.png";
import stockIcon from "../../images/stockIcon.png";
import dashboardicon from "../../images/dashboardIcon.png";
import themeicon from "../../images/themeicon.png";
import logouticon from "../../images/logouticon.png";
import loginicon from "../../images/loginicon.png";
import signinicon from "../../images/signinicon.png";
import profileicon from "../../images/profileicon.png";

const SideBar = ({ sidebarToggle, setSidebarToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleToggle = () => {
    setSidebarToggle((prevState) => !prevState);
  };
  const user = useSelector((state) => state.user);
  const isLogedIn = user.token !== null;
  const userName = isLogedIn ? `${user.userData.firstName}` : null;
  const theme = user.theme;
  const { left } = useSpring({
    from: { left: "-20%" },
    to: { left: sidebarToggle ? "0" : "-10.4%" },
  });
  const switchTheme = useSwitchTheme();
  const logout = useLogout();

  return (
    <animated.div className={`Sidebar-${theme}`} style={{ left: left }}>
      <animated.img
        src={sidebararrow}
        className="arrowIcon"
        style={{ transform: sidebarToggle ? "scaleX(-1)" : "scaleX(1)" }}
        alt="Sidebar Arrow"
        onClick={() => handleToggle()}
      />

      <div>
        <Nav className="tabs">
          <Nav.Link className="nav-items tab" onClick={() => navigate("/")}>
            Dashboard
            <Image src={dashboardicon} className="dashboardIcon"></Image>
          </Nav.Link>
          <Nav.Link
            className="nav-items tab"
            onClick={() =>
              navigate("/inventory", { state: { fetchBrands: true } })
            }
          >
            Inventory
            <Image src={brandsIcon} className="brandIcon"></Image>
          </Nav.Link>
          <Nav.Link
            className="nav-items tab"
            onClick={() => navigate("/invoice")}
          >
            Invoice
            <Image src={invoiceIcon} className="invoiceIcon"></Image>
          </Nav.Link>
          <Nav.Link
            className="nav-items tab"
            onClick={() => navigate("/stock")}
          >
            Stock
            <Image src={stockIcon} className="stockIcon" />
          </Nav.Link>
          <Nav.Link
            className="nav-items tab"
            onClick={() => navigate("/reports")}
          >
            Reports
            <Image src={reportIcon} className="reportIcon"></Image>
          </Nav.Link>
        </Nav>

        <Nav className="bottom-tabs">
          {isLogedIn ? (
            <>
              <Nav.Link
                className="nav-items tab"
              >
                {userName}
                <Image src={profileicon} className="logoutIcon"></Image>
              </Nav.Link>
              <Nav.Link className="nav-items tab" onClick={() => logout()}>
                Log Out
                <Image src={logouticon} className="logoutIcon"></Image>
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                className="nav-items tab"
                onClick={() =>
                  navigate("/signin", { state: { showModel: true } })
                }
              >
                SignUp
                <Image src={signinicon} className="signinIcon"></Image>
              </Nav.Link>
              <Nav.Link
                className="nav-items tab"
                onClick={() =>
                  navigate("/login", { state: { showModel: true } })
                }
              >
                LogIn
                <Image src={loginicon} className="loginIcon"></Image>
              </Nav.Link>
            </>
          )}

          <div className="theme-toggle tab" onClick={() => switchTheme()}>
            <span>Dark Theme</span>
            <Image src={themeicon} className="themeIcon"></Image>
          </div>
        </Nav>
      </div>
    </animated.div>
  );
};

export default SideBar;
