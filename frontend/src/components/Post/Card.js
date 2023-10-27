import { useState, useContext, useEffect } from "react";
import "../../style/Card.css";
import { BASE_URL, API_BASE_POSTS_URL } from "../../utils/ApiEndpoints";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
function Card({ post }) {
  let [liked, setLiked] = useState(false);
  const { authTokens, user } = useContext(AuthContext);
  const config = {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
    },
  };
  const toggleLike = () => {
    axios
      .patch(`${API_BASE_POSTS_URL}/${post.id}/like_post`, config)
      .then((response) => {
        // Update the UI based on the API response
        if (response.status === 200) {
          setLiked(!liked);
        }
      })
      .catch((error) => {
        console.error("Error while liking the post:", error);
      });
  };
  // Use useEffect to check the like status when the component mounts
  // useEffect(() => {
  //   if (post.likes && post.likes[0]) {
  //     console.log(post.likes[0]["id"]);
  //   }
  // }, [post.likes, user.id]);

  return (
    <div className="middle-portion">
      <div className="post-card">
        <div className="post-header">
          <div className="user-info">
            <img
              src={BASE_URL + post.user.profile_picture}
              alt="User Profile Picture"
            />
            <div className="user-details">
              <p className="username">{post.user.full_name}</p>
              <p className="post-date">{post.humanized_created_at} ago</p>
            </div>
          </div>
        </div>
        {post.media_file && post.is_image && (
          <div className="post-content">
            <img src={BASE_URL + post.media_file} alt="Post Image" />
          </div>
        )}
        {post.media_file && !post.is_image && (
          <div className="post-content">
            <video controls src={BASE_URL + post.media_file} alt="Post Image" />
          </div>
        )}

        <div className="post-footer">
          <p className="caption">{post.content}</p>
        </div>
        <div className="button-container">
          <button className="post-button" onClick={toggleLike}>
            {liked ? "Liked" : "Like"}
          </button>
          <button className="post-button">Comment</button>
          <button className="post-button">Share</button>
        </div>
      </div>
    </div>
  );
}

export default Card;
