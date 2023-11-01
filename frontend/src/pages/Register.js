import React, { useContext } from "react";
import NavigationBar from "../components/Post/NavigationBar";
import AuthContext from "../context/AuthContext";

function Register() {
  const { registerUser } = useContext(AuthContext);
  console.log("Registration Page Reached");

  return (
    <div>
      <NavigationBar />
      <form action="" onSubmit={registerUser}>
        <input type="text" name="email" placeholder="Enter Email" />
        <input type="text" name="full_name" placeholder="Enter Full Name" />
        <input type="password" name="password" placeholder="Enter Password" />
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
        />
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}

export default Register;
