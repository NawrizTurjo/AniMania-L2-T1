import React from "react";
import { motion } from "framer-motion/dist/framer-motion";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <h1>About Us</h1>
    </motion.div>
  );
}
