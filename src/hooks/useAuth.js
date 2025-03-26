// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loginSuccess, logout } from "../redux/authSlice";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import axios from "axios";

// /**
//  * Custom Hook: useAuth
//  * Manages user authentication state, token validation, role-based access, and logout handling.
//  */
// const useAuth = () => {
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, token } = useSelector((state) => state.auth);

//   useEffect(() => {
//     // Auto-login using stored JWT token from cookies
//     const storedToken = Cookies.get("jwt_token");

//     if (storedToken && !user) {
//       axios
//         .get("/api/auth/user/", {
//           headers: { Authorization: `Bearer ${storedToken}` },
//         })
//         .then((response) => {
//           dispatch(loginSuccess({ user: response.data, token: storedToken }));
//         })
//         .catch((error) => {
//           console.error("Token validation failed:", error);
//           handleLogout();
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [dispatch, user]);

//   // Function to check user role
//   const isAdmin = () => user?.role === "admin";
//   const isDriver = () => user?.role === "driver";

//   // Logout function
//   const handleLogout = () => {
//     Cookies.remove("jwt_token");
//     dispatch(logout());
//     navigate("/login");
//   };

//   return { user, token, isAdmin, isDriver, loading, handleLogout };
// };

// export default useAuth;
