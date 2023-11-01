import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { capitalizeFirstWord } from "../../utils/HelperFunctions";
import "../../style/NavigationBar.css";
function NavigationBar() {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <div className="navbar">
      <Link className="logo" to="/">
        Anique's Facebook Clone
      </Link>
      <Link to="/">My Feed</Link>
      <Link to="/friend_requests">Friend Requests</Link>
      <Link to="/">Notification</Link>
      <Link to="/">Settings</Link>

      {user && user.user_id && (
        <Link to={`/profile/${user.user_id}`}>
          Hi , {capitalizeFirstWord(user.full_name)}
        </Link>
      )}
      {user ? (
        <p onClick={logoutUser}>Logout</p>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
}

export default NavigationBar;
