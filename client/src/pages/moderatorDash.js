import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";


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
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getPerson();
    // setNewUsername(person.name);
  }, []);
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
        JSON.stringify({ newUsername, email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response.data);
      let name = response.data[0].user_name;
      console.log(name);
      setUser(name);
      // localStorage.setItem("user", user);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <h1>Welcome to the Moderator Dashboard</h1>
          {email && <p>Email: {email}</p>}
          <form>
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
