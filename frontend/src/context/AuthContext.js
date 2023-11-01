// Necessary Imports
import { createContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LOGIN_URL,
  TOKEN_REFRESH_URL,
  REGISTER_URL,
} from "../utils/ApiEndpoints";

// Creating and Exporting the Auth Context
const AuthContext = createContext();
export default AuthContext;

// Auth Provider - Contains All The Authentication Logic
export const AuthProvider = ({ children }) => {
  // Initializing variables
  let initialLocalStorageTokens = localStorage.getItem("authTokens");

  // State Management
  let [authTokens, setAuthTokens] = useState(() =>
    initialLocalStorageTokens ? JSON.parse(initialLocalStorageTokens) : null
  );
  let [user, setUser] = useState(() =>
    initialLocalStorageTokens ? jwt_decode(initialLocalStorageTokens) : null
  );
  let [loading, setLoading] = useState(true);

  // Initializing Navigate
  const navigate = useNavigate();

  // Login Function
  let loginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          email: e.target.email.value,
          password: e.target.password.value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        let token = response.data["data"]["token"];
        // Successful login
        console.log("Login Successful");
        console.log(token);
        console.log(response.data);
        setAuthTokens(token);
        setUser(jwt_decode(token["access"]));
        localStorage.setItem("authTokens", JSON.stringify(token));
        navigate("/");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("An error occurred:", error);
    }
  };

  // Register Function
  // Registration Function
  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        REGISTER_URL, // Replace with your actual registration API endpoint
        {
          email: e.target.email.value,
          full_name: e.target.full_name.value, // Add full_name field
          password: e.target.password.value,
          password2: e.target.password2.value, // Add password2 field
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        // Assuming 201 is the successful registration status code
        const token = response.data["data"]["token"];
        // Successful registration
        console.log("Registration Successful");
        console.log(token);
        console.log(response.data);
        setAuthTokens(token);
        setUser(jwt_decode(token["access"]));
        localStorage.setItem("authTokens", JSON.stringify(token));
        navigate("/"); // Redirect the user to the desired page after registration
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error("An error occurred:", error);
    }
  };

  // Logout Function
  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  // Updating Tokens Function
  let updateToken = async () => {
    try {
      const response = await axios.post(
        TOKEN_REFRESH_URL,
        {
          refresh: authTokens?.refresh,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwt_decode(data["access"]));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        console.log("Error updating token");
        logoutUser();
      }
    } catch (error) {
      // Handle errors, e.g., network errors, request validation, etc.
      console.error("Error updating token:", error);
    }
    if (loading) {
      setLoading(false);
    }
  };

  // Use Effect Logic
  useEffect(() => {
    if (loading) {
      updateToken();
    }
    const fourMinutes = 1000 * 60 * 4;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  // Setting Up Context Data
  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    registerUser: registerUser,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
