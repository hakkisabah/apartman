import axios from 'axios'
export const appAxios = axios.create({
  baseURL: import.meta.env.VITE_SITE_API_URL,
})