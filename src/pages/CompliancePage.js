import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import { MdOutlineCheckCircle, MdErrorOutline, MdSync } from "react-icons/md";
import Loader from "../components/Loader";

/**
 * 🚛 CompliancePage - Ensures Drivers Meet 70-hour/8-day Cycle Regulations
 * ✅ Fetches real-time compliance status from backend
 * ✅ Displays warnings if driver exceeds limit
 * ✅ Beautiful animations and smooth UI
 */

const CompliancePage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔄 Fetch Compliance Status from API
  useEffect(() => {
    const fetchComplianceStatus = async () => {
      try {
        const response = await axios.get("/api/compliance/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplianceData(response.data);
      } catch (err) {
        setError("Failed to fetch compliance status. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceStatus();
  }, [token]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-green-500 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 🚚 Compliance Card */}
      <motion.div
        className="bg-white shadow-xl rounded-lg p-6 w-full max-w-2xl text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🚛 Compliance Check</h2>

        {/* 🔄 Loading State */}
        {loading && <Loader />}

        {/* ❌ Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* ✅ Compliance Data */}
        {complianceData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="text-lg text-gray-700 mb-3">
              <strong>Driver:</strong> {user?.name || "Unknown"}
            </p>
            <p className="text-lg text-gray-700 mb-3">
              <strong>Used Hours:</strong> {complianceData.hours_used} / 70 hrs
            </p>

            {/* 🚦 Compliance Status Display */}
            {complianceData.is_compliant ? (
              <motion.div
                className="flex items-center justify-center text-green-600 font-bold text-xl mt-4"
                whileHover={{ scale: 1.1 }}
              >
                <MdOutlineCheckCircle size={32} className="mr-2" />
                <span>You're compliant! ✅</span>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center justify-center text-red-600 font-bold text-xl mt-4"
                whileHover={{ scale: 1.1 }}
              >
                <MdErrorOutline size={32} className="mr-2" />
                <span>Warning: Exceeded limit! ❌</span>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 🔄 Refresh Button */}
        <motion.button
          className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
          whileTap={{ scale: 0.9 }}
          onClick={() => window.location.reload()}
        >
          <MdSync size={20} className="mr-2" />
          Refresh
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CompliancePage;
