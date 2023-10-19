import NavigationBar from "./components/Post/NavigationBar";
import NewsFeed from "./components/Post/NewsFeed";
import { Navigate } from "react-router-dom";

function App() {
  const isAuthenticated = localStorage.getItem("token");
  return (
    <div className="App">
      {isAuthenticated ? (
        <>
          <NavigationBar />
          <NewsFeed />
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </div>
  );
}

export default App;
