import React from "react";
import "../../style/FriendRequestCard.css";
import { BASE_URL } from "../../utils/ApiEndpoints";
function FriendRequestCard({ friendRequest }) {
  return (
    <div className="container">
      <div className="friend-request-card">
        <div className="profile-image">
          <img
            src={BASE_URL + friendRequest.from_user.profile_picture}
            alt="Profile Image"
          />
        </div>
        <div className="request-details">
          <p className="username">{friendRequest.from_user.full_name}</p>
          <p className="timestamp">{friendRequest.humanized_created_at}</p>
        </div>
        <div className="action-buttons">
          <button className="accept-button">Accept</button>
          <button className="reject-button">Reject</button>
        </div>
      </div>
    </div>
  );
}

export default FriendRequestCard;
