import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Menu, MenuItem, Divider } from "@mui/material";
import { DarkMode, LightMode, Menu as MenuIcon, Logout, AccountCircle } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { motion } from "framer-motion";

const Navbar = ({ darkMode, setDarkMode }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth); // Get user from Redux state

  const open = Boolean(anchorEl);

  useEffect(() => {
    console.log("User State Updated:", user);
  }, [user]); // Debugging: Log when the user state updates

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
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
          {user ? (
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
            </>
          ) : null}
        </Box>

        {/* 🌙 Dark Mode Toggle */}
        <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* 👤 Show Profile Menu if Logged In, Else Show Login Button */}
        {user ? (
          <>
            <IconButton color="inherit" onClick={handleMenuClick}>
              <AccountCircle />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/login">Login</Button>
        )}

        {/* 📱 Mobile Menu */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton color="inherit" onClick={handleMenuClick}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => navigate("/")}>Home</MenuItem>
            {user ? (
              <>
                <MenuItem onClick={() => navigate("/dashboard")}>Dashboard</MenuItem>
                <MenuItem onClick={() => navigate("/logs")}>Logs</MenuItem>
                <MenuItem onClick={() => navigate("/trip/new")}>New Trip</MenuItem>
                <MenuItem onClick={() => navigate("/compliance")}>Compliance</MenuItem>
                <MenuItem onClick={() => navigate("/trucks")}>Trucks</MenuItem>
                <MenuItem onClick={() => navigate("/drivers")}>Drivers</MenuItem>
                {user.role === "admin" && <MenuItem onClick={() => navigate("/admin")}>Admin Panel</MenuItem>}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
