import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLogs } from "../redux/slices/logSlice";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  IconButton,
} from "@mui/material";
import { Search, AccessTime, Timer } from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// 🎨 Register ChartJS Components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// 🎬 Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const LogSheetPage = () => {
  const dispatch = useDispatch();
  const { logs, loading } = useSelector((state) => state.logs);
  const [search, setSearch] = useState("");

  // 🏁 Fetch Data on Mount
  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  // 📊 Chart Data
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

  // 🔎 Filter Logs
  const filteredLogs = logs.filter((log) =>
    log.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
          <AccessTime sx={{ mr: 1, fontSize: 35, color: "#1976d2" }} />
          Log Sheet Overview
        </Typography>
      </motion.div>

      {/* 🔍 Search Bar */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
        <Paper sx={{ display: "flex", alignItems: "center", p: 2, mt: 3, boxShadow: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search logs by status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IconButton>
            <Search />
          </IconButton>
        </Paper>
      </motion.div>

      {/* 📋 Log Entries Table */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}>
        {loading ? (
          <CircularProgress size={50} sx={{ mt: 5, display: "block", mx: "auto" }} />
        ) : (
          <TableContainer component={Paper} sx={{ mt: 4, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Driver</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Start Time</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>End Time</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Duration (hrs)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.driver.username}</TableCell>
                      <TableCell>{log.status}</TableCell>
                      <TableCell>{new Date(log.time_started).toLocaleString()}</TableCell>
                      <TableCell>{new Date(log.time_ended).toLocaleString()}</TableCell>
                      <TableCell>{log.duration}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </motion.div>

      {/* 📊 Driving Hours Chart */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.6 }}>
        <Typography variant="h5" sx={{ mt: 5, fontWeight: "bold", color: "#1976d2" }}>
          <Timer sx={{ mr: 1 }} />
          Driving Hours Over Time
        </Typography>
        <Paper sx={{ mt: 2, p: 3, boxShadow: 3 }}>
          <Line data={chartData} />
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LogSheetPage;
