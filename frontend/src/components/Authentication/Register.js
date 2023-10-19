import React, { useState } from "react";
import axios from "axios";
import { REGISTER_URL } from "../../utilities/apiEndpoints";
function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(REGISTER_URL, formData);

      if (response.status === 201) {
        console.log("Registration Successfull");
      } else {
        console.log("Registration UnSuccessfull");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>full_name:</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
          />
        </div>
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
        <div>
          <label>Password2:</label>
          <input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
