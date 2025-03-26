// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTrips, addTrip, updateTrip, deleteTrip } from "../redux/tripSlice";
// import axios from "axios";

// /**
//  * Custom Hook: useTrips
//  * Manages fetching, creating, updating, and deleting trips.
//  */
// const useTrips = () => {
//   const dispatch = useDispatch();
//   const { trips, loading, error } = useSelector((state) => state.trips);
//   const [tripError, setTripError] = useState(null);

//   // Fetch trips when the hook is used
//   useEffect(() => {
//     dispatch(fetchTrips());
//   }, [dispatch]);

//   // Create a new trip
//   const createTrip = async (tripData) => {
//     try {
//       const response = await axios.post("/api/trips/", tripData, {
//         headers: { "Content-Type": "application/json" },
//       });
//       dispatch(addTrip(response.data));
//       setTripError(null);
//     } catch (err) {
//       console.error("Error creating trip:", err);
//       setTripError("Failed to create trip. Please try again.");
//     }
//   };

//   // Update an existing trip
//   const editTrip = async (tripId, tripData) => {
//     try {
//       const response = await axios.put(`/api/trips/${tripId}/`, tripData, {
//         headers: { "Content-Type": "application/json" },
//       });
//       dispatch(updateTrip({ id: tripId, updatedTrip: response.data }));
//       setTripError(null);
//     } catch (err) {
//       console.error("Error updating trip:", err);
//       setTripError("Failed to update trip. Please try again.");
//     }
//   };

//   // Delete a trip
//   const removeTrip = async (tripId) => {
//     try {
//       await axios.delete(`/api/trips/${tripId}/`);
//       dispatch(deleteTrip(tripId));
//       setTripError(null);
//     } catch (err) {
//       console.error("Error deleting trip:", err);
//       setTripError("Failed to delete trip. Please try again.");
//     }
//   };

//   return { trips, loading, error, tripError, createTrip, editTrip, removeTrip };
// };

// export default useTrips;
