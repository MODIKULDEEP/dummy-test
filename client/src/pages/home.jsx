import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8010/home")
      .then((result) => {
        if (result.status !== 200) {
          navigate("/login");
        }
      })
      .catch((err) => navigate("/login"));
  }, []);

  return <div>This Is Home Page</div>;
}

export default Home;
