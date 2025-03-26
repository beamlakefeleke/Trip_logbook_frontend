import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * 📋 Trip Slice - Manages Trips in Redux
 * ✅ Fetches trips from backend API
 * ✅ Allows creating, updating, and deleting trips
 * ✅ Handles loading, success, and error states
 */

// 🔄 Async Thunk: Fetch All Trips for Logged-in Driver
export const fetchTrips = createAsyncThunk(
  "trips/fetchTrips",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // 🔐 Get JWT token from Redux store
      const response = await axios.get("/api/trips/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // 🎯 Return API response
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch trips");
    }
  }
);

// 🆕 Async Thunk: Create a New Trip
export const createTrip = createAsyncThunk(
  "trips/createTrip",
  async (tripData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post("/api/trips/", tripData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create trip");
    }
  }
);

// ✏️ Async Thunk: Update Trip
export const updateTrip = createAsyncThunk(
  "trips/updateTrip",
  async ({ tripId, tripData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`/api/trips/${tripId}/`, tripData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update trip");
    }
  }
);

// ❌ Async Thunk: Delete a Trip
export const deleteTrip = createAsyncThunk(
  "trips/deleteTrip",
  async (tripId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`/api/trips/${tripId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return tripId; // Return deleted trip ID to update Redux state
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete trip");
    }
  }
);

// 📦 Initial State
const initialState = {
  trips: [],
  loading: false,
  error: null,
};

// 🚀 Trip Slice
const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {
    resetTrips: (state) => {
      state.trips = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Trip
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.push(action.payload);
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Trip
      .addCase(updateTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trips.findIndex((trip) => trip.id === action.payload.id);
        if (index !== -1) {
          state.trips[index] = action.payload; // Replace updated trip
        }
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Trip
      .addCase(deleteTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = state.trips.filter((trip) => trip.id !== action.payload);
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🎯 Export Actions & Reducer
export const { resetTrips } = tripSlice.actions;
export default tripSlice.reducer;
