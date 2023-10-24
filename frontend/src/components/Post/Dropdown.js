import "../../style/Dropdown.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
function Dropdown() {
  return (
    <main>
      <div className="item">
        <a href="#" id="btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </a>
      </div>

      <div className="dropdown" id="container-dropdown">
        <ul>
          <li>
            <i className="fas fa-cog icon"></i>
            <a href="#" id="setting-button">
              Settings & Privacy
            </a>
          </li>
          <li>
            <i className="fas fa-question-circle icon"></i>
            <a href="#">Help & Support</a>
          </li>
          <li>
            <i className="fas fa-moon icon"></i>
            <a href="#">Display Preferences</a>
          </li>
          <li>
            <i className="fas fa-sign-out-alt icon"></i>
            <a href="#">Log Out</a>
          </li>
        </ul>
      </div>

      <div className="settings-dropdown" id="settingDropdown">
        <h2>
          <a href="#" id="backBtn">
            <i className="fas fa-arrow-left icon"></i>
          </a>
          Settings & Privacy
        </h2>
        <ul>
          <li>
            <i className="fas fa-cog icon"></i>
            <a href="#"> Settings</a>
          </li>
          <li>
            <i className="fas fa-lock icon"></i>
            <a href="#">Privacy Checkup</a>
          </li>
          <li>
            <i className="fas fa-unlock-alt icon"></i>
            <a href="#">Privacy Shortcuts</a>
          </li>
          <li>
            <i className="fas fa-bars icon"></i>
            <a href="#">Activity Log</a>
          </li>
          <li>
            <i className="fas fa-book icon"></i>
            <a href="#">News Feed Preferences</a>
          </li>
          <li>
            <i className="fas fa-globe icon"></i>
            <a href="#">Language</a>
          </li>
        </ul>
      </div>
    </main>
  );
}

export default Dropdown;
