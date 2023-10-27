import "../../style/Card.css";
import { BASE_URL } from "../../utils/ApiEndpoints";
function Card({ post }) {
  console.log("post from card", post);
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
              <p className="post-date">{post.created_at}</p>
            </div>
          </div>
        </div>
        <div className="post-content">
          <img src="post-image.jpg" alt="Post Image" />
        </div>
        <div className="post-footer">
          <p className="caption">{post.content}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
