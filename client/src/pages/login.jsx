import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { loginApi } from "../api/authApis";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginApi({ email, password });
      if (result.status === 200) {
        navigate("/home");
      } else {
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="form-container">
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Your Email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="input-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Your Password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't Have an Account</p>
      <Link to="/forgot-password">Forgot Password</Link>
      <Link to="/signup">Signup</Link>
    </div>
  );
}

export default Login;
