import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoute from "./utils/PrivateRoute";
import Profile from "./pages/Profile";
import DetailedPost from "./components/Post/DetailedPost";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PrivateRoute Component={Home} />} />
          <Route
            path="/profile"
            element={<PrivateRoute Component={Profile} />}
          />
          <Route path="/posts/:post_id" element={<DetailedPost />} />
          <Route element={<Login />} path="/login" />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
