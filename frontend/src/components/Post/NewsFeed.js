import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import Card from "./Card";
import { API_BASE_POSTS_URL } from "../../utils/ApiEndpoints";
import axios from "axios";

function NewsFeed() {
  const { authTokens, logoutUser } = useContext(AuthContext);
  let [posts, setPosts] = useState([]);
  const config = {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
    },
  };
  let getPosts = async () => {
    try {
      const response = await axios.get(API_BASE_POSTS_URL, config);

      if (response.status === 200) {
        // Successful login
        console.log("Post Info Gathering Successful");
        console.log(response.data);
        setPosts(response.data["data"]);
        console.log("posts", posts);
      } else {
        alert("Something went wrong.");
        console.error("Post Info Gathering Failed");
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
    getPosts();
  }, []);
  return (
    <div>
      {posts.map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </div>
    // <div>
    //   <Card />
    // </div>
  );
}

export default NewsFeed;
