import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock } from "react-icons/fi";
import Loader from "../components/Loader";


/**
 * 🔐 LoginForm - Secure & Animated Login Component
 * ✅ Handles user authentication via Redux
 * ✅ Displays errors & validation messages
 * ✅ Smooth animations for enhanced UX
 */
const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, accessToken } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  // 🔄 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Validate Form Fields
  const validateForm = () => {
    let tempErrors = {};
    if (formData.username.length < 4) tempErrors.username = "Invalid username address";
    if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // 🚀 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response = await dispatch(login(formData));
    if (response.meta.requestStatus === "fulfilled") {
        // ✅ Extract tokens from `tokens` object
    const { access, refresh } = response.payload.tokens;
    
    // ✅ Store tokens & user info in localStorage
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("user", JSON.stringify({
      role: response.payload.role, // Extract role
    }));

    console.log("Login successful");
    console.log("User role:", response.payload.role);
    console.log("Access Token:", access);
      navigate("/dashboard"); // Redirect on success
    }
  };

    // 🔄 Redirect if already logged in
    useEffect(() => {
      if (accessToken || localStorage.getItem("access_token")) {
        navigate("/dashboard");
        console.log("Access Token:", localStorage.getItem("access_token"));
      }
    }, [accessToken, navigate]);

  return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-600"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
    >
      {/* Card Container */}
      <motion.div 
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
        initial={{ scale: 0.8 }} 
        animate={{ scale: 1 }} 
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Welcome Back! 👋</h2>
        
        {/* 🔥 Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* username Input */}
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="User Name"
              value={formData.username}
              onChange={handleChange}
              className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.username ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </motion.div>

          {/* Password Input */}
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            whileTap={{ scale: 0.9 }}
            disabled={loading}
          >
            {loading ? <Loader /> : "Login"}
          </motion.button>
        </form>

        {/* Additional Links */}
        <p className="text-gray-500 text-sm text-center mt-4">
          Don't have an account? <a href="/register" className="text-blue-600 font-semibold hover:underline">Sign up</a>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoginForm;
