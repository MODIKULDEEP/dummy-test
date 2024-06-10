import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { id, token } = useParams();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8010/resetPassword/${id}/${token}`, { password })
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
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Your New Password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      <p>Don't Have an Account</p>
      <Link to="/signup">Signup</Link>
    </div>
  );
}

export default ResetPassword;
