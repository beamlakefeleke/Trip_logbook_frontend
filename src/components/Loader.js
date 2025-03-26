import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

const Loader = ({ text = "Loading..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.4 } }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress size={80} thickness={4} color="primary" />

        <Typography
          variant="h6"
          mt={2}
          fontWeight="bold"
          sx={{ color: "primary.main" }}
        >
          {text}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default Loader;
