import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoute from "./utils/PrivateRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/profile"
            element={<PrivateRoute Component={Profile} />}
          />
          <Route exact path="/" element={<PrivateRoute Component={Home} />} />

          <Route element={<Login />} path="/login" />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
