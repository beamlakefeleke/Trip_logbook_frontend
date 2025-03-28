import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Menu, MenuItem, Divider } from "@mui/material";
import { DarkMode, LightMode, Menu as MenuIcon, Logout } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { motion } from "framer-motion";

const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    console.log("Stored User:", user);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Invalid JSON in localStorage:", error);
    return null;
  }
};

const Navbar = ({ darkMode, setDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user); // Redux state user

  const [user, setUser] = useState(getStoredUser()); // Local state

  useEffect(() => {
    console.log("Redux User Updated:", reduxUser);
    setUser(getStoredUser()); // Sync user state with localStorage changes
  }, [reduxUser]); // Run when Redux state changes

  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user"); // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null); // Update local state
    navigate("/login");
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "primary.main", boxShadow: 3 }}>
      <Toolbar>
        {/* 🚛 Brand Logo */}
        <Typography
          component={motion.div}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          🚛 Trip Logbook
        </Typography>

        {/* 🌐 Desktop Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          
          {user && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={Link} to="/logs">Logs</Button>
              <Button color="inherit" component={Link} to="/trip/new">New Trip</Button>
              <Button color="inherit" component={Link} to="/compliance">Compliance</Button>
              <Button color="inherit" component={Link} to="/trucks">Trucks</Button>
              <Button color="inherit" component={Link} to="/drivers">Drivers</Button>
              {user.role === "admin" && (
                <Button color="inherit" component={Link} to="/admin">Admin Panel</Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> 
              </Button>
            </>
          )}
        </Box>

        {/* 🌙 Dark Mode Toggle */}
        <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* 📱 Mobile Menu */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {[
              <MenuItem key="home" onClick={() => navigate("/")}>Home</MenuItem>,
              user ? (
                [
                  <MenuItem key="dashboard" onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>,
                  <MenuItem key="logs" onClick={() => navigate("/logs")}>Logs</MenuItem>,
                  <MenuItem key="newTrip" onClick={() => navigate("/trip/new")}>New Trip</MenuItem>,
                  <MenuItem key="compliance" onClick={() => navigate("/compliance")}>Compliance</MenuItem>,
                  <MenuItem key="trucks" onClick={() => navigate("/trucks")}>Trucks</MenuItem>,
                  <MenuItem key="drivers" onClick={() => navigate("/drivers")}>Drivers</MenuItem>,
                  user.role === "admin" && <MenuItem key="admin" onClick={() => navigate("/admin")}>Admin Panel</MenuItem>,
                  <Divider key="mobile-divider" />,
                  <MenuItem key="mobile-logout" onClick={handleLogout}>
                    <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
                  </MenuItem>,
                ]
              ) : (
                <MenuItem key="login" onClick={() => navigate("/login")}>Login</MenuItem>
              ),
            ]}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
