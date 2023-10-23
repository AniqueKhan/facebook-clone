import React, { useContext, useEffect, useState } from "react";
import NavigationBar from "../components/Post/NavigationBar";
import AuthContext from "../context/AuthContext";
import { PROFILE_URL } from "../utils/ApiEndpoints";
import axios from "axios";

function Profile() {
  let [profileInfo, setProfileInfo] = useState({});
  const { authTokens, logoutUser } = useContext(AuthContext);

  const config = {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
    },
  };

  let getProfileInfo = async () => {
    try {
      const response = await axios.get(PROFILE_URL, config);

      if (response.status === 200) {
        // Successful login
        console.log("Profile Info Gathering Successful");
        console.log(response.data);
        setProfileInfo(response.data);
      } else {
        alert("Something went wrong.");
        console.error("Profile Info Gathering Failed");
        logoutUser();
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      alert("Something went wrong.");
      console.error("An error occurred:", error);
      logoutUser();
    }
  };

  useEffect(() => {
    getProfileInfo();
  }, []);
  return (
    <div>
      <NavigationBar />
      <ul>
        <li>{profileInfo.email}</li>
        <li>{profileInfo.bio}</li>
        <li>{profileInfo.full_name}</li>
      </ul>
    </div>
  );
}

export default Profile;
