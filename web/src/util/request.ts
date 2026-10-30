import axios from "axios";

export const request = axios.create({
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL,
})

request.interceptors.request.use(config => {
  config.headers.set("token", localStorage.getItem(import.meta.env.VITE_LOCAL_TOKEN_KEY))
  return config
})