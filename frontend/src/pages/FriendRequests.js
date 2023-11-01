import React, { useContext, useEffect, useState } from "react";
import FriendRequestCard from "../components/FriendRequest/FriendRequestCard";
import NavigationBar from "../components/Post/NavigationBar";
import AuthContext from "../context/AuthContext";
import { API_BASE_FRIEND_REQUESTS_URL } from "../utils/ApiEndpoints";
import { gatherConfiguration } from "../utils/HelperFunctions";
import axios from "axios";
function FriendRequests() {
  const { user, authTokens, logoutUser } = useContext(AuthContext);
  let [friendRequests, setFriendRequests] = useState([]);
  let getFriendRequests = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_FRIEND_REQUESTS_URL}`,
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        console.log("Friend Request Info Gathering Successful");
        console.log(response.data);
        setFriendRequests(response.data["data"]);
      } else {
        console.error("Friend Request Info Gathering Failed");
        logoutUser();
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("An error occurred:", error);
      logoutUser();
    }
  };

  useEffect(() => {
    getFriendRequests();
  }, []);
  return (
    <div>
      <NavigationBar />
      {friendRequests.map((friendRequest) => (
        <FriendRequestCard
          key={friendRequest.id}
          friendRequest={friendRequest}
        />
      ))}
    </div>
  );
}

export default FriendRequests;
