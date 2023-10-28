import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { capitalizeFirstWord } from "../../utils/HelperFunctions";
import "../../style/NavigationBar.css";
function NavigationBar() {
  let { user, logoutUser } = useContext(AuthContext);
  console.log("user", user);
  return (
    <div className="navbar">
      <Link className="logo" to="/">
        Anique's Facebook Clone
      </Link>
      <Link to="/">My Feed</Link>
      <Link to="/">Inbox</Link>
      <Link to="/">Notification</Link>
      <Link to="/">Settings</Link>

      {user && (
        <Link to="/profile">Hi , {capitalizeFirstWord(user.full_name)}</Link>
      )}
      {user ? (
        <p onClick={logoutUser}>Logout</p>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

export default NavigationBar;
