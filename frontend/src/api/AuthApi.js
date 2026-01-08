import axios from "axios";

const URL = import.meta.env.VITE_BACKEND_URL;

export const ServerApi = axios.create({
  baseURL: URL,
  withCredentials: true,
});
