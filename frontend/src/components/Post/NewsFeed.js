import { useContext, useState, useEffect } from "react";
import AuthContext from "../../context/AuthContext";
import Card from "./Card";
import { API_BASE_POSTS_URL } from "../../utils/ApiEndpoints";
import axios from "axios";
import { gatherConfiguration } from "../../utils/HelperFunctions";

function NewsFeed() {
  // Getting Authentication Stuff Using Contenxt
  const { authTokens, logoutUser } = useContext(AuthContext);

  // Initializing empty post state array
  let [posts, setPosts] = useState([]);

  // Getting posts
  let getPosts = async () => {
    try {
      const response = await axios.get(
        API_BASE_POSTS_URL,
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        // Successful login
        console.log("Post Info Gathering Successful");
        console.log(response.data);
        setPosts(response.data["data"]);
      } else {
        console.error("Post Info Gathering Failed");
        logoutUser();
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("An error occurred:", error);
      logoutUser();
    }
  };

  useEffect(() => {
    getPosts();
  }, []);
  if (posts.length === 0) {
    return <h1>No posts to show</h1>;
  }
  return (
    <div>
      {posts.map((post) => (
        <Card key={post.id} post={post} />
      ))}
    </div>
  );
}

export default NewsFeed;
