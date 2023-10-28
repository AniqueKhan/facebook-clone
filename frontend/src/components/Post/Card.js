import { useState, useContext, useEffect } from "react";
import "../../style/Card.css";
import { BASE_URL, API_BASE_POSTS_URL } from "../../utils/ApiEndpoints";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
function Card({ post }) {
  const { authTokens, user } = useContext(AuthContext);
  // Initializing like state variable
  let [liked, setLiked] = useState(false);
  let [likesCount, setLikeCount] = useState(0);

  // Setting configuration for sending authenticated requests
  const config = {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
    },
  };

  // Toggle Like Function
  const toggleLike = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_POSTS_URL}/${post.id}/like_post`,
        config
      );

      if (response.status === 200) {
        // Fetch the updated post data from the server
        const updatedPostResponse = await axios.get(
          `${API_BASE_POSTS_URL}/${post.id}`,
          config
        );

        if (updatedPostResponse.status === 200) {
          const updatedPost = updatedPostResponse.data["data"];
          if (user && user.user_id && updatedPost.likes) {
            setLiked(
              updatedPost.likes.some((like) => like.id === user.user_id)
            );
            setLikeCount(updatedPost.likes.length);
          }
        } else {
          console.log("Error while getting updated post data response");
        }
      } else {
        console.log("Error while liking/unliking the post");
      }
    } catch (error) {
      console.error("Error while liking/unliking the post:", error);
    }
  };

  // Use Effect
  useEffect(() => {
    // Checking if the user has already liked the post
    if (user && user.user_id && post.likes) {
      const hasLiked = post.likes.some((like) => like.id === user.user_id);
      setLiked(hasLiked);
      setLikeCount(post.likes.length);
    }
  }, [post.likes, user.user_id]);
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
          <p>Likes Count : {likesCount}</p>
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
