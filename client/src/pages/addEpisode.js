import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useParams } from "react-router";
import { uploadImage } from "./userDashboard";

dayjs.locale("en");
export default function AddEpisode() {
  const [episodeName, setEpisodeName] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  //   const [animeId, setAnimeId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);
  const [thumbnail, setThumbnail] = useState("");

  const animeId = useParams().id;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your form submission logic here
    console.log(
      episodeName,
      episodeNumber,
      animeId,
      videoUrl,
      thumbnail,
      releaseDate
    );
  };

  const handleImageChange = async (event) => {
    if (event.target.files[0]) {
    //   setThumbnail(event.target.files[0]);
      try {
        const imageUrl = await uploadImage(event.target.files[0]);
        console.log("Uploaded image URL:", thumbnail);
        setThumbnail(imageUrl);
        console.log("img_url", thumbnail);
        // console.log("img_url", thumbnail);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        type="text"
        placeholder="Episode Name"
        value={episodeName}
        onChange={(e) => setEpisodeName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        type="text"
        placeholder="Episode Number"
        value={episodeNumber}
        onChange={(e) => setEpisodeNumber(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        type="text"
        placeholder="Thumbnail"
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        fullWidth
        margin="normal"
      />
      <p>
        <label>
          <b>Upload Thumbnail</b>
        </label>
        <input type="file" onChange={handleImageChange} />
      </p>
      <TextField
        type="text"
        placeholder="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        fullWidth
        margin="normal"
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Release Date"
            onChange={(date) => {
              // Format the date object into "YYYY-MM-DD" format
              const formattedDate = dayjs(date).format("YYYY-MM-DD");
              setReleaseDate(formattedDate);
            }}
          />
        </DemoContainer>
      </LocalizationProvider>

      <Button type="submit" variant="contained" color="primary">
        Add Episode
      </Button>
    </form>
  );
}
