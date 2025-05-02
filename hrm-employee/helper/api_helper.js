import axios from "axios"
import { TOKEN } from "@/config/constant"
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL


const axiosApi = axios.create({
  baseURL: API_URL,
})

axiosApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem(TOKEN)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)


export async function GET(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data)
}

export async function POST(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function PUT(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function DELETE(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}