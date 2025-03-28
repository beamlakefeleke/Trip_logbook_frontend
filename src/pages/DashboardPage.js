import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTrips } from "../redux/slices/tripSlice";
import { fetchLogs } from "../redux/slices/logSlice";
import { fetchComplianceStatus as fetchCompliance } from "../redux/slices/complianceSlice";
import { fetchDrivers } from "../redux/slices/driverSlice";
import { fetchTrucks } from "../redux/slices/truckSlice";
import { motion } from "framer-motion";
import {
  Container,
  Grid2 as Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {  History, Person, LocalShipping } from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// 🎨 Register ChartJS Components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 🎬 Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const DashboardPage = () => {
  const dispatch = useDispatch();

  // 📌 Selectors for Redux State
  const { user } = useSelector((state) => state.auth);
  const { trips, loading: tripsLoading } = useSelector((state) => state.trips);
  const { logs, loading: logsLoading } = useSelector((state) => state.logs);
  const { compliance, loading: complianceLoading } = useSelector((state) => state.compliance||{});
  // const { drivers, loading: driversLoading } = useSelector((state) => state.drivers);
  const { trucks, loading: trucksLoading } = useSelector((state) => state.trucks);

  // 🏁 Fetch Data on Mount
  useEffect(() => {
    dispatch(fetchTrips());
    dispatch(fetchLogs());
    dispatch(fetchCompliance());
    dispatch(fetchDrivers());
    dispatch(fetchTrucks());
  }, [dispatch]);

  // 📊 Chart Data for Driving Logs
  const logLabels = logs.map((log) => new Date(log.time_started).toLocaleDateString());
  const logData = logs.map((log) => log.duration);

  const chartData = {
    labels: logLabels,
    datasets: [
      {
        label: "Driving Hours",
        data: logData,
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
          <Person sx={{ mr: 1, fontSize: 35, color: "#1976d2" }} />
          Welcome, {user?.username || "Driver"}
        </Typography>
      </motion.div>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* 📌 Active Trips Card */}
        <Grid item xs={12} md={4}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card sx={{ boxShadow: 3, borderLeft: "5px solid #28a745" }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Active Trips
                </Typography>
                {tripsLoading ? (
                  <CircularProgress size={30} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#28a745" }}>
                    {trips.length}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* 📌 Log History Card */}
        <Grid item xs={12} md={4}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card sx={{ boxShadow: 3, borderLeft: "5px solid #dc3545" }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Log History
                </Typography>
                {logsLoading ? (
                  <CircularProgress size={30} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#dc3545" }}>
                    {logs.length}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* ✅ Compliance Status */}
        <Grid item xs={12} md={4}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card sx={{ boxShadow: 3, borderLeft: "5px solid #007bff" }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Compliance Status
                </Typography>
                {complianceLoading ? (
                  <CircularProgress size={30} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: compliance?.is_compliant ? "#28a745" : "#dc3545" }}>
  {compliance?.is_compliant ? "Compliant" : "Not Compliant"}
</Typography>

                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* 📋 Chart Displaying Driving Hours */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
        <Typography variant="h5" sx={{ mt: 5, fontWeight: "bold", color: "#1976d2" }}>
          <History sx={{ mr: 1 }} />
          Driving Hours Over Time
        </Typography>
        <Paper sx={{ mt: 2, p: 3, boxShadow: 3 }}>
          <Line data={chartData} />
        </Paper>
      </motion.div>

      {/* 🚛 Truck & Driver Overview */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.3 }}>
        <Typography variant="h5" sx={{ mt: 5, fontWeight: "bold", color: "#1976d2" }}>
          <LocalShipping sx={{ mr: 1 }} />
          Trucks & Drivers
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
  <Table>
    <TableHead sx={{ backgroundColor: "#1976d2", color: "white" }}>
      <TableRow>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Truck ID</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Driver</TableCell>
        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {trucksLoading ? (
        <TableRow>
          <TableCell colSpan={3} align="center">
            <CircularProgress size={30} />
          </TableCell>
        </TableRow>
      ) : (
        trucks.length > 0 ? (
          trucks.map((truck) => (
            <TableRow key={truck.id}>
              <TableCell>{truck.id}</TableCell>
              <TableCell>{truck.driver?.username || "N/A"}</TableCell>
              <TableCell>{truck.status}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} align="center">
              No trucks available.
            </TableCell>
          </TableRow>
        )
      )}
    </TableBody>
  </Table>
</TableContainer>

      </motion.div>
    </Container>
  );
};

export default DashboardPage;
