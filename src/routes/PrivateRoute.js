import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { refreshToken } from "../redux/slices/authSlice";
import Loader from "../components/Loader";

/**
 * 🔐 PrivateRoute - Restricts access to authenticated users.
 * ✅ Redirects unauthenticated users to login
 * ✅ Supports role-based access control
 * ✅ Auto-refreshes expired tokens
 */
const PrivateRoute = ({ allowedRoles }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // ✅ Get auth data from LocalStorage
  const accessToken = localStorage.getItem("access_token");
  const refreshTokenValue = localStorage.getItem("refresh_token");

  const getStoredUser = () => {
    try {
      const user = localStorage.getItem("user");
      console.log("user stored", user);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Invalid JSON in localStorage:", error);
      return null;
    }
  };

  const storedUser = getStoredUser();

  // 🔄 Auto refresh token if accessToken is missing but refreshToken exists
  useEffect(() => {
    const verifyToken = async () => {
      if (!accessToken && refreshTokenValue) {
        await dispatch(refreshToken());
      }
      setLoading(false);
    };
    verifyToken();
  }, [accessToken, refreshTokenValue, dispatch]);

  // ⏳ Show loader while checking authentication
  if (loading) return <Loader />;

  // ❌ Not logged in - Redirect to login
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🔄 Role-based access control
  if (!storedUser || (allowedRoles && !allowedRoles.includes(storedUser.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Render protected content
  return <Outlet />;
};

export default PrivateRoute;
