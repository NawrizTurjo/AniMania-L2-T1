import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button } from "@mui/material";
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

  user = state && state.user;
  let email = state && state.email;

  let [person, setPerson] = useState({
    // user: "",
    added_episodes: 0,
    added_series: 0,
    deleted_episodes: 0,
    deleted_series: 0,
    filtered_comments: 0,
    name: "",
    review_verifications: 0,
    role: "",
  });

  //   let a = 4;
  let getPerson = async () => {
    // e.preventDefault();
    try {
      setLoading(true);
      console.log(email);
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
        // user: personData?.user_name || "",
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

      // a = person.added_series;
      // console.log(person);
      // console.log(person.added_series);
      // console.log(response.data);
      setNewUsername(person.name);

      setAddedSeries(person.added_series);
      setDeletedSeries(person.deleted_series);
      setAddedEpisodes(person.added_episodes);
      setDeletedEpisodes(person.deleted_episodes);
      setReviewVerifications(person.review_verifications);
      setFileteredComments(person.filtered_comments);
      setImgUrl(person.img_url);
      console.log(person);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getPerson();
    // setNewUsername(person.name);
  }, [user]);
  useEffect(() => {
    setUser(newUsername);
    console.log(user);
  }, [newUsername]);

  if (email == "") {
    return (
      <div>
        <h1>You are not logged in</h1>
      </div>
    );
  }

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
      console.log(response.data);
      let name = response.data[0].user_name;
      console.log(name);
      setUser(name);
      localStorage.setItem("user", name);
      localStorage.setItem("img_url", img_url);
      console.log(name);
      console.log(img_url);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleImageChange = async (event) => {
    if (event.target.files[0]) {
      // setSelectedFile(event.target.files[0]);
      try {
        const imageUrl = await uploadImage(event.target.files[0]);
        console.log("Uploaded image URL:", imageUrl);
        setImgUrl(imageUrl);
        // localStorage.setItem("img_url", imageUrl);
        console.log("img_url", img_url);
        console.log("img_url", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

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
    <div>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <h1>Welcome to the Moderator Dashboard</h1>
          {email && <p>Email: {email}</p>}
          <form>
            <div className="mb-4">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
              >
                <Avatar
                  className="mb-2"
                  src={img_url}
                  sx={{ width: 150, height: 150 }}
                />
                <Box marginBottom={2}>
                  <input type="file" onChange={handleImageChange} />
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={handleUpdate}
                    size="small"
                    startIcon={<CloudUploadIcon />}
                    // href="/home"
                  >
                    Update Image
                  </Button>
                  {/* <Button
                    component="label"
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleUpdate}
                  >
                    Update Image
                    <VisuallyHiddenInput
                      type="file"
                      onChange={(event) => {
                        handleImageChange(event).then(() => handleUpdate());
                      }}
                    />
                  </Button> */}
                </Box>
              </Box>
            </div>
            <div>
              <label>
                Name
                <input
                  id="newUsername"
                  type="text"
                  name="newUsername"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </label>
              <Button
                variant="contained"
                disableElevation
                onClick={handleUpdate}
                size="small"
                // href="/home"
              >
                Update Username
              </Button>
            </div>
            <div>
              <label>
                E-mail
                <input type="text" name="email" value={email} readOnly />
              </label>
            </div>
            <div>
              <label>
                Anime Added
                <input
                  type="text"
                  name="added_series"
                  value={person.added_series}
                  readOnly
                />
              </label>
            </div>
            <div>
              <label>
                Anime Deleted
                <input
                  type="text"
                  name="deleted_series"
                  value={deleted_series}
                  readOnly
                />
              </label>
            </div>
            <div>
              <label>
                Episodes Added
                <input
                  type="text"
                  name="added_episodes"
                  value={added_episodes}
                  readOnly
                />
              </label>
            </div>
            <div>
              <label>
                Episodes Deleted
                <input
                  type="text"
                  name="deleted_episodes"
                  value={deleted_episodes}
                  readOnly
                />
              </label>
            </div>
            <div>
              <label>
                Comments Filtered
                <input
                  type="text"
                  name="filtered_comments"
                  value={filtered_comments}
                  readOnly
                />
              </label>
            </div>
            <div>
              <label>
                Review Verified
                <input
                  type="text"
                  name="review_verifications"
                  value={review_verifications}
                  readOnly
                />
              </label>
            </div>
            <div>
              <label>
                <Button variant="contained" color="success" href="/home">
                  Edit and delete anime
                </Button>
              </label>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
