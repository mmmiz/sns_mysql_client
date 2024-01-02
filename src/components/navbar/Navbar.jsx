import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import { Button } from "@mui/material";
import axios from "axios";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandle = async () => {
    await axios.post('/auth/logout');
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  }

  return (
    <div className="navbar">


      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>S N S</span>
        </Link>
        <HomeOutlinedIcon />

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}

        <GridViewOutlinedIcon />

        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>

      </div>

      {/* RIGHT */}
      <div className="right">
        <Button onClick={logoutHandle}>logout</Button>
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          <Link to={`/profile/${currentUser.id}`} >
            <img
              src={"/upload/" + currentUser.profilePic}
              alt=""
            />
          </Link>
          <span>{currentUser.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
