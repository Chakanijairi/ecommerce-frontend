import axios from "axios";

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
// });
export const UPLOAD = "https://ecommerce-backend-lxq0.onrender.com/uploads"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://ecommerce-backend-lxq0.onrender.com/api",
});

export default apiClient;

