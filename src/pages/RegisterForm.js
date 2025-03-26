import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiMail } from "react-icons/fi";
import Loader from "../components/Loader";

/**
 * 📝 RegisterForm - Secure & Animated Registration Component
 * ✅ Handles user signup via Redux
 * ✅ Displays validation errors & messages
 * ✅ Smooth animations for an engaging UX
 */
const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    username: "", // ✅ Ensure all fields have initial values
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  });
  

  const [errors, setErrors] = useState({});

  // 🔄 Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // ✅ Corrected
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Validate Form Fields
  const validateForm = () => {
    let tempErrors = {};
    if (!formData.username.trim()) tempErrors.username = "User Name is required";
    if (!formData.email.includes("@")) tempErrors.email = "Invalid email address";
    if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // 🚀 Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const response = await dispatch(register(formData));
    if (response.meta.requestStatus === "fulfilled") {
        localStorage.setItem("access_token", response.payload.access); 
        localStorage.setItem("refresh_token", response.payload.refresh);
        localStorage.setItem("user", JSON.stringify(response.payload.user));
        console.log("Registration successful");
      navigate("/dashboard"); // Redirect on success
    }
  };

  return (
    <motion.div 
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-600 to-blue-600"
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Create an Account 🚀</h2>
        
        {/* 🔥 Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
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

          {/* Email Input */}
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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

          {/* Confirm Password Input */}
          <motion.div className="relative" whileHover={{ scale: 1.05 }}>
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`pl-10 w-full px-4 py-2 border rounded-md focus:outline-none ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            whileTap={{ scale: 0.9 }}
            disabled={loading}
          >
            {loading ? <Loader /> : "Sign Up"}
          </motion.button>
        </form>

        {/* Additional Links */}
        <p className="text-gray-500 text-sm text-center mt-4">
          Already have an account? <a href="/login" className="text-green-600 font-semibold hover:underline">Log in</a>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default RegisterForm;
