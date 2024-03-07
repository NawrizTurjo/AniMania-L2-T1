import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "@mui/material/Button";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import IconButton from "@mui/material/IconButton";
import { uploadImage } from "./userDashboard";
import { motion } from "framer-motion/dist/framer-motion";
import "./signUpCom.css"; // Import the CSS file for SignUp
import toast, { Toaster } from "react-hot-toast";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = "/sign_up";

const SignUp = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [userRole, setUserRole] = useState(""); // State to store user role
  const [img_url, setImgUrl] = useState(""); // State to store user role

  const [selectedFile, setSelectedFile] = useState(null);
  const handleRoleChange = (role) => {
    setUserRole(role);
  };

  useEffect(() => {
    setValidEmail(/* your email validation logic here */);
  }, [email]);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
    console.log("user", user);
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
    console.log("pwd", pwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchPwd]);

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

    // Validate user input
    if (!validName || !validPwd || !validMatch || !userRole) {
      setErrMsg("Invalid Entry");
      return;
    }
    const hashedPwd = bcrypt.hashSync(pwd, 10);
    console.log("Pwd", pwd);
    console.log("img_url inside submit", img_url);

    try {
      // setPwd(hashedPwd);
      const roleToSend = userRole === 'M' ? 'M_not' : userRole;
      const response = await axios.post(
        `http://localhost:3000/sign_up`,
        JSON.stringify({ user, pwd: hashedPwd, email, userRole: roleToSend, img_url }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));

      // Set success state and clear inputs
      setSuccess(true);
      //navigate("/Home", { state: { user, email } });
      localStorage.setItem("user", user);
      localStorage.setItem("email", email);
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("img_url", img_url);
      console.log(user, email, userRole, img_url);
      if (userRole === "M") {
        const karma = await getKarma(email);
        // localStorage.setItem("karma", karma);
      } else if(userRole === "U") {
        await getContribution(email);
      }
      navigate("/Home");
      setUser("");
      setPwd("");
      setMatchPwd("");
      setEmail("");
      setUserRole("");
      setImgUrl("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        setErrMsg("Email already exists. Please choose a different email.");
      } else {
        // setErrMsg("Registration Failed");
        toast.error("Registration Failed");
      }

      // Focus on the error message
      errRef.current.focus();
    }
  };

  const handleImageChange = async (event) => {
    if (event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      try {
        const imageUrl = await uploadImage(event.target.files[0]);
        console.log("Uploaded image URL:", imageUrl);
        setImgUrl(imageUrl);
        console.log("img_url", img_url);
        console.log("img_url", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  useEffect(() => {
    // Add class to body when component mounts
    document.body.classList.add("sign-up-page");
    return () => {
      // Remove class from body when component unmounts
      document.body.classList.remove("sign-up-page");
    };
  }, []);

  // const classes = useStyles();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="sign-up-container"
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div className="wrapper sign-up-body">
        {success ? (
          <section>
            <h1>Success!</h1>
            <p>
              <Link to="/Home">Anime Page</Link>
            </p>
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
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
              {/* <label htmlFor="username">
              Username:
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !user ? "hide" : "invalid"}
              />
            </label> */}
              <div className="input-box">
                <input
                  type="text"
                  id="username"
                  placeholder="Username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  aria-invalid={validName ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <i className="bx bxs-user"></i>
              </div>
              <p
                id="uidnote"
                className={
                  userFocus && user && !validName ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                4 to 24 characters.
                <br />
                Must begin with a letter.
                <br />
                Letters, numbers, underscores, hyphens allowed.
              </p>
              {/* <label htmlFor="email">
                Email:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validEmail || !email ? "hide" : "invalid"}
                />
              </label> */}
              <div className="input-box">
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  aria-invalid={validEmail ? "false" : "true"}
                  aria-describedby="emailnote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                />
                <i className="bx bxs-envelope"></i>
              </div>
              <p
                id="emailnote"
                className={
                  emailFocus && email && !validEmail
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Enter a valid email address.
              </p>
              {/* <label htmlFor="password">
                Password:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validPwd || !pwd ? "hide" : "invalid"}
                />
              </label> */}
              <div className="input-box">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <p
                id="pwdnote"
                className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                8 to 24 characters.
                <br />
                Must include uppercase and lowercase letters, a number and a
                special character.
                <br />
                Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>{" "}
                <span aria-label="at symbol">@</span>{" "}
                <span aria-label="hashtag">#</span>{" "}
                <span aria-label="dollar sign">$</span>{" "}
                <span aria-label="percent">%</span>
              </p>
              {/* <label htmlFor="confirm_pwd">
                Confirm Password:
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validMatch && matchPwd ? "valid" : "hide"}
                />
                <FontAwesomeIcon
                  icon={faTimes}
                  className={validMatch || !matchPwd ? "hide" : "invalid"}
                />
              </label> */}
              <div className="input-box">
                <input
                  type="password"
                  id="confirm_pwd"
                  placeholder="Confirm Password"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
                <i className="bx bxs-lock-alt"></i>
              </div>
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} />
                Must match the first password input field.
              </p>
              <p>
                <label>
                  <b>Upload image</b>
                </label>

                <input type="file" onChange={handleImageChange} />
                {/* <button onClick={handleImageChange}>Submit</button> */}
                {/* <IconButton
                color="primary"
                aria-label="Upload image"
                component="label"
              >
                <FileUploadIcon>
                  <input
                    type="file"
                    hidden
                    onChange={handleImageChange}
                    accept="image/*" 
                  />
                </FileUploadIcon>
                <label>Upload image</label>
              </IconButton> */}
              </p>

              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {userRole ? `Selected Role: ${userRole}` : "Select Role"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleRoleChange("M_not")}>
                    Moderator
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleRoleChange("U")}>
                    User
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <button
                className="btn mt-5"
                type="submit"
                disabled={
                  !validName ||
                  !validPwd ||
                  !validMatch ||
                  !userRole ||
                  !img_url
                    ? true
                    : false
                }
              >
                Sign Up
              </button>
            </form>
              <div className="login-link">
              <p>Already have an account?
                <Link to="/login">Login</Link>
              </p>
              </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};

export default SignUp;
