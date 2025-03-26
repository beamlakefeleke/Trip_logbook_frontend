import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTrip } from "../redux/slices/tripSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import GooglePlacesAutocomplete from "react-google-autocomplete";
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid2 as Grid,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { DirectionsCar, AddLocation, Send } from "@mui/icons-material";

// 🎬 Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// 📜 Validation Schema
const validationSchema = Yup.object({
  pickup_location: Yup.string().required("Pickup location is required"),
  dropoff_location: Yup.string().required("Dropoff location is required"),
  cycle_used: Yup.number().min(0, "Cycle hours must be positive").max(70, "Max cycle limit is 70 hours").required(),
  fuel_stops: Yup.number().min(0, "Fuel stops cannot be negative").required(),
});

const TripFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.trips);
  const [success, setSuccess] = useState(false);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [directions, setDirections] = useState(null);

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
      dispatch(createTrip (values))
        .unwrap()
        .then(() => {
          setSuccess(true);
          setTimeout(() => navigate("/dashboard"), 2000);
        });
    },
  });

  // 🗺️ Google Maps Directions API
  const calculateRoute = () => {
    if (!pickupCoords || !dropoffCoords) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: pickupCoords,
        destination: dropoffCoords,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
          <DirectionsCar sx={{ mr: 1, fontSize: 35, color: "#1976d2" }} />
          Create New Trip
        </Typography>
      </motion.div>

      {/* 🎯 Form Section */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
        <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              {/* 📍 Pickup Location */}
              <Grid item xs={12}>
                <GooglePlacesAutocomplete
                  apiKey="YOUR_GOOGLE_MAPS_API_KEY"
                  onPlaceSelected={(place) => {
                    formik.setFieldValue("pickup_location", place.formatted_address);
                    setPickupCoords({
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    });
                  }}
                  className="google-autocomplete"
                />
                {formik.touched.pickup_location && formik.errors.pickup_location && (
                  <Typography color="error">{formik.errors.pickup_location}</Typography>
                )}
              </Grid>

              {/* 📍 Drop-off Location */}
              <Grid item xs={12}>
                <GooglePlacesAutocomplete
                  apiKey="YOUR_GOOGLE_MAPS_API_KEY"
                  onPlaceSelected={(place) => {
                    formik.setFieldValue("dropoff_location", place.formatted_address);
                    setDropoffCoords({
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    });
                    calculateRoute(); // Auto-update route
                  }}
                  className="google-autocomplete"
                />
                {formik.touched.dropoff_location && formik.errors.dropoff_location && (
                  <Typography color="error">{formik.errors.dropoff_location}</Typography>
                )}
              </Grid>

              {/* 🗺️ Map Preview */}
              <Grid item xs={12}>
                <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
                  <GoogleMap
                    center={pickupCoords || { lat: 37.7749, lng: -122.4194 }}
                    zoom={8}
                    mapContainerStyle={{ height: "300px", width: "100%" }}
                  >
                    {pickupCoords && <Marker position={pickupCoords} label="Pickup" />}
                    {dropoffCoords && <Marker position={dropoffCoords} label="Drop-off" />}
                    {directions && <DirectionsRenderer directions={directions} />}
                  </GoogleMap>
                </LoadScript>
              </Grid>

              {/* ⏳ Cycle Hours Used */}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cycle Hours Used"
                  type="number"
                  name="cycle_used"
                  value={formik.values.cycle_used}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  name="fuel_stops"
                  value={formik.values.fuel_stops}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.fuel_stops && Boolean(formik.errors.fuel_stops)}
                  helperText={formik.touched.fuel_stops && formik.errors.fuel_stops}
                />
              </Grid>

              {/* 🎯 Submit Button */}
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<Send />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Submit Trip"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>

      {/* ✅ Success Snackbar */}
      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Trip successfully created! Redirecting...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TripFormPage;
