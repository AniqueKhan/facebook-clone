import React, { useContext } from "react";
import NavigationBar from "../components/Post/NavigationBar";
import AuthContext from "../context/AuthContext";

function Login() {
  let { loginUser } = useContext(AuthContext);
  console.log("Login Page Reached");
  return (
    <div>
      <NavigationBar />
      <form action="" onSubmit={loginUser}>
        <input type="text" name="email" placeholder="Enter Email" />
        <input type="password" name="password" placeholder="Enter password" />
        <input type="submit" />
      </form>
    </div>
  );
}

export default Login;
