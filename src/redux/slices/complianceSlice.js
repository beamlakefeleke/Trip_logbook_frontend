import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * 🚛 Compliance Slice - Manages Compliance State in Redux
 * ✅ Fetches compliance data from backend API
 * ✅ Stores compliance status in Redux store
 * ✅ Handles loading, success, and error states
 */

// 🔄 Async Thunk: Fetch Compliance Status
export const fetchComplianceStatus = createAsyncThunk(
  "compliance/fetchStatus",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // 🔐 Get token from Redux store
      const response = await axios.get("/api/compliance/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // 🎯 Return API response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch compliance status");
    }
  }
);

// 📦 Initial State
const initialState = {
  hoursUsed: 0,
  isCompliant: true,
  loading: false,
  error: null,
};

// 🚀 Compliance Slice
const complianceSlice = createSlice({
  name: "compliance",
  initialState,
  reducers: {
    resetCompliance: (state) => {
      state.hoursUsed = 0;
      state.isCompliant = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplianceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplianceStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.hoursUsed = action.payload.hours_used;
        state.isCompliant = action.payload.is_compliant;
      })
      .addCase(fetchComplianceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🎯 Export Actions & Reducer
export const { resetCompliance } = complianceSlice.actions;
export default complianceSlice.reducer;
