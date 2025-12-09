import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
  withCredentials: true, // 🔹 send cookies (accessToken, refreshToken) on every request
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 errors globally (token expired)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Attempt to refresh token
        const refreshRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/auth/refreshToken`,
          { withCredentials: true }
        );

        const newToken = refreshRes.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        // retry original request
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshError) {
        console.error("Refresh failed");
        localStorage.removeItem("accessToken");
      }
    }

    return Promise.reject(err);
  }
);

export default api;