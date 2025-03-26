import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  requestPasswordReset,
  confirmPasswordReset,
} from "../../api/authApi";
import axios from "axios";

// 🏗️ **Initial State**
const storedUser = localStorage.getItem("user");
const initialState = {
  user: storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
  accessToken: localStorage.getItem("access_token") || null,
  refreshToken: localStorage.getItem("refresh_token") || null,
  loading: false,
  error: null,
};

// 🔄 **Async Thunks (Handles API Calls)**
/**
 * ✅ User Login
 */
export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
      const response = await loginUser(credentials);
      return response;
  } catch (error) {
      return thunkAPI.rejectWithValue(error);
  }
});

/**
 * ✅ User Registration
 */
export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await registerUser(userData);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

/**
 * ✅ Auto Refresh Token
 */
export const refreshToken = createAsyncThunk("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const newAccessToken = await refreshAccessToken();
    return newAccessToken;
  } catch (error) {
    return rejectWithValue(error);
  }
});

/**
 * ✅ Password Reset Request
 */
export const resetPasswordRequest = createAsyncThunk(
  "auth/resetPasswordRequest",
  async (email, { rejectWithValue }) => {
    try {
      const response = await requestPasswordReset({ email });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * ✅ Confirm Password Reset
 */
export const resetPasswordConfirm = createAsyncThunk(
  "auth/resetPasswordConfirm",
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await confirmPasswordReset(resetData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// ✅ Fetch Users Action (Admin Only)
export const fetchUsers = createAsyncThunk("auth/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/api/users/"); // Ensure this endpoint is correct
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


// 🎛️ **Authentication Slice**
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * ✅ Logout User (Clears State & LocalStorage)
     */
    logout: (state) => {
      logoutUser();
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 **Login**
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        console.log("🚀 ~ file: authSlice.js ~ line 123 ~ .addCase ~ state", state);

        // Store tokens in localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("access_token", action.payload.access);
        localStorage.setItem("refresh_token", action.payload.refresh);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || "Login failed";
      })

      // 🔹 **Register**
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || "Registration failed";
      })

      // 🔹 **Refresh Token**
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        localStorage.setItem("access_token", action.payload);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        logoutUser();
      })

      // 🔹 **Password Reset Request**
      .addCase(resetPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || "Password reset request failed";
      })

      // 🔹 **Confirm Password Reset**
      .addCase(resetPasswordConfirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordConfirm.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordConfirm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || "Password reset confirmation failed";
      });
  },
});

// 🏆 **Export Actions & Reducer**
export const { logout } = authSlice.actions;
export default authSlice.reducer;
