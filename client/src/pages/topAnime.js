import React, { useEffect } from "react";
import GetTopAnime from "../Components/getTopAnime";
import { motion } from "framer-motion/dist/framer-motion";

export default function TopAnime({
  forceRerender,
  toggleRerender,
  setProgress,
}) {
  // useEffect(() => {
  //   getAnime();
  // }, [forceRerender]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <GetTopAnime
        forceRerender={forceRerender}
        toggleRerender={toggleRerender}
        setProgress={setProgress}
      />
    </motion.div>
  );
}
