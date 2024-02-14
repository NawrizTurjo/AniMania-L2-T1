import axios from "axios";
import React, { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

export default function History() {
  const email = localStorage.getItem("email");
  const user = localStorage.getItem("user");
  const userRole = localStorage.getItem("userRole");
  const img_url = localStorage.getItem("img_url");

  const [history, setHistory] = useState([]);

  const getHistory = async () => {
    try {
      const history = await axios.post(
        `http://localhost:3000/getHistory`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setHistory(history.data);
      console.log(history.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const formatDate = (date) => {
    // Format the date as desired (example: Feb 15, 2024 12:45 PM)
    return `${date.toLocaleString("en-US", {
      month: "short",
    })} ${date.getDate()}, ${date.getFullYear()} ${date.toLocaleString(
      "en-US",
      { hour: "numeric", minute: "2-digit", hour12: true }
    )}`;
  };

  useEffect(() => {
    getHistory();
  }, []);
  return (
    <div>
      <ImageList sx={{ width: "auto", height: "auto" }}>
        {history.map((H) => (
          <ImageListItem key={H.thumbnail}>
            <img
              srcSet={`${H.thumbnail}?w=248&fit=crop&auto=format`}
              src={`${H.thumbnail}?w=248&fit=crop&auto=format`}
              alt={H.name}
              loading="lazy"
            />
            <ImageListItemBar
              title={H.name}
              subtitle={
                <span>
                  {formatDate(new Date(H.time))}@ {H.view_no} th viewer
                </span>
              }
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
