import axios from "axios";

const api = axios.create({
  baseURL: "http://10.247.184.155:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
