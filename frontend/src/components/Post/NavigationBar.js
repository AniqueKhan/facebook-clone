import "../../style/NavigationBar.css";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

function NavigationBar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Perform logout actions (e.g., clear the token from local storage)
    localStorage.removeItem("token");

    // Redirect to the login page or any other page
    navigate("/login"); // Change "/login" to the appropriate URL
  };
  return (
    <div className="navbar">
      <a className="logo" href="#">
        Anique's Facebook Clone
      </a>
      <a href="#">My Feed</a>
      <a href="#">Inbox</a>
      <a href="#">Notification</a>
      <a href="#">Search</a>
      <a href="#">Settings</a>
      <a onClick={handleLogout}>Logout</a>
    </div>
  );
}

export default NavigationBar;
