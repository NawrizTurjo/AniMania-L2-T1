import React, { Component } from "react";
import { motion } from "framer-motion/dist/framer-motion";

export default class Season extends Component {
  render() {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <h1>Season</h1>
      </motion.div>
    );
  }
}
