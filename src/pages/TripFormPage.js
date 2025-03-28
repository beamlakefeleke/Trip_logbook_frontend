import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { createTrip } from "../redux/slices/tripSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import { DirectionsCar, Send } from "@mui/icons-material";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet"; // Import Leaflet
import "leaflet/dist/leaflet.css";

// 📜 Validation Schema
const validationSchema = Yup.object({
  pickup_location: Yup.string().required("Pickup location is required"),
  dropoff_location: Yup.string().required("Dropoff location is required"),
  cycle_used: Yup.number().min(0, "Cycle hours must be positive").required(),
  fuel_stops: Yup.number().min(0, "Fuel stops cannot be negative").required(),
});

const TripFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [pickupOptions, setPickupOptions] = useState([]);
  const [dropoffOptions, setDropoffOptions] = useState([]);

  // 📌 Formik Hook
  const formik = useFormik({
    initialValues: {
      pickup_location: "",
      dropoff_location: "",
      cycle_used: "",
      fuel_stops: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(createTrip(values))
        .unwrap()
        .then(() => {
          setSuccess(true);
          setTimeout(() => navigate("/dashboard"), 2000);
        });
    },
  });

  // 🌍 Fetch Coordinates using OpenStreetMap API
  const fetchCoordinates = useCallback(async (location, setCoords, setOptions) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=5`
      );
      const data = await response.json();
      if (data.length > 0) {
        const options = data.map(item => item.display_name); // map the results to display names
        setOptions(options);
        const { lat, lon } = data[0];
        console.log("Fetched Coordinates: ", lat, lon); // Debugging: Check if coordinates are fetched
        setCoords([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  }, []);

  // 🚗 Fetch Route using OSRM API
  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickupCoords || !dropoffCoords) return;

      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickupCoords[1]},${pickupCoords[0]};${dropoffCoords[1]},${dropoffCoords[0]}?geometries=geojson`
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const coordinates = data.routes[0].geometry.coordinates.map(([lon, lat]) => [lat, lon]);
          console.log("Fetched Route Coordinates: ", coordinates); // Debugging: Check route coordinates
          setRouteCoords(coordinates);
        } else {
          console.error("No route found");
          setRouteCoords([]);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
        setRouteCoords([]); // Clear route on error
      }
    };

    fetchRoute();
  }, [pickupCoords, dropoffCoords]);

  // 📍 Custom Icons for Markers
  const pickupIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png", // Example pickup icon URL
    iconSize: [32, 32], // Set size of the icon
    iconAnchor: [16, 32], // Anchor icon at bottom center
    popupAnchor: [0, -32], // Popup anchor
  });

  const dropoffIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25695.png", // Example dropoff icon URL
    iconSize: [32, 32], // Set size of the icon
    iconAnchor: [16, 32], // Anchor icon at bottom center
    popupAnchor: [0, -32], // Popup anchor
  });

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
        <DirectionsCar sx={{ mr: 1, fontSize: 35, color: "#1976d2" }} />
        Create New Trip
      </Typography>

      {/* 🎯 Form Section */}
      <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            {/* 📍 Pickup Location */}
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={pickupOptions}
                onInputChange={(event, newInputValue) => {
                  fetchCoordinates(newInputValue, setPickupCoords, setPickupOptions);
                }}
                onChange={(event, value) => {
                  formik.setFieldValue("pickup_location", value);
                  fetchCoordinates(value, setPickupCoords, setPickupOptions);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Pickup Location"
                    {...formik.getFieldProps("pickup_location")}
                    error={formik.touched.pickup_location && Boolean(formik.errors.pickup_location)}
                    helperText={formik.touched.pickup_location && formik.errors.pickup_location}
                  />
                )}
              />
            </Grid>

            {/* 📍 Drop-off Location */}
            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={dropoffOptions}
                onInputChange={(event, newInputValue) => {
                  fetchCoordinates(newInputValue, setDropoffCoords, setDropoffOptions);
                }}
                onChange={(event, value) => {
                  formik.setFieldValue("dropoff_location", value);
                  fetchCoordinates(value, setDropoffCoords, setDropoffOptions);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Drop-off Location"
                    {...formik.getFieldProps("dropoff_location")}
                    error={formik.touched.dropoff_location && Boolean(formik.errors.dropoff_location)}
                    helperText={formik.touched.dropoff_location && formik.errors.dropoff_location}
                  />
                )}
              />
            </Grid>

            {/* 🗺️ Map Preview */}
            <Grid item xs={12}>
              <MapContainer
                key={`${pickupCoords ? pickupCoords.join(",") : ""}-${dropoffCoords ? dropoffCoords.join(",") : ""}`} // unique key
                center={pickupCoords || [37.7749, -122.4194]} // default to San Francisco if no coordinates
                zoom={8}
                style={{ height: "300px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Add Pickup Marker with Custom Icon */}
                {pickupCoords && <Marker position={pickupCoords} icon={pickupIcon} />}
                {/* Add Dropoff Marker with Custom Icon */}
                {dropoffCoords && <Marker position={dropoffCoords} icon={dropoffIcon} />}
                {/* Add Route Polyline */}
                {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
              </MapContainer>
            </Grid>

            {/* ⏳ Cycle Hours */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Cycle Hours"
                type="number"
                {...formik.getFieldProps("cycle_used")}
                error={formik.touched.cycle_used && Boolean(formik.errors.cycle_used)}
                helperText={formik.touched.cycle_used && formik.errors.cycle_used}
              />
            </Grid>

            {/* ⛽ Fuel Stops */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fuel Stops"
                type="number"
                {...formik.getFieldProps("fuel_stops")}
                error={formik.touched.fuel_stops && Boolean(formik.errors.fuel_stops)}
                helperText={formik.touched.fuel_stops && formik.errors.fuel_stops}
              />
            </Grid>

            {/* 🚀 Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Send />}
                fullWidth
              >
                Create Trip
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* ✅ Success Snackbar */}
      <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Trip created successfully!</Alert>
      </Snackbar>
    </Container>
  );
};

export default TripFormPage;
