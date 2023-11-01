import React, { useContext, useEffect, useId, useState } from "react";
import NavigationBar from "../components/Post/NavigationBar";
import AuthContext from "../context/AuthContext";
import { PROFILE_URL, BASE_URL } from "../utils/ApiEndpoints";
import axios from "axios";
import ".././style/Profile.css";
import { gatherConfiguration } from "../utils/HelperFunctions";
import { useParams } from "react-router-dom";
function Profile() {
  let [profileInfo, setProfileInfo] = useState({});
  let [showFullNameInput, setShowFullNameInput] = useState(false);
  let [showBioInput, setShowBioInput] = useState(false);
  let [showLocationInput, setShowLocationInput] = useState(false);
  let [showEmailInput, setShowEmailInput] = useState(false);
  let [showGenderDropdown, setShowGenderDropdown] = useState(false);
  let [editedFullName, setEditedFullName] = useState(""); // State for the edited full name
  let [editedBio, setEditedBio] = useState(""); // State for the edited bio
  let [editedLocation, setEditedLocation] = useState("");
  let [editedEmail, setEditedEmail] = useState("");
  let [editedGender, setEditedGender] = useState("");
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const { user_id } = useParams();
  const myProfile = user && user.user_id.toString() === user_id;
  console.log("component called", myProfile);
  console.log("component called", user.user_id);
  console.log("component called", typeof user.user_id);
  console.log("component called", typeof user_id);

  let getProfileInfo = async () => {
    try {
      const response = await axios.get(
        `${PROFILE_URL}/${user_id}`,
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        // Successful login
        console.log("Profile Info Gathering Successful");
        console.log(response.data);
        setProfileInfo(response.data["data"]);
      } else {
        console.error("Profile Info Gathering Failed");
        logoutUser();
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("An error occurred:", error);
      logoutUser();
    }
  };

  let updateFullName = async (newFullName) => {
    try {
      const response = await axios.patch(
        `${PROFILE_URL}/${user.user_id}`,
        { full_name: newFullName }, // Send the updated full name in the request body
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        console.log("Full Name Update Successful");
        console.log(response.data);
        setProfileInfo(response.data["data"]);
        setShowFullNameInput(false); // Hide the input field after successful update
      } else {
        alert("Something went wrong.");
        console.error("Full Name Update Failed");
        logoutUser();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      logoutUser();
    }
  };

  let updateBio = async (newBio) => {
    try {
      const response = await axios.patch(
        `${PROFILE_URL}/${user.user_id}`,
        { bio: newBio }, // Send the updated bio in the request body
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        console.log("Bio Update Successful");
        console.log(response.data);
        setProfileInfo(response.data["data"]);
        setShowBioInput(false); // Hide the input field after successful update
      } else {
        alert("Something went wrong.");
        console.error("Bio Update Failed");
        logoutUser();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      logoutUser();
    }
  };

  let updateLocation = async (newLocation) => {
    try {
      const response = await axios.patch(
        `${PROFILE_URL}/${user.user_id}`,
        { location: newLocation }, // Send the updated Location in the request body
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        console.log("Full Name Update Successful");
        console.log(response.data);
        setProfileInfo(response.data["data"]);
        setShowLocationInput(false); // Hide the input field after successful update
      } else {
        alert("Something went wrong.");
        console.error("Full Name Update Failed");
        logoutUser();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      logoutUser();
    }
  };

  let updateEmail = async (newEmail) => {
    try {
      const response = await axios.patch(
        `${PROFILE_URL}/${user.user_id}`,
        { email: newEmail }, // Send the updated Email in the request body
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        console.log("Email Update Successful");
        console.log(response.data);
        setProfileInfo(response.data["data"]);
        setShowEmailInput(false); // Hide the input field after successful update
      } else {
        alert("Something went wrong.");
        console.error("Email Update Failed");
        logoutUser();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      logoutUser();
    }
  };

  let updateGender = async (newGender) => {
    try {
      const response = await axios.patch(
        `${PROFILE_URL}/${user.user_id}`,
        { gender: newGender }, // Send the updated gender in the request body
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        console.log("Gender Update Successful");
        console.log(response.data);
        setProfileInfo(response.data["data"]);
        setShowGenderDropdown(false); // Hide the gender dropdown after a successful update
      } else {
        alert("Something went wrong.");
        console.error("Gender Update Failed");
        logoutUser();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      logoutUser();
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, [user_id]);
  return (
    <div>
      <NavigationBar />
      <div className="profile">
        {profileInfo.profile_picture ? (
          <img
            src={BASE_URL + profileInfo.profile_picture}
            alt="User Profile Picture"
          />
        ) : (
          <img
            src={`${BASE_URL}/media/default/default_user_profile.png`}
            alt="User Profile Picture"
          />
        )}
        <h1>{profileInfo.full_name}</h1>
        {showFullNameInput && myProfile && (
          <input
            type="text"
            value={editedFullName}
            onChange={(e) => setEditedFullName(e.target.value)}
          />
        )}
        {myProfile &&
          profileInfo.full_name &&
          (showFullNameInput ? (
            <button
              onClick={() => updateFullName(editedFullName)}
              disabled={editedFullName.trim() === ""}
            >
              Save
            </button> // Call the updateFullName function
          ) : (
            <button onClick={() => setShowFullNameInput(true)}>
              Edit Name
            </button>
          ))}

        {profileInfo.bio && <p>Bio: {profileInfo.bio}</p>}
        {showBioInput && myProfile && (
          <input
            type="text"
            value={editedBio}
            onChange={(e) => setEditedBio(e.target.value)}
          />
        )}
        {myProfile &&
          profileInfo.bio &&
          (showBioInput ? (
            <button
              onClick={() => updateBio(editedBio)}
              disabled={editedBio.trim() === ""}
            >
              Save
            </button> // Call the updateBio function
          ) : (
            <button onClick={() => setShowBioInput(true)}>Edit Bio</button>
          ))}

        {profileInfo.location && <p>Location: {profileInfo.location}</p>}
        {showLocationInput && myProfile && (
          <input
            type="text"
            value={editedLocation}
            onChange={(e) => setEditedLocation(e.target.value)}
          />
        )}
        {myProfile &&
          profileInfo.location &&
          (showLocationInput ? (
            <button
              onClick={() => updateLocation(editedLocation)}
              disabled={editedLocation.trim() === ""}
            >
              Save
            </button> // Call the updateLocation function
          ) : (
            <button onClick={() => setShowLocationInput(true)}>
              Edit Location
            </button>
          ))}
        {profileInfo.gender && <p>Gender: {profileInfo.gender}</p>}
        {myProfile &&
          profileInfo.gender &&
          (showGenderDropdown ? (
            <div>
              <select
                value={editedGender}
                onChange={(e) => setEditedGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <button
                onClick={() => {
                  updateGender(editedGender);
                  setShowGenderDropdown(false);
                }}
                disabled={editedGender.trim() === ""}
              >
                Save
              </button>
            </div>
          ) : (
            <button onClick={() => setShowGenderDropdown(true)}>
              Edit Gender
            </button>
          ))}
        {profileInfo.email && <p>Email: {profileInfo.email}</p>}
        {myProfile && showEmailInput && (
          <input
            type="text"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />
        )}
        {myProfile &&
          profileInfo.email &&
          (showEmailInput ? (
            <button
              onClick={() => updateEmail(editedEmail)}
              disabled={editedEmail.trim() === ""}
            >
              Save
            </button> // Call the updateEmail function
          ) : (
            <button onClick={() => setShowEmailInput(true)}>Edit Email</button>
          ))}
      </div>
    </div>
  );
}

export default Profile;
