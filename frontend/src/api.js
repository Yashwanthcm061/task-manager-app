import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-backend-6n70.onrender.com"
});

export default api;