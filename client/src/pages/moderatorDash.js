import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ModeratorDash() {
  const location = useLocation();
  const state = location.state;

  const user = state && state.user;
  const email = state && state.email;

  const getPerson = async () => {
    try {
      console.log(1);
      console.log(email);
      const response = await axios.post(
        `http://localhost:3000/moderatorDash`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const personData = response.data[0];

      const person = {
        added_episodes: personData?.added_episodes || 0,
        added_series: personData?.added_series || 0,
        deleted_episodes: personData?.deleted_episodes || 0,
        deleted_series: personData?.deleted_series || 0,
        filtered_comments: personData?.filtered_comments || 0,
        name: personData?.name || "",
        review_verifications: personData?.review_verifications || 0,
        role: personData?.role || "",
      };

    //   console.log(person);
      //   console.log(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getPerson();
  }, []);
  if (user == "" && email == "") {
    return (
      <div>
        <h1>You are not logged in</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to the Moderator Dashboard</h1>
      {user && <p>User: {user}</p>}
      {email && <p>Email: {email}</p>}
      <form>
        <div>
          <label>
            <input type="text" name="username" placeholder="Username" />
          </label>
        </div>
        <div>
          <label>
            <input type="text" name="email" placeholder="Email" />
          </label>
        </div>
        <div>
          <label>
            <input type="text" name="password" placeholder="Password" />
          </label>
        </div>
        <div>
          <label>
            <input
              type="text"
              name="confirmPassword"
              placeholder="Confirm Password"
            />
          </label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}
