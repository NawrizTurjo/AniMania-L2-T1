import React, { useEffect, useState } from "react";
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
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

dayjs.locale("en");
export default function AddEpisode({setProgress}) {
  const [episodeName, setEpisodeName] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  //   const [animeId, setAnimeId] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [releaseDate, setReleaseDate] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [streamingSites, setStreamingSites] = useState("");
  const [episodeLength, setEpisodeLength] = useState("");
  const [episode, setEpisode] = useState([
    {
      episodeName: "",
      episodeNumber: "",
      animeId: "",
      videoUrl: "",
      thumbnail: "",
      releaseDate: "",
    },
  ]);

  const animeId = useParams().id;

  const addEpisode = async (episode) => {
    console.log(episode);
    // try {
    await toast.promise(
      await axios.post(
        `http://localhost:3000/${animeId}/addEpisode`,
        JSON.stringify(episode),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      ),
      {
        loading: "Adding Episodes...",
        success: <b>Episode Added!</b>,
        error: <b>Could not add episode.</b>,
      }
    );
    // console.log(res.data);
    // } catch (err) {
    //   console.error(err.message);
    // }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newEpisode = {
      animeId,
      episodeName,
      episodeNumber,
      videoUrl,
      episodeLength,
      thumbnail,
      releaseDate,
      streamingSites,
    };

    console.log("New Episode:", newEpisode);

    try {
      // // Call addEpisode with the new episode
      // await addEpisode(newEpisode);

      // // Update the local state with the new episode
      // setEpisode([...episode, newEpisode]);

      await toast.promise(
        axios.post(`http://localhost:3000/${animeId}/addEpisode`, {
          animeId,
          episodeName,
          episodeNumber,
          videoUrl,
          episodeLength,
          thumbnail,
          releaseDate,
          streamingSites,
        }),
        {
          loading: "Adding Episodes...",
          success: <b>Episode Added!</b>,
          error: <b>Could not add episode.</b>,
        }
      );

      // Clear the form fields if needed
      setEpisodeName("");
      setEpisodeNumber("");
      setVideoUrl("");
      setThumbnail("");
      setReleaseDate(null);
      setStreamingSites("");
      setEpisodeLength("");

      // toast.success("Episode added successfully!");
    } catch (error) {
      console.error("Error adding episode:", error);
      toast.error("Failed to add episode.");
    }
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
  useEffect(() => {
    console.log("Anime ID:", animeId);
  }, [animeId]);

  useEffect(() => {
    setProgress(10);
    setTimeout(() => {
      setProgress(100);
    }, 500);
  }, []);

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
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
          // type="text"
          placeholder="Episode Number"
          type="number"
          value={episodeNumber}
          onChange={(e) => setEpisodeNumber(e.target.value)}
          // fullWidth
          style={{ width: "45%", marginRight: "125px" }}
          margin="normal"
        />
        <TextField
          // type="text"
          placeholder="Length in minutes"
          type="number"
          value={episodeLength}
          onChange={(e) => setEpisodeLength(e.target.value)}
          // fullWidth
          style={{ width: "45%" }}
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

        <TextField
          type="text"
          placeholder="Streaming Site"
          value={streamingSites}
          onChange={(e) => setStreamingSites(e.target.value)}
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
                console.log("Release Date:", formattedDate);
              }}
            />
          </DemoContainer>
        </LocalizationProvider>

        <Button type="submit" variant="contained" color="primary">
          Add Episode
        </Button>
      </form>
    </div>
  );
}
