import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🌍 API Base URL
const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/";

// ✅ Async Thunk: Fetch All Trucks
export const fetchTrucks = createAsyncThunk(
  "trucks/fetchTrucks",
  async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("access_token");
        console.log("token trucks", token);
      const response = await axios.get(`${API_URL}trucks/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Returns truck list
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch trucks");
    }
  }
);

// ✅ Async Thunk: Fetch Single Truck by ID
export const fetchTruckById = createAsyncThunk(
  "trucks/fetchTruckById",
  async (truckId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}trucks/${truckId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Truck not found");
    }
  }
);

// ✅ Async Thunk: Create a New Truck
export const createTruck = createAsyncThunk(
  "trucks/createTruck",
  async (truckData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}trucks/`, truckData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data; // Returns the created truck
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create truck");
    }
  }
);

// ✅ Async Thunk: Update a Truck
export const updateTruck = createAsyncThunk(
  "trucks/updateTruck",
  async ({ truckId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}trucks/${truckId}/`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data; // Returns updated truck
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update truck");
    }
  }
);

// ✅ Async Thunk: Delete a Truck
export const deleteTruck = createAsyncThunk(
  "trucks/deleteTruck",
  async (truckId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}trucks/${truckId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      return truckId; // Return deleted truck ID for easy filtering
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete truck");
    }
  }
);

// 🚚 Redux Slice
const truckSlice = createSlice({
  name: "trucks",
  initialState: {
    trucks: [],
    selectedTruck: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetTruckState: (state) => {
      state.selectedTruck = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📌 Fetch All Trucks
      .addCase(fetchTrucks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrucks.fulfilled, (state, action) => {
        state.loading = false;
        state.trucks = action.payload;
      })
      .addCase(fetchTrucks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Fetch Single Truck
      .addCase(fetchTruckById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTruckById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTruck = action.payload;
      })
      .addCase(fetchTruckById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Create Truck
      .addCase(createTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTruck.fulfilled, (state, action) => {
        state.loading = false;
        state.trucks.push(action.payload);
      })
      .addCase(createTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Update Truck
      .addCase(updateTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTruck.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTruck = action.payload;
        state.trucks = state.trucks.map((truck) =>
          truck.id === action.payload.id ? action.payload : truck
        );
      })
      .addCase(updateTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 📌 Delete Truck
      .addCase(deleteTruck.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTruck.fulfilled, (state, action) => {
        state.loading = false;
        state.trucks = state.trucks.filter((truck) => truck.id !== action.payload);
      })
      .addCase(deleteTruck.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 🎯 Export Actions & Reducer
export const { resetTruckState } = truckSlice.actions;
export default truckSlice.reducer;
