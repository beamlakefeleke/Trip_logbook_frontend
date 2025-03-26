import axios from "axios";

// ✅ Base API URL (Uses environment variable)
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/auth/";

/**
 * 🔄 Axios instance with interceptors to handle authentication & auto-refresh
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach Authorization Token to Each Request Automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ✅ User Registration API
 * @param {Object} userData - { username, email, password, confirmPassword }
 * @returns {Promise<Object>} API Response
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("register/", userData);
    return response.data;
  } catch (error) {
    console.error("🔴 Registration Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * ✅ User Login API
 * @param {Object} credentials - { username, password }
 * @returns {Promise<Object>} API Response with Access & Refresh Tokens
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post("login/", credentials);
    const { access, refresh, user } = response.data;

    // Store Tokens & User Data in LocalStorage
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  } catch (error) {
    console.error("🔴 Login Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * 🔄 Refresh Token API (Automatic Token Refresh)
 * @returns {Promise<string>} New Access Token
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token found.");

    const response = await apiClient.post("token/refresh/", { refresh: refreshToken });
    const { access } = response.data;

    // Update Access Token in LocalStorage
    localStorage.setItem("access_token", access);
    return access;
  } catch (error) {
    console.error("🔴 Token Refresh Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ✅ Axios Response Interceptor: Auto Refresh Token on Expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        apiClient.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("🔴 Auto Refresh Failed, Logging Out...");
        logoutUser();
      }
    }
    return Promise.reject(error);
  }
);

/**
 * ✅ User Logout API (Clears Storage & Tokens)
 */
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  window.location.href = "/login"; // Redirect to login page
};

/**
 * ✅ Initiate Password Reset (Send Reset Link)
 * @param {Object} emailData - { email }
 * @returns {Promise<Object>} API Response
 */
export const requestPasswordReset = async (emailData) => {
  try {
    const response = await apiClient.post("password_reset/", emailData);
    return response.data;
  } catch (error) {
    console.error("🔴 Password Reset Request Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

/**
 * ✅ Confirm Password Reset (Set New Password)
 * @param {Object} resetData - { uid, token, new_password }
 * @returns {Promise<Object>} API Response
 */
export const confirmPasswordReset = async (resetData) => {
  try {
    const response = await apiClient.post("password_reset/confirm/", resetData);
    return response.data;
  } catch (error) {
    console.error("🔴 Password Reset Confirm Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
