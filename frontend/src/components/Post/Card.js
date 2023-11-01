import { useState, useContext, useEffect } from "react";
import "../../style/Card.css";
import { BASE_URL, API_BASE_POSTS_URL } from "../../utils/ApiEndpoints";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import likeSound from "../../utils/sounds/facebook_like.mp3";
import {
  gatherConfiguration,
  userIsFriend,
  canEditDelete,
} from "../../utils/HelperFunctions";
import { Link } from "react-router-dom";

// Card Component
function Card({ post }) {
  const { authTokens, user } = useContext(AuthContext);

  // Check for permissions
  let canEditDeletePermission = canEditDelete(user, post);

  // Initializing liked state variable
  let [liked, setLiked] = useState(false);

  // Initializing likes count state variable
  let [likesCount, setLikesCount] = useState(0);

  // Initializing the comment form variable
  let [commentBox, showCommentBox] = useState(false);

  // Set share button visibility
  let [shareButtonVisibility, setShareButtonVisibility] = useState(false);

  // Initializing the show comment  variable
  let [showComments, setShowComments] = useState(false);

  // State variable to store the comment text
  const [comment, setComment] = useState("");

  // State variable to store comments
  const [comments, setComments] = useState([]);

  // Initializing comments count state variable
  let [commentsCount, setCommentsCount] = useState(0);

  // State variable to manage the dropdown visibility
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  // Toggle Like Function
  const toggleLike = async () => {
    const audio = document.getElementById("likeSound");
    try {
      const response = await axios.get(
        `${API_BASE_POSTS_URL}/${post.id}/like_post`,
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        // Fetch the updated post data from the server

        const updatedPost = response.data["data"];
        if (user && user.user_id && updatedPost.likes) {
          const userLiked = updatedPost.likes.some(
            (like) => like.id === user.user_id
          );
          if (userLiked) {
            audio.play();
          }
          setLiked(userLiked);
          setLikesCount(updatedPost.likes.length);
        }
      } else {
        console.log("Error while getting updated post data response");
      }
    } catch (error) {
      console.error("Error while liking/unliking the post:", error);
    }
  };

  // Handle comment submission
  const submitComment = async () => {
    try {
      // Send the comment to the server
      const response = await axios.post(
        `${API_BASE_POSTS_URL}/${post.id}/add_comment`,
        { content: comment },
        gatherConfiguration(authTokens)
      );

      if (response.status === 201) {
        const updatedPost = response.data["data"];
        // Comment was successfully posted, update the comments state
        setComments(updatedPost.comments); // Add the new comment to the existing comments
        setComment(""); // Clear the comment input field
        setCommentsCount(updatedPost.comments.length);
        showCommentBox(false);
      } else {
        console.log("Error while fetching updated post after comment");
      }
    } catch (error) {
      console.error("Error while posting a comment:", error);
    }
  };

  // Use Effect
  useEffect(() => {
    // Checking if the user has already liked the post
    if (user && user.user_id && post.likes) {
      const hasLiked = post.likes.some((like) => like.id === user.user_id);
      setLiked(hasLiked);
      setLikesCount(post.likes.length);
    }
    // Setting the initial comments variable to the post's comments
    if (post.comments) {
      setComments(post.comments);
      setCommentsCount(post.comments.length);
    }

    // Set the initial share button visibility
    if (post.privacy !== "private") {
      if (post.privacy == "public" || userIsFriend(user, post)) {
        setShareButtonVisibility(true);
      }
    }
  }, [post, user]);

  // Main return statement
  return (
    <div className="middle-portion">
      <div className="post-card">
        {/* Dropdown Button */}
        <div className="dropdown">
          <button onClick={toggleDropdown} className="dropbtn">
            &#8942; {/* Unicode for vertical ellipsis (three dots) */}
          </button>

          {/* Dropdown Content */}
          {isDropdownVisible && (
            <div className="dropdown-content">
              <button href="#" className="dropdown-option">
                Save
              </button>
              {canEditDeletePermission && (
                <button href="#" className="dropdown-option">
                  Edit
                </button>
              )}
              {canEditDeletePermission && (
                <button href="#" className="dropdown-option">
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {/* Shared Post Header */}

        {post.shared && post.shared_by && post.shared_by.profile_picture && (
          <div className="user-info" style={{ marginBottom: "24px" }}>
            {post.shared_by.profile_picture ? (
              <img
                src={BASE_URL + post.shared_by.profile_picture}
                alt="User Profile Picture"
              />
            ) : (
              <img
                src={`${BASE_URL}/media/default/default_user_profile.png`}
                alt="User Profile Picture"
              />
            )}

            <div className="user-details">
              <p className="username">
                <Link to={`/profile/${post.shared_by.id}`}>
                  {post.shared_by.full_name}
                </Link>
                shared
                <Link to={`/profile/${post.user.id}`}>
                  {post.user.full_name}
                </Link>
                's post
              </p>

              <p className="post-date">
                {post.humanized_shared_at == "0 minutes"
                  ? "Just Now"
                  : `${post.humanized_shared_at} ago`}
              </p>
              <Link to={`/posts/${post.id}`}>
                <small style={{ color: "white", textDecoration: "none" }}>
                  View Details
                </small>
              </Link>
            </div>
          </div>
        )}

        <div className="post-header">
          <div className="user-info">
            {post && post.user && post.user.profile_picture ? (
              <img
                src={BASE_URL + post.user.profile_picture}
                alt="User Profile Picture"
              />
            ) : (
              <img
                src={`${BASE_URL}/media/default/default_user_profile.png`}
                alt="User Profile Picture"
              />
            )}

            <div className="user-details">
              {post && post.user && post.user.full_name && (
                <p className="username">
                  <Link to={`/profile/${post.user.id}`}>
                    {post.user.full_name}
                  </Link>
                </p>
              )}

              <p className="post-date">
                {post.humanized_created_at == "0 minutes"
                  ? "Just Now"
                  : `${post.humanized_created_at} ago`}
              </p>
              <Link
                to={`/posts/${post.shared ? post.original_post_id : post.id}`}
              >
                <small style={{ color: "white", textDecoration: "none" }}>
                  View Details
                </small>
              </Link>
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
        {post.content && (
          <div className="post-footer">
            <p className="caption">{post.content}</p>
          </div>
        )}
        <div className="button-container">
          {likesCount > 0 && <p>Likes Count : {likesCount}</p>}
          <audio src={likeSound} id="likeSound" />
          <button className="post-button" onClick={toggleLike}>
            {liked ? "Liked" : "Like"}
          </button>
          {commentsCount > 0 && <p>Comments Count : {commentsCount}</p>}
          <button
            className="post-button"
            onClick={() => {
              showCommentBox(!commentBox);
            }}
          >
            Comment
          </button>
          {shareButtonVisibility && (
            <button className="post-button">Share</button>
          )}
        </div>
        {commentBox && (
          <div className="post-comment-form">
            <input
              type="text"
              placeholder="Enter your comment here..."
              value={comment} // Bind the input field to the comment state
              onChange={(e) => {
                setComment(e.target.value);
              }} // Handle input changes
            />
            <button className="post-button" onClick={submitComment}>
              Post Comment
            </button>
          </div>
        )}
        {comments.length > 0 && (
          <button
            onClick={() => {
              setShowComments(!showComments);
            }}
          >
            Show Comments
          </button>
        )}
        {showComments &&
          comments.length > 0 &&
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>
                {comment.user.full_name}: {comment.content}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Card;
