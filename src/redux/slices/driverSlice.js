import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌎 Base API URL (No trailing slash)
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

// ✅ Function to Get Token Securely
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  console.log("token drivers", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ✅ Async Thunk: Fetch All Drivers
export const fetchDrivers = createAsyncThunk(
  "drivers/fetchDrivers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/drivers`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch drivers");
    }
  }
);

// ✅ Async Thunk: Fetch Single Driver by ID
export const fetchDriverById = createAsyncThunk(
  "drivers/fetchDriverById",
  async (driverId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/drivers/${driverId}`, { headers: getAuthHeaders() });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Driver not found");
    }
  }
);

// ✅ Async Thunk: Update Driver Info
export const updateDriver = createAsyncThunk(
  "drivers/updateDriver",
  async ({ driverId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/drivers/${driverId}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update driver");
    }
  }
);

// ✅ Async Thunk: Delete Driver
export const deleteDriver = createAsyncThunk(
  "drivers/deleteDriver",
  async (driverId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/drivers/${driverId}`, { headers: getAuthHeaders() });
      return driverId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete driver");
    }
  }
);

// 🚀 Redux Slice
const driverSlice = createSlice({
  name: "drivers",
  initialState: {
    drivers: [],
    selectedDriver: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetDriverState: (state) => {
      state.selectedDriver = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📌 Fetch All Drivers
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Fetch Single Driver
      .addCase(fetchDriverById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriverById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDriver = action.payload;
      })
      .addCase(fetchDriverById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Update Driver
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDriver = action.payload;
        state.drivers = state.drivers.map((driver) =>
          driver.id === action.payload.id ? action.payload : driver
        );
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Delete Driver
      .addCase(deleteDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = state.drivers.filter((driver) => driver.id !== action.payload);
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🎯 Export Actions & Reducer
export const { resetDriverState } = driverSlice.actions;
export default driverSlice.reducer;
