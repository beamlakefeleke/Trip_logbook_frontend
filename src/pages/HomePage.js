import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTruck, FaClipboardList, FaEnvelope, FaGlobe, FaRoad, FaClock,
  FaTools, FaHandshake, FaChartLine
} from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import truckBg from "../assets/truck_bg.jpg"; // 🚛 Background Image

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // 🎯 Subscription Handler
  const handleSubscribe = () => {
    if (email.includes("@")) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="w-full">
      {/* 🚛 Hero Section with Full-Page Background */}
      <motion.div 
        className="h-screen flex flex-col items-center justify-center text-white relative bg-cover bg-center"
        style={{ backgroundImage: `url(${truckBg})` }}
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
      >
        <div className="text-center max-w-4xl p-8 bg-black bg-opacity-50 rounded-lg">
          <h1 className="text-5xl font-bold mb-4 tracking-wide">
            <span className="text-yellow-400">Truck Logbook</span> for Smart Drivers 🚚
          </h1>
          <p className="text-lg mb-6">
            Streamline your trips, stay compliant, and optimize fleet performance.  
            Designed for **truck drivers, fleet managers, and logistics professionals**.
          </p>

          {/* 🚀 Call to Action */}
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <motion.button 
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg text-lg flex items-center gap-2"
                whileTap={{ scale: 0.95 }}
              >
                Get Started <FiArrowRight />
              </motion.button>
            </Link>
            <Link to="/register">
              <motion.button 
                className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-lg text-lg hover:bg-gray-200"
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 🔥 Features Section (White Background) */}
      <motion.div 
        className="py-16 bg-gray-100"
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <FeatureCard icon={<FaClipboardList className="text-5xl text-blue-700 mx-auto" />} title="Log Compliance" description="Automate logs and meet DOT compliance effortlessly." />
          <FeatureCard icon={<FaTruck className="text-5xl text-yellow-500 mx-auto" />} title="Trip Insights" description="Track fuel stops, routes, and rest breaks with ease." />
          <FeatureCard icon={<FaGlobe className="text-5xl text-purple-700 mx-auto" />} title="Live GPS Tracking" description="Monitor fleet locations and get real-time updates." />
        </div>
      </motion.div>

      {/* 🚛 Additional Sections */}
      <Section title="🛣️ Smart Route Planning & Optimization" icon={<FaRoad className="text-5xl text-blue-500" />} description="Get the best routes with real-time traffic updates to save time and fuel costs." />
      <Section title="⏳ Hours of Service (HOS) Compliance" icon={<FaClock className="text-5xl text-yellow-500" />} description="Ensure you stay within legal driving limits and rest periods with automated tracking." />
      <Section title="🔧 Vehicle Maintenance & Inspection Tracking" icon={<FaTools className="text-5xl text-gray-600" />} description="Keep your fleet in top condition with scheduled maintenance reminders and inspection logs." />
      <Section title="🤝 Driver Community & Support" icon={<FaHandshake className="text-5xl text-green-500" />} description="Join a community of drivers, share experiences, and get support on regulations and best practices." />
      <Section title="📈 Business Growth & Analytics" icon={<FaChartLine className="text-5xl text-purple-600" />} description="Access detailed analytics to improve operations, cut costs, and boost efficiency." />

      {/* 📩 Newsletter Subscription */}
      <motion.div 
        className="mt-16 bg-black bg-opacity-60 p-6 rounded-lg text-center mx-8"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-white">Stay Updated</h2>
        <p className="text-sm mb-4 text-gray-300">Subscribe for new features, offers, and industry news.</p>
        <div className="flex justify-center">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="p-2 rounded-l-lg w-64 text-gray-900 focus:outline-none" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.button 
            className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-r-lg"
            whileTap={{ scale: 0.95 }}
            onClick={handleSubscribe}
          >
            Subscribe <FaEnvelope />
          </motion.button>
        </div>
        {subscribed && <p className="text-green-400 mt-2">✅ Thank you for subscribing!</p>}
      </motion.div>
    </div>
  );
};

// 📌 Feature Card Component (For Main Features)
const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="p-6 bg-white text-gray-900 rounded-lg shadow-lg transform hover:scale-105 transition"
    whileHover={{ scale: 1.05 }}
  >
    {icon}
    <h3 className="text-xl font-semibold mt-3">{title}</h3>
    <p className="text-sm mt-2">{description}</p>
  </motion.div>
);

// 📌 Section Component (For Additional Sections)
const Section = ({ title, icon, description }) => (
  <motion.div 
    className="mt-16 max-w-6xl mx-auto p-6 bg-white text-gray-900 rounded-lg shadow-lg flex items-center justify-between flex-row-reverse"
    initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.7 }}
  >
    {/* 📌 Icon (Right Side) */}
    <div className="w-1/4 flex justify-center">{icon}</div>

    {/* 📌 Text Content (Left Side) */}
    <div className="w-3/4 text-left">
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="text-sm mt-3">{description}</p>
    </div>
  </motion.div>
);

export default HomePage;
