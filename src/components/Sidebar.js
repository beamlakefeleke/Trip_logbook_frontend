import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard,
  Commute,
  History,
  Gavel,
  AdminPanelSettings,
  Logout,
  Menu as MenuIcon,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const Sidebar = ({ darkMode, setDarkMode }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isSmallScreen = useMediaQuery("(max-width: 900px)");

  // Auto-collapse sidebar on small screens
  React.useEffect(() => {
    if (isSmallScreen) setOpen(false);
  }, [isSmallScreen]);

  // Toggle Sidebar
  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Logout Confirmation
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/login");
      }
    });
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <IconButton color="inherit" onClick={toggleSidebar} sx={{ position: "absolute", top: 15, left: 15 }}>
        <MenuIcon fontSize="large" />
      </IconButton>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? 240 : 70,
          transition: "width 0.3s ease-in-out",
          bgcolor: "primary.main",
          height: "100vh",
          color: "#fff",
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            width: open ? 240 : 70,
            height: "100vh",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Sidebar Header */}
          <Box sx={{ textAlign: "center", p: 2 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1 }}>
              🚛
            </motion.div>
            {open && <h3>Trip Logbook</h3>}
          </Box>
          <Divider />

          {/* Sidebar Menu Items */}
          <List>
            {[
              { title: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
              { title: "Trips", icon: <Commute />, path: "/trips" },
              { title: "Logs", icon: <History />, path: "/logs" },
              { title: "Compliance", icon: <Gavel />, path: "/compliance" },
            ].map((item, index) => (
              <Tooltip key={index} title={item.title} placement="right" arrow>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <ListItem button component={Link} to={item.path}>
                    <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                    {open && <ListItemText primary={item.title} />}
                  </ListItem>
                </motion.div>
              </Tooltip>
            ))}

            {user?.role === "admin" && (
              <Tooltip title="Admin Panel" placement="right" arrow>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <ListItem button component={Link} to="/admin">
                    <ListItemIcon sx={{ color: "#fff" }}>
                      <AdminPanelSettings />
                    </ListItemIcon>
                    {open && <ListItemText primary="Admin Panel" />}
                  </ListItem>
                </motion.div>
              </Tooltip>
            )}
          </List>

          <Divider />

          {/* Sidebar Footer */}
          <List sx={{ width: "100%" }}>
            <Tooltip title="Toggle Dark Mode" placement="right" arrow>
              <motion.div whileHover={{ scale: 1.1 }}>
                <ListItem button onClick={() => setDarkMode(!darkMode)}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    {darkMode ? <LightMode /> : <DarkMode />}
                  </ListItemIcon>
                  {open && <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />}
                </ListItem>
              </motion.div>
            </Tooltip>

            <Tooltip title="Logout" placement="right" arrow>
              <motion.div whileHover={{ scale: 1.1 }}>
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon sx={{ color: "#fff" }}>
                    <Logout />
                  </ListItemIcon>
                  {open && <ListItemText primary="Logout" />}
                </ListItem>
              </motion.div>
            </Tooltip>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
