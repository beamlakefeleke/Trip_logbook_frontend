import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTrips } from "../redux/slices/tripSlice";
import { fetchLogs } from "../redux/slices/logSlice";
import { fetchUsers } from "../redux/slices/authSlice";
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
import { AdminPanelSettings, DirectionsCar, ListAlt } from "@mui/icons-material";

// 🎨 Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AdminPage = () => {
  const dispatch = useDispatch();

  // 📌 Selectors for Redux State
  const { users=[], loading: usersLoading } = useSelector((state) => state.auth);
  const { trips=[], loading: tripsLoading } = useSelector((state) => state.trips);
  const { logs=[], loading: logsLoading } = useSelector((state) => state.logs);

  // 🏁 Fetch Data on Mount
  useEffect(() => {
    dispatch(fetchTrips());
    dispatch(fetchLogs());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
          <AdminPanelSettings sx={{ mr: 1, fontSize: 35, color: "#1976d2" }} />
          Admin Dashboard
        </Typography>
      </motion.div>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* 📌 User Statistics Card */}
        <Grid item xs={12} md={4}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card sx={{ boxShadow: 3, borderLeft: "5px solid #1976d2" }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Users
                </Typography>
                {usersLoading ? (
                  <CircularProgress size={30} />
                ) : (
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    {users.length}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* 📌 Trip Statistics Card */}
        <Grid item xs={12} md={4}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card sx={{ boxShadow: 3, borderLeft: "5px solid #28a745" }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Trips
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

        {/* 📌 Log Statistics Card */}
        <Grid item xs={12} md={4}>
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card sx={{ boxShadow: 3, borderLeft: "5px solid #dc3545" }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Log Entries
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
      </Grid>

      {/* 📋 User Table */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
        <Typography variant="h5" sx={{ mt: 5, fontWeight: "bold", color: "#1976d2" }}>
          <ListAlt sx={{ mr: 1 }} />
          Registered Users
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2", color: "white" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Username</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      {/* 📋 Trip Table */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.3 }}>
        <Typography variant="h5" sx={{ mt: 5, fontWeight: "bold", color: "#28a745" }}>
          <DirectionsCar sx={{ mr: 1 }} />
          Active Trips
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#28a745", color: "white" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Driver</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Pickup</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Dropoff</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell>{trip.id}</TableCell>
                  <TableCell>{trip.driver.username}</TableCell>
                  <TableCell>{trip.status}</TableCell>
                  <TableCell>{trip.pickup_location}</TableCell>
                  <TableCell>{trip.dropoff_location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </Container>
  );
};

export default AdminPage;
