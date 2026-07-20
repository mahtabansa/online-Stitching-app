// api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = "Something went wrong. Please try again.";

    if (!navigator.onLine) {
      customMessage = "You are offline. Please check your internet connection.";
    } else if (error.code === "ERR_NETWORK") {
      customMessage = "Unable to reach server. Please check your connection.";
    } else if (error.response) {
      // server ne response diya but error status ke saath
      const status = error.response.status;
      if (status === 500 || status === 503) {
        customMessage = "Server is currently unavailable. Please try later.";
      } else if (status === 401) {
        customMessage = "Session expired. Please log in again.";
      } else if (error.response.data?.message) {
        customMessage = error.response.data.message; // backend se aaya clean message
      }
    } else if (error.request) {
      customMessage = "No response from server. Please try again.";
    }

    return Promise.reject({ ...error, customMessage });
  }
);

export default axiosInstance;