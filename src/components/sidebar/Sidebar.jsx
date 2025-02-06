import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);


  const handleLogout = () => {
    localStorage.clear(); // Clears all items from local storage
    alert("You have been logged out!");
    // Optionally, redirect to the login page or another route
    window.location.href = "/admin/login"; // Adjust the path to your login route
  };
  

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/admin/home" style={{ textDecoration: "none" }}>
          <span className="logo">Devsthan Expert</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          <p className="title">LISTS</p>

          <Link to="/admin/tours" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Tours</span>
            </li>
          </Link>
          <Link to="/admin/fixedTours" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Fixed Tours</span>
            </li>
          </Link>

          <Link to="/admin/createCoupon" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Coupons</span>
            </li>
          </Link>

          <Link to="/admin/inquiries" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Inquiries</span>
            </li>
          </Link>
          <Link to="/admin/blogs" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Blogs</span>
            </li>
          </Link>
          <Link to="/admin/contacts" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Contacts</span>
            </li>
          </Link>
          <Link to="/admin/category" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Categories</span>
            </li>
          </Link>

          <Link to="/admin/orders" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Orders</span>
            </li>
          </Link>
          <Link to="/admin/attributes" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Attributes</span>
            </li>
          </Link>
          <Link to="/admin/about-us" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>About Us</span>
            </li>
          </Link>
          <Link to="/admin/destinations" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Destinations</span>
            </li>
          </Link>

          <Link to="/admin/customizedQueries" style={{ textDecoration: "none" }}>

            <li>
              <PersonOutlineIcon className="icon" />
              <span>Customized Queries</span>
            </li>
          </Link>
          <Link to="/admin/banners" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Banners</span>
            </li>
          </Link>
          {/* <li>
            <CreditCardIcon className="icon" />
            <span>Orders</span>
          </li>
          <li>
            <LocalShippingIcon className="icon" />
            <span>Delivery</span>
          </li>
          <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li> */}
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>
          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>

          <li onClick={handleLogout}>


            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      {/* <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div> */}
    </div>
  );
};

export default Sidebar;
