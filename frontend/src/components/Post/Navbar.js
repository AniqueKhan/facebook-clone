import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "../../style/Navbar.css";
import { BASE_URL } from "../../utils/ApiEndpoints";
import capitalizeFirstWord from "../../utils/HelperFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "./Dropdown";
import {
  faFacebook,
  faFacebookMessenger,
  faWpexplorer,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMagnifyingGlass,
  faUserPlus,
  faBell,
  faLocationDot,
  faFaceSmile,
  faList,
  faLock,
  faCamera,
  faPenToSquare,
  faIdCardClip,
  faClock,
  faUsers,
  faPhotoFilm,
  faBoxArchive,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
function Navbar() {
  let { user, logoutUser } = useContext(AuthContext);
  console.log("user", user);
  return (
    <header>
      <div className="tb">
        <div className="td" id="logo">
          <Link to="/">
            <FontAwesomeIcon icon={faFacebook} style={{ fontSize: "24px" }} />
          </Link>{" "}
        </div>
        <div className="td" id="search-form">
          <form method="get" action="#">
            <input type="text" placeholder="Search Facebook" />
            <button type="submit">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                style={{ fontSize: "24px" }}
              />
            </button>
          </form>
        </div>
        <div className="td" id="f-name-l">
          <span>{capitalizeFirstWord(user.full_name)}'s facebook</span>
        </div>
        <div className="td" id="i-links">
          <div className="tb">
            <div className="td" id="m-td">
              <div className="tb">
                <span className="td">
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    style={{ fontSize: "24px", marginRight: "50px" }}
                  />
                </span>
                <span className="td">
                  <FontAwesomeIcon
                    icon={faFacebookMessenger}
                    style={{ fontSize: "24px", marginRight: "50px" }}
                  />
                </span>
                <span className="td m-active">
                  <FontAwesomeIcon
                    icon={faBell}
                    style={{ fontSize: "24px", marginRight: "10px" }}
                  />
                </span>
              </div>
            </div>
            <div className="td">
              <Link to="/profile">
                <img
                  id="p-link"
                  src={BASE_URL + user.profile_picture}
                  alt="Profile Avatar"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Dropdown />
    </header>
  );
}

export default Navbar;
