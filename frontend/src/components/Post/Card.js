import "../../style/Card.css";
function Card() {
  return (
    <div className="middle-portion">
      <div className="post-card">
        <div className="post-header">
          <div className="user-info">
            <img src="../Post/profile.jpg" alt="User Profile Picture" />
            <div className="user-details">
              <p className="username">JohnDoe</p>
              <p className="post-date">October 19, 2023</p>
            </div>
          </div>
        </div>
        <div className="post-content">
          <img src="post-image.jpg" alt="Post Image" />
        </div>
        <div className="post-footer">
          <p className="caption">Beautiful sunset view! 🌅</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
