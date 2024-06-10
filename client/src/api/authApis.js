import axios from "axios";
const url = import.meta.env.VITE_BACKENDAPPURL;

const jsonconfig = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

// LoginApi
export const loginApi = async (loginCred) => {
  try {
    const data = await axios.post(`${url}/login`, loginCred, jsonconfig);
    return data;
  } catch (error) {
    return { success: false, error };
  }
};
