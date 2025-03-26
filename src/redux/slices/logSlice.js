import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * 📋 Log Slice - Manages Log Entries in Redux
 * ✅ Fetches logs from backend API
 * ✅ Adds and deletes log entries
 * ✅ Handles loading, success, and error states
 */

// 🔄 Async Thunk: Fetch Log Entries for a Trip
export const fetchLogs = createAsyncThunk(
  "logs/fetchLogs",
  async (tripId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // 🔐 Get token from Redux store
      const response = await axios.get(`/api/logs/?trip_id=${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // 🎯 Return API response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch logs");
    }
  }
);

// 📝 Async Thunk: Add a New Log Entry
export const addLogEntry = createAsyncThunk(
  "logs/addLog",
  async (logData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post("/api/logs/", logData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add log entry");
    }
  }
);

// ❌ Async Thunk: Delete a Log Entry
export const deleteLogEntry = createAsyncThunk(
  "logs/deleteLog",
  async (logId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`/api/logs/${logId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return logId; // Return deleted log ID to update Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete log entry");
    }
  }
);

// 📦 Initial State
const initialState = {
  logs: [],
  loading: false,
  error: null,
};

// 🚀 Log Slice
const logSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    resetLogs: (state) => {
      state.logs = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Logs
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Log
      .addCase(addLogEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLogEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.logs.push(action.payload);
      })
      .addCase(addLogEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Log
      .addCase(deleteLogEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLogEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = state.logs.filter((log) => log.id !== action.payload);
      })
      .addCase(deleteLogEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🎯 Export Actions & Reducer
export const { resetLogs } = logSlice.actions;
export default logSlice.reducer;
