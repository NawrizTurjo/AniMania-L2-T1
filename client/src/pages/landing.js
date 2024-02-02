import React, { useEffect } from "react";
import { CustomLink } from "../navbar";
export default function Landing({ setProgress }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
//   useEffect(() => {
//     setProgress(80);
//     setTimeout(() => {
//       setProgress(100);
//     }, 1000);
//   }, []);

useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        setProgress(progress);
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 10);

    // return () => clearInterval(interval);
}, [setProgress]);

  return (
    <div>
      <CustomLink to="/sign_up">sign_up</CustomLink>
      <CustomLink to="/login">login</CustomLink>
    </div>
  );
}
