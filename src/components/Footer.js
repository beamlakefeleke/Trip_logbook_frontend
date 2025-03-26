import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { Facebook, Twitter, LinkedIn, GitHub } from "@mui/icons-material";

const socialLinks = [
  { icon: <Facebook />, url: "https://facebook.com" },
  { icon: <Twitter />, url: "https://twitter.com" },
  { icon: <LinkedIn />, url: "https://linkedin.com" },
  { icon: <GitHub />, url: "https://github.com" },
];

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.5 } }}
    >
      <Box
        component="footer"
        sx={{
          width: "100%",
          py: 3,
          px: 2,
          mt: "auto",
          textAlign: "center",
          backgroundColor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          🚛 Truck Logbook App
        </Typography>

        {/* Social Media Icons */}
        <Box display="flex" justifyContent="center" gap={2} mt={1}>
          {socialLinks.map(({ icon, url }, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconButton component={Link} href={url} target="_blank" sx={{ color: "white" }}>
                {icon}
              </IconButton>
            </motion.div>
          ))}
        </Box>

        {/* Footer Links */}
        <Box mt={1}>
          <Link href="/privacy" sx={{ color: "white", mx: 1 }}>
            Privacy Policy
          </Link>
          |
          <Link href="/terms" sx={{ color: "white", mx: 1 }}>
            Terms of Service
          </Link>
          |
          <Link href="/contact" sx={{ color: "white", mx: 1 }}>
            Contact Us
          </Link>
        </Box>

        <Typography variant="body2" mt={1}>
          © {new Date().getFullYear()} Truck Logbook. All rights reserved.
        </Typography>
      </Box>
    </motion.footer>
  );
};

export default Footer;
