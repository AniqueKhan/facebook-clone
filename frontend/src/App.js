import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoute from "./utils/PrivateRoute";
import Profile from "./pages/Profile";
import DetailedPost from "./components/Post/DetailedPost";
import Register from "./pages/Register";
import FriendRequests from "./pages/FriendRequests";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute Component={Home} />} />
          <Route
            path="/profile/:user_id"
            element={<PrivateRoute Component={Profile} />}
          />
          <Route path="/posts/:post_id" element={<DetailedPost />} />
          <Route path="/friend_requests" element={<FriendRequests />} />
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
