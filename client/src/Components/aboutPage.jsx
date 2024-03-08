import React, { useEffect } from "react";
import "./aboutPage.css";

import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import { FaInstagram } from "react-icons/fa";

export default function AboutPage() {
  useEffect(() => {
    // Add class to body when component mounts
    document.body.classList.add("about-us-page");
    return () => {
      // Remove class from body when component unmounts
      document.body.classList.remove("about-us-page");
    };
  }, []);
  return (
    <div className="about-page-container">
      {/* <nav className="header">
        <div className="app-logo">
          <h1>Logo</h1>
        </div>
        <div className="nav-actions">
          <ul className="nav-links">
            <li className="nav-link">
              <a href="/">Shop</a>
            </li>
            <li className="nav-link">
              <a href="/">Sell</a>
            </li>
            <li className="nav-link">
              <a href="/">Events</a>
            </li>
            <li className="nav-link">
              <a href="/">Learn</a>
            </li>
          </ul>
          <div className="nav-buttons">
            <button className="btn btn-sign-in">Sign In</button>
            <button className="btn btn-sign-up">Sign Up</button>
          </div>
        </div>
      </nav> */}
      <form className="contact-container">
        <h1>Contact Us</h1>
        <div className="about-input">
          <div className="input-name">
            <input
              type="text"
              className="first-name"
              name="fName"
              placeholder="First Name"
            />
            <input
              type="text"
              className="last-name"
              name="lName"
              placeholder="Last Name"
            />
          </div>
          <div className="input-email">
            <input
              type="email"
              className="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="input-subject">
            <input
              type="text"
              className="subject"
              name="subject"
              placeholder="Subject"
            />
          </div>
          <div className="input-message">
            <input
              type="text"
              className="message"
              name="message"
              placeholder="Message"
            />
          </div>
        </div>
        <div className="action-btn">
          <button className="btn btn-submit">Submit</button>
        </div>
        <div className="or-text">Or contact us on social media</div>
        <div className="social-contact">
          <div className="social">
            <div className="handle">Nawriz Ahmed Turjo</div>
            <div className="social-action">
              {/* <span>Instagram</span> */}
              <a
                href="https://www.instagram.com/turjo_nawriz/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FaInstagram size="2em" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100077699439382"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FacebookTwoToneIcon style={{ fontSize: "2em" }} />
              </a>
              {/* <span className="material-symbols-rounded">arrow_right_alt</span> */}
            </div>
          </div>
          <div className="social">
            <div className="handle">Shams Hossain Simanto</div>
            <div className="social-action">
              {/* <span>Twitter</span> */}
              <a
                href="https://www.instagram.com/shimanto__hossain"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FaInstagram size="2em" />
              </a>
              <a
                href="https://www.facebook.com/Shams.Hossain.Simanto"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FacebookTwoToneIcon style={{ fontSize: "2em" }} />
              </a>
              {/* <span className="material-symbols-rounded">arrow_right_alt</span> */}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
