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

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const getKarma = async (email) => {
    // e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/getKarma`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res.data);
      localStorage.setItem("karma", res.data[0].get_karma);
      console.log("Karma: ", res.data[0].get_karma);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getContribution = async (email) => {
    // e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/getContribution`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res.data);

      localStorage.setItem("contribution", res.data[0].get_contribution);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/auth`,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (!Array.isArray(response?.data) || response.data.length === 0) {
        console.log("No response");
        setErrMsg("Invalid Username or Password");
        return;
      }

      const storedHashedPwd = response?.data[0]?.password;

      const passwordMatch = bcrypt.compareSync(pwd, storedHashedPwd);

      if (passwordMatch) {
        const id = response?.data[0]?.id;
        const role = response?.data[0]?.role;
        const email = response?.data[0]?.email;
        const user = response?.data[0]?.user_name;
        const img_url = response?.data[0]?.img_url;
        setAuth({ id, user, pwd: storedHashedPwd, role, email });
        //navigate("/Home", { state: { user, email } });
        localStorage.setItem("user", user);
        localStorage.setItem("email", email);
        localStorage.setItem("userRole", role);
        localStorage.setItem("img_url", img_url);

        if (role === "M") {
          await getKarma(email);
          // localStorage.setItem("karma", karma);
        } else {
          await getContribution(email);
        }

        // Redirect to home page with user information
        setUser("");
        setPwd("");
        toast.success(`You are now logged in...`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Zoom,
        });
        setTimeout(() => {
          navigate("/Home");
        }, 2000);
        setSuccess(true);
      } else {
        setErrMsg("Invalid Username or Password");
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {success ? (
        <section>
          <h1>You are logged in!</h1>
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
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">E-mail:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />
            <br />

            <label htmlFor="password">Enter Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <br />
            <button type="submit">Sign In</button>
          </form>
          <p>
            Need an Account?
            <br />
            <span className="line">
              <Link to="/sign_up">Sign Up</Link>
            </span>
          </p>
        </section>
      )}
    </motion.div>
  );
};

export default Login;
