import "./adminloginCom.css";
import React from "react";
import { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion/dist/framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const LOGIN_URL = "/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [answer, setAnswer] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user === "" || pwd === "" || answer === "") {
      setErrMsg("Please fill all the fields");
      return;
    }

    if (user === "admin" && pwd === "admin" && answer === "admin") {
      setAuth(true);
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
      localStorage.setItem("admin", true);
      localStorage.setItem("email", "");
      localStorage.setItem("user", "");
      localStorage.setItem("karma", 0);
      localStorage.setItem("contribution", 0);
      localStorage.setItem("userRole", "");
      setSuccess(true);
    }
  };

  const handleAdminLogout = () => {
    localStorage.setItem("admin", false);
    setAuth(false);
    navigate("/");
  };

  useEffect(() => {
    // Add class to body when component mounts
    document.body.classList.add("admin-login-page");
    return () => {
      // Remove class from body when component unmounts
      document.body.classList.remove("admin-login-page");
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { ease: "easeOut", duration: 2 } }}
      exit={{ opacity: 0 }}
    >
      <div className="admin-login-container ">
        <div className="wrapper login-body">
          {success ? (
            <section>
              <h1>You are logged in as Admin!</h1>
              <ToastContainer />
            </section>
          ) : (
            <section>
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <h1>Admin Login</h1>
              <form onSubmit={handleSubmit}>
                {/* <label htmlFor="username">E-mail:</label> */}
                <div className="input-box">
                  <input
                    type="text"
                    id="email"
                    placeholder="Email"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                  />
                  <i className="bx bxs-user"></i>
                </div>
                {/* <br /> */}

                {/* <label htmlFor="password">Enter Password:</label> */}
                <div className="input-box">
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                  />
                  <i className="bx bxs-user"></i>
                </div>

                <div className="input-box">
                  <input
                    type="text"
                    id="question"
                    placeholder="Your Answer"
                    onChange={(e) => setAnswer(e.target.value)}
                    value={answer}
                    required
                  />
                  <i className="bx bxs-user"></i>
                </div>
                {/* <div className="remember-forgot">
                  <label>
                    <input type="checkbox" />
                    Remember Me
                  </label>
                  <a href="#">Forgot Password</a>
                </div> */}
                <button type="submit" className="btn">
                  Sign In
                </button>
              </form>
              {/* <div className="register-link">
                <p>
                  Need an Account?
                  <Link to="/sign_up">Sign Up</Link>
                </p>
              </div> */}
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminLogin;
