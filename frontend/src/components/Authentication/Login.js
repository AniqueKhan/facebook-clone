import React, { useState } from "react";
import axios from "axios";
import { LOGIN_URL } from "../../utilities/apiEndpoints";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, formData);

      if (response.status === 200) {
        console.log("Login Successfull");
        localStorage.setItem("token", response.data.token.access);
        navigate("/");
      } else {
        console.log("Login UnSuccessfull");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
