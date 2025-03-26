import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import TripFormPage from "./pages/TripFormPage";
import LogSheetPage from "./pages/LogSheetPage";
import CompliancePage from "./pages/CompliancePage";
import AdminPage from "./pages/AdminPage";
import LoginForm from "./pages/LoginPage";
import RegisterForm from "./pages/RegisterForm";
import PrivateRoute from "./routes/PrivateRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage"; // 🚨 Add this page!

// 🌗 Theme Toggle Support
const lightTheme = createTheme({
  palette: { mode: "light", primary: { main: "#1976d2" } },
});
const darkTheme = createTheme({
  palette: { mode: "dark", primary: { main: "#90caf9" } },
});

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
            exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Protected Routes */}
              <Route element={<PrivateRoute allowedRoles={["driver", "admin"]} />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/compliance" element={<CompliancePage />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={["driver"]} />}>
                <Route path="/trip/new" element={<TripFormPage />} />
                <Route path="/logs" element={<LogSheetPage />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Routes>
          </motion.div>
        </AnimatePresence>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
