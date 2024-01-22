import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function ModeratorDash() {
  let [newUsername, setNewUsername] = useState("");
  let location = useLocation();
  let state = location.state;

//   let user = state && state.user;
  let email = state && state.email;

  let person = {
    // user: "",
    added_episodes: 0,
    added_series: 0,
    deleted_episodes: 0,
    deleted_series: 0,
    filtered_comments: 0,
    name: "",
    review_verifications: 0,
    role: "",
  };
  
  let a = 4;
  let getPerson = async () => {
    // e.preventDefault();
    try {
      console.log(email);
      let response = await axios.post(
        `http://localhost:3000/moderatorDash`,
        { email },
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
        filtered_comments: personData?.filtered_comments || 0
      };

      a = person.added_series;
        console.log(person);
        console.log(person.added_series);
        console.log(a);
      //   console.log(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getPerson();
    setNewUsername(person.name);
  }, []);
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


    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h1>Welcome to the Moderator Dashboard</h1>
      {/* {user && <p>User: {user}</p>} */}
      {email && <p>Email: {email}</p>}
      <form>
        <div>
          <label>
            Name
            <input
              id="newUsername"
              type="text"
              name="newUsername"
            //   placeholder={person.name}
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </label>
          <Button variant="contained" disableElevation onClick={handleUpdate}>
            Update Username
          </Button>
        </div>
        <div>
          <label>
            E-mail
            <input type="text" name="email" value={email} readOnly/>
          </label>
        </div>
        <div>
          <label>
            Anime Added
            <input
              type="text"
              name="added_series"
              value={person.added_series} readOnly
            />
          </label>
        </div>
        <div>
          <label>
            Anime Deleted
            <input
              type="text"
              name="deleted_series"
              value={person.deleted_series} readOnly
            />
          </label>
        </div>
        <div>
          <label>
            Episodes Added
            <input
              type="text"
              name="added_episodes"
              value={person.added_episodes} readOnly
            />
          </label>
        </div>
        <div>
          <label>
            Episodes Deleted
            <input
              type="text"
              name="deleted_episodes"
              value={person.deleted_episodes} readOnly
            />
          </label>
        </div>
        <div>
          <label>
            Comments Filtered
            <input
              type="text"
              name="filtered_comments"
              value={person.filtered_comments} readOnly
            />
          </label>
        </div>
        <div>
          <label>
            Review Verified
            <input
              type="text"
              name="review_verifications"
              value={person.review_verifications} readOnly
            /> 
          </label>
        </div>
        <div>
          {/* <label>
            <input
              type="text"
              name="confirmPassword"
              placeholder="Confirm Password"
            />
          </label> */}
        </div>
        {/* <div>
          <Button>
            
          </Button>
        </div> */}
      </form>
    </div>
  );
}
