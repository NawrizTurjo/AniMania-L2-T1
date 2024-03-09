import React, { useEffect, useState } from "react";
import "./aboutPage.css";

import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import { FaInstagram, FaReddit } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

export default function AboutPage({ setProgress }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(firstName, lastName, email, subject, message);

    // Display a loading toast
    const loadingToast = toast.loading("Submitting your message...", {
      duration: 2000,
      style: {
        border: "1px solid #2bffd1",
        padding: "16px",
        color: "#2bffd1",
        background: "#333",
      },
      iconTheme: {
        primary: "#2bffd1",
        secondary: "#FFFAEE",
      },
    });

    try {
      // Simulate form submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (
        firstName === "" ||
        lastName === "" ||
        email === "" ||
        subject === "" ||
        message === ""
      ) {
        // Dismiss loading toast
        toast.dismiss(loadingToast);

        // Display error toast
        toast.error("Please fill all the fields.", {
          style: {
            border: "1px solid #713200",
            padding: "16px",
            color: "#fc5656",
            background: "#333",
          },
          iconTheme: {
            primary: "#fc5656",
            secondary: "#FFFAEE",
          },
        });
        return;
      }

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Display success toast
      toast.success(
        "Thank you for contacting us. We will get back to you soon.",
        {
          style: {
            border: "1px solid #42fc4b",
            padding: "16px",
            color: "#20ff08",
            background: "#333",
          },
          iconTheme: {
            primary: "#008207",
            secondary: "#FFFAEE",
          },
        }
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Add class to body when component mounts
    setProgress(10);
    document.body.classList.add("about-us-page");
    setTimeout(() => {
      setProgress(100);
    }, 500);
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
      <Toaster position="bottom-left" reverseOrder={false} />
      <form className="contact-container">
        <h1>Contact Us</h1>
        <div className="about-input">
          <div className="input-name">
            <input
              type="text"
              className="first-name"
              name="fName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="last-name"
              name="lName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="input-email">
            <input
              type="email"
              className="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-subject">
            <input
              type="text"
              className="subject"
              name="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="input-message">
            <input
              type="text"
              className="message"
              name="message"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <div className="action-btn">
          <button className="btn btn-submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div className="or-text">Or contact us on social media</div>
        <div className="social-contact">
          <div className="social">
            <div className="handle">Nawriz Ahmed Turjo</div>
            <div className="social-action">
              {/* <span>Instagram</span> */}
              <a
                href="https://www.reddit.com/user/Turjo_Nawriz03/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FaReddit size="2em" />
              </a>
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
                href="https://www.reddit.com/your_username/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FaReddit size="2em" />
              </a>
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
