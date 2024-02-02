import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Paper, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { uploadImage } from "./userDashboard";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function ModeratorDash() {
  let [newUsername, setNewUsername] = useState("");
  let [added_series, setAddedSeries] = useState("");
  let [deleted_series, setDeletedSeries] = useState("");
  let [added_episodes, setAddedEpisodes] = useState("");
  let [deleted_episodes, setDeletedEpisodes] = useState("");
  let [review_verifications, setReviewVerifications] = useState("");
  let [filtered_comments, setFileteredComments] = useState("");
  let [loading, setLoading] = useState(true);
  let location = useLocation();
  let state = location.state;

  let [user, setUser] = useState("");
  let [img_url, setImgUrl] = useState("");
  let [stat, setStat] = useState(false);
  const [updatedId, setUpdatedId] = useState(0);

  let [pendingReviews, setPendingReviews] = useState([]);

  user = state && state.user;
  let email = state && state.email;

  let [person, setPerson] = useState({
    name: "",
    added_episodes: 0,
    added_series: 0,
    deleted_episodes: 0,
    deleted_series: 0,
    filtered_comments: 0,
    review_verifications: 0,
    role: "",
  });

  let getPerson = async () => {
    try {
      setLoading(true);
      let response = await axios.post(
        `http://localhost:3000/moderatorDash`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      let personData = response.data[0];

      person = {
        name: personData?.name || "",
        added_series: personData?.added_series || 0,
        deleted_series: personData?.deleted_series || 0,
        added_episodes: personData?.added_episodes || 0,
        deleted_episodes: personData?.deleted_episodes || 0,
        review_verifications: personData?.review_verifications || 0,
        filtered_comments: personData?.filtered_comments || 0,
        img_url: personData?.img_url || "",
      };

      setPerson(personData);

      setNewUsername(person.name);
      setAddedSeries(person.added_series);
      setDeletedSeries(person.deleted_series);
      setAddedEpisodes(person.added_episodes);
      setDeletedEpisodes(person.deleted_episodes);
      setReviewVerifications(person.review_verifications);
      setFileteredComments(person.filtered_comments);
      setImgUrl(person.img_url);
      setLoading(false);
      setStat((prev) => !prev);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getPerson();
  }, [user]);

  let handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.put(
        `http://localhost:3000/moderatorDash`,
        JSON.stringify({ newUsername, img_url, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      let name = response.data[0].user_name;
      setUser(name);
      localStorage.setItem("user", name);
      localStorage.setItem("img_url", img_url);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleImageChange = async (event) => {
    if (event.target.files[0]) {
      try {
        const imageUrl = await uploadImage(event.target.files[0]);
        setImgUrl(imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/review/approve`,
        JSON.stringify({ updatedId, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setStat((prev) => !prev);
      setUpdatedId(0);
    } catch (error) {
      console.error("Error Updating review");
    }
  };

  const getReviews = async (event) => {
    try {
      // event.preventDefault();
      let response = await axios.get(`http://localhost:3000/moderator/reviews`);
      // console.log(response.data);
      // setTimeout(()=>{

      // },500);
      setPendingReviews(response.data);
      console.log(pendingReviews);
    } catch (error) {
      console.error("Error fetching Reviews");
    }
  };

  useEffect(() => {
    getReviews();
  }, [stat]);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginTop: "20px",
            }}
          >
            <Avatar
              src={img_url}
              sx={{ width: 120, height: 120, marginBottom: "8px" }}
            />
            <input type="file" onChange={handleImageChange} />
            <Button
              variant="contained"
              disableElevation
              onClick={handleUpdate}
              size="small"
              startIcon={<CloudUploadIcon />}
              style={{ marginTop: "8px" }}
            >
              Update Image
            </Button>
            <div
              style={{
                border: "0.5px solid #cccccc",
                width: "400px",
                height: "500px",
                marginTop: "10px",
                marginRight: "auto",
                overflow: "auto",
              }}
            >
              {/* Content of the box */}
            </div>
            <div
              style={{
                position: "absolute",
                right: "0",
                bottom: "0",
                marginBottom: "-80px",
                marginRight: "1215px",
              }}
            >
              <Button variant="contained" color="primary">
                Filter Comment
              </Button>
            </div>
          </div>

          {/* First Vertical Line */}
          <div
            style={{
              borderLeft: "0.5px solid #cccccc",
              height: "800px",
              margin: "10px",
            }}
          ></div>

          {/* Box on the left of the first vertical line */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginTop: "20px",
            }}
          >
            <h1 style={{ textAlign: "center", marginTop: 0 }}>
              Welcome to the Moderator Dashboard
            </h1>
            {/* Rest of your code */}
            {/* {email && <p><strong>Email:</strong> {email}</p>} */}
            <form>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>Name:</strong>
                  <input
                    id="newUsername"
                    type="text"
                    name="newUsername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    style={{ border: "0.5px solid #cccccc", marginLeft: "8px" }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleUpdate}
                  size="small"
                >
                  Update Username
                </Button>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>E-mail:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {email}
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>Anime Added:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {person.added_series}
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>Anime Deleted:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {deleted_series}
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>Episodes Added:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {added_episodes}
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>Episodes Deleted:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {deleted_episodes}
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "70px" }}>
                <label>
                  <strong>Comments Filtered:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {filtered_comments}
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>Review Verified:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {review_verifications}
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>Karma:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {review_verifications * 2 +
                      filtered_comments +
                      added_episodes * 3 -
                      deleted_episodes * 2 +
                      added_series * 5 -
                      deleted_series * 4}
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <Button variant="contained" color="success" href="/home">
                  Edit and delete anime
                </Button>
              </div>
            </form>
          </div>

          {/* Second Vertical Line */}
          <div
            style={{
              borderLeft: "0.5px solid #cccccc",
              height: "800px",
              margin: "10px",
            }}
          ></div>

          {/* Box below the Update Profile button */}
          <div
            style={{
              border: "0.5px solid #cccccc",
              width: "600px",
              height: "500px",
              marginTop: "225px",
              marginLeft: "auto",
              overflow: "auto",
            }}
          >
            {/* Content of the box */}
          </div>

          {/* Button in the bottom right corner */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              right: "0",
              bottom: "0",
              marginBottom: "-80px",
              marginRight: "315px",
            }}
          >
            <Button variant="contained" color="primary">
              Approve Review
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
