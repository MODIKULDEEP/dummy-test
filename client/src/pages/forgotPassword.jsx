import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8010/forgotPassword", { email })
      .then((result) => {
        if (result.status === 200) {
          navigate("/login");
        } else {
          console.log(result);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
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
        <button type="submit">Send Email</button>
      </form>
      <p>Don't Have an Account</p>
      <Link to="/signup">Signup</Link>
    </div>
  );
}

export default ForgotPassword;
