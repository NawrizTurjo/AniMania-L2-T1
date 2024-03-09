import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Button, Paper, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { uploadImage } from "./userDashboard";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { motion } from "framer-motion/dist/framer-motion";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

export default function ModeratorDash({ setProgress }) {
  let [newUsername, setNewUsername] = useState("");
  let [added_series, setAddedSeries] = useState("");
  let [deleted_series, setDeletedSeries] = useState("");
  let [added_episodes, setAddedEpisodes] = useState("");
  let [deleted_episodes, setDeletedEpisodes] = useState("");
  let [review_verifications, setReviewVerifications] = useState("");
  let [filtered_comments, setFileteredComments] = useState("");
  let [others, setOthers] = useState("");
  const [karma, setKarma] = useState(0);
  let [loading, setLoading] = useState(true);
  let location = useLocation();
  let state = location.state;

  let [user, setUser] = useState("");
  let [img_url, setImgUrl] = useState("");
  let [stat, setStat] = useState(false);
  const [updatedId, setUpdatedId] = useState(0);

  let [pendingReviews, setPendingReviews] = useState([]);
  let [pendingComments, setPendingComments] = useState([]);
  let [pendingChar, setPendingChar] = useState([]);

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
    others: 0,
    role: "",
  });

  let getPerson = async () => {
    setLoading(true);
    try {
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
        others: personData?.others || 0,
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
      setOthers(person.others);
      setImgUrl(person.img_url);
      setStat((prev) => !prev);
    } catch (err) {
      console.error(err.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    setProgress(10);
    getPerson();
    setTimeout(() => {
      setProgress(100);
    }, 500);
  }, []);

  // let handleUpdate = async (e) => {
  //   e.preventDefault();
  //   try {
  //     let response = await axios.put(
  //       `http://localhost:3000/moderatorDash`,
  //       JSON.stringify({ newUsername, img_url, email }),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       }
  //     );
  //     let name = response.data[0].user_name;
  //     setUser(name);
  //     localStorage.setItem("user", name);
  //     localStorage.setItem("img_url", img_url);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };

  let handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToastId = toast.loading("Saving Bio..", {
      duration: 1000, // 4 seconds
      style: {
        border: "1px solid #06bf34",
        padding: "16px",
        color: "#06bf34",
      },
      iconTheme: {
        primary: "#06bf34",
        secondary: "#FFFAEE",
      },
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatePromise = axios.put(
        `http://localhost:3000/moderatorDash`,
        JSON.stringify({ newUsername, img_url, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.dismiss(loadingToastId); // Dismiss the loading toast
      toast.success("Bio has been successfully saved.", {
        style: {
          border: "1px solid #06bf34",
          padding: "16px",
          color: "#06bf34",
        },
        iconTheme: {
          primary: "#06bf34",
          secondary: "#FFFAEE",
        },
      });
      setTimeout(() => {
        toast.dismiss();
      }, 5000);
    } catch (err) {
      console.error(err.message);
      toast.dismiss(loadingToastId); // Dismiss the loading toast on error
    }

    // toast.promise(updatePromise, {
    //   loading: "Updating...",
    //   success: (res) => {
    //     let name = res.data[0].user_name;
    //     setUser(name);
    //     localStorage.setItem("user", name);
    //     localStorage.setItem("img_url", img_url);
    //     return "Username successfully updated!";
    //   },
    //   error: "Update failed",
    // });

    // try {
    //   let response = await updatePromise;
    // } catch (err) {
    //   console.error(err.message);
    // }
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

  const getKarma = async (e) => {
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
      setKarma(res.data[0].get_karma);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleApproveReview = async (e, updatedId) => {
    e.preventDefault();
    try {
      console.log(updatedId);
      const response = await axios.put(
        `http://localhost:3000/review/approve`,
        JSON.stringify({ updatedId, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getPerson();
      setStat((prev) => !prev);
      //setUpdatedId(0);
    } catch (error) {
      console.error("Error Updating review");
    }
  };

  const handleApproveComment = async (e, updatedId) => {
    e.preventDefault();
    try {
      console.log(updatedId);
      const response = await axios.put(
        `http://localhost:3000/comment/approve`,
        JSON.stringify({ updatedId, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getPerson();
      setStat((prev) => !prev);
      //setUpdatedId(0);
    } catch (error) {
      console.error("Error Updating review");
    }
  };

  const handleApproveCharacter = async (e, char_id) => {
    e.preventDefault();
    try {
      console.log(char_id);
      const response = await axios.post(
        `http://localhost:3000/approveCharacters`,
        JSON.stringify({ char_id, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getPerson();
      setStat((prev) => !prev);
      //setUpdatedId(0);
    } catch (error) {
      console.error("Error Updating review");
    }
  };

  const handleDeclineReview = async (e, updatedId) => {
    e.preventDefault();
    try {
      console.log(updatedId);
      const response = await axios.put(
        `http://localhost:3000/review/decline`,
        JSON.stringify({ updatedId, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getPerson();
      setStat((prev) => !prev);
      //setUpdatedId(0);
    } catch (error) {
      console.error("Error Updating review");
    }
  };

  const handleDeclineComment = async (e, updatedId) => {
    e.preventDefault();
    try {
      console.log(updatedId);
      const response = await axios.put(
        `http://localhost:3000/comment/decline`,
        JSON.stringify({ updatedId, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getPerson();
      setStat((prev) => !prev);
      //setUpdatedId(0);
    } catch (error) {
      console.error("Error Updating review");
    }
  };

  const handleDeclineCharacter = async (e, updatedId) => {
    e.preventDefault();
    try {
      console.log(updatedId);
      const response = await axios.put(
        `http://localhost:3000/chardecline`,
        JSON.stringify({ updatedId, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      getPerson();
      setStat((prev) => !prev);
      //setUpdatedId(0);
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

  const getComments = async (event) => {
    try {
      // event.preventDefault();
      let response = await axios.get(
        `http://localhost:3000/moderator/comments`
      );
      // console.log(response.data);
      // setTimeout(()=>{

      // },500);
      setPendingComments(response.data);
      console.log(pendingComments);
    } catch (error) {
      console.error("Error fetching Reviews");
    }
  };

  const getChars = async (event) => {
    try {
      // event.preventDefault();
      let response = await axios.post(`http://localhost:3000/getReqCharacters`);
      // console.log(response.data);
      // setTimeout(()=>{

      // },500);
      setPendingChar(response.data);
      console.log(pendingChar);
    } catch (error) {
      console.error("Error fetching Reviews");
    }
  };

  useEffect(() => {
    getReviews();
    getChars();
  }, [stat]);

  useEffect(() => {
    getComments();
    getKarma();
  }, [stat]);

  useEffect(() => {
    console.log("loading: ", loading);
  }, [loading]);

  // useEffect(() => {
  // }, [stat]);

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

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <motion.div
      // className="d-flex flex-wrap"
      style={{ display: "flex", justifyContent: "flex-start" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <Toaster position="top-left" reverseOrder={false} />
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
              {pendingReviews.map((review, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <Typography variant="body1">
                    User Name: {review.user_name}
                  </Typography>
                  <Typography variant="body1">
                    Review Time: {review.review_time}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ wordWrap: "break-word", marginLeft: 0 }}
                  >
                    Review Text: {review.review_text}
                  </Typography>
                  <Typography variant="body1">
                    Review ID: {review.review_id}
                  </Typography>
                  <Typography variant="body1">
                    Anime Name: {review.anime_name}
                  </Typography>
                  <Typography variant="body1">
                    Rating: {review.rating}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginRight: "10px" }}
                    onClick={(e) => handleApproveReview(e, review.review_id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => handleDeclineReview(e, review.review_id)}
                  >
                    Decline
                  </Button>
                </div>
              ))}
            </div>
            {/* Pending Characters Box */}
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
              {pendingChar.map((character, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <Typography variant="body1">
                    Character ID: {character.id}
                  </Typography>
                  <Typography variant="body1">
                    Anime ID: {character.anime_id}
                  </Typography>
                  <Typography variant="body1">
                    Character Name: {character.character_name}
                  </Typography>
                  <Typography variant="body1">
                    Role: {character.role}
                  </Typography>
                  <Typography variant="body1">
                    Gender: {character.gender}
                  </Typography>
                  <Typography variant="body1">
                    Profile Picture: {character.profile_picture}
                  </Typography>
                  <Typography variant="body1">
                    User Email: {character.user_email}
                  </Typography>
                  <Typography variant="body1">
                    Request Date: {character.req_date}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => handleApproveCharacter(e, character.id)}
                    style={{ marginRight: "10px" }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => handleDeclineCharacter(e, character.id)}
                  >
                    Decline
                  </Button>
                </div>
              ))}
            </div>

            {/* <div
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
            </div> */}
          </div>

          {/* First Vertical Line */}
          <div
            style={{
              borderLeft: "0.5px solid #cccccc",
              height: "1300px",
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
              {/* <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>Other Contributions:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {others}
                  </span>
                </label>
              </div> */}
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <label>
                  <strong>Karma:</strong>
                  <span style={{ marginLeft: "20px", fontWeight: "bold" }}>
                    {karma}
                  </span>
                </label>
              </div>
              <div style={{ marginBottom: "20px", marginLeft: "80px" }}>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#4caf50", color: "#fff" }} // Set background and text color
                  href="/home"
                >
                  Edit and delete anime
                </Button>
                <div style={{ marginTop: "10px" }}>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#2196f3", color: "#fff" }} // Set background and text color
                    href="/addAnime"
                  >
                    Add Anime
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Second Vertical Line */}
          <div
            style={{
              borderLeft: "0.5px solid #cccccc",
              height: "1300px",
              margin: "10px",
            }}
          ></div>

          {/* Box below the Update Profile button */}
          <div
            style={{
              border: "0.5px solid #cccccc",
              width: "600px",
              height: "1000px",
              marginTop: "225px",
              marginLeft: "auto",
              overflow: "auto",
            }}
          >
            {/* Content of the box */}
            {pendingComments.map((comment, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <Typography variant="body1">
                  Comment ID: {comment.comment_id}
                </Typography>
                <Typography variant="body1">
                  Anime Name: {comment.anime_name}
                </Typography>
                <Typography variant="body1">
                  Episode Title: {comment.episode_title}
                </Typography>
                <Typography variant="body1">
                  User Name: {comment.user_name}
                </Typography>
                <Typography variant="body1">
                  Comment Time: {comment.comment_time}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ wordWrap: "break-word", marginLeft: 0 }}
                >
                  Comment Text: {comment.text}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleApproveComment(e, comment.comment_id)}
                  style={{ marginRight: "10px" }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={(e) => handleDeclineComment(e, comment.comment_id)}
                >
                  Decline
                </Button>
              </div>
            ))}
          </div>

          {/* Button in the bottom right corner */}
          {/* <div
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
          </div> */}
        </>
      )}
    </motion.div>
  );
}
