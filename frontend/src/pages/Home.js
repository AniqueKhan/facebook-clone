import React from "react";
import NavigationBar from "../components/Post/NavigationBar";
import NewsFeed from "../components/Post/NewsFeed";
function Home() {
  return (
    <div>
      <NavigationBar />
      <NewsFeed />
      This is the home page
    </div>
  );
}

export default Home;
