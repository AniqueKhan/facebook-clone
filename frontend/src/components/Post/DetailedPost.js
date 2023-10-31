import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_POSTS_URL } from "../../utils/ApiEndpoints";
import { gatherConfiguration } from "../../utils/HelperFunctions";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import Card from "./Card";
import NavigationBar from "./NavigationBar";

function DetailedPost() {
  const { post_id } = useParams();
  let [post, setPost] = useState({});
  const { authTokens, logoutUser } = useContext(AuthContext);
  const getPost = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_POSTS_URL}/${post_id}`,
        gatherConfiguration(authTokens)
      );

      if (response.status === 200) {
        console.log("Post Retrieval Successful");
        console.log(response.data["data"]);
        setPost(response.data["data"]);
        console.log("post info", post);
      } else {
        console.error("Post Retrieval Failed");
        logoutUser();
      }
    } catch (error) {
      console.error("An error occurred:", error);
      logoutUser();
    }
  };
  useEffect(() => {
    getPost();
  }, [post_id]);
  return (
    <div>
      <NavigationBar />
      <Card post={post} />
    </div>
  );
}

export default DetailedPost;
