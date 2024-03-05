import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion/dist/framer-motion";
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextareaAutosize,
  FormControlLabel,
  FormGroup,
  Grid,
} from "@mui/material";
import { json, useLocation } from "react-router";

const AnimePage = ({ toggleRerender }) => {
  const [anime, setAnime] = useState({
    anime_name: "",
    number_of_episodes: 0,
    anime_type: "",
    age_rating: "",
    demographic: "",
    season: "",
    year: 0,
    anime_source: "",
    description: "",
    title_screen: "",
    next_season: "",
    previous_season: "",
  });
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState("");

  const location = useLocation();
  //const { user, email } = location.state || {};
  const {
    user: routeUser,
    email: routeEmail,
    userRole: routeUserRole,
    img_url: routeImgUrl,
  } = location.state || {};

  // Use local state to store user information
  const [user, setUser] = useState(
    routeUser || localStorage.getItem("user") || ""
  );
  const [email, setEmail] = useState(
    routeEmail || localStorage.getItem("email") || ""
  );

  const [userRole, setUserRole] = useState(
    routeUserRole || localStorage.getItem("userRole") || ""
  );

  const [img_url, setImgUrl] = useState(
    routeImgUrl || localStorage.getItem("img_url") || ""
  );

  const getAnime = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/anime/${id}`);
      // setTimeout(() => {
      //   setLoading(false);
      // }, 1000);
      setAnime(res.data[0]);
      setLoading(false);
      console.log(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getAnimeEpisodes = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/anime/${id}/ep`);
      // setTimeout(() => {
      //   setLoading(false);
      // }, 1000);
      setEpisodes(res.data);
      setLoading(false);
      console.log(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAnime();
  }, [id]);

  useEffect(() => {
    getAnimeEpisodes();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnime((prevData) => ({ ...prevData, [name]: value }));
    toggleRerender();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:3000/anime/${id}`,
        JSON.stringify(anime),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Anime updated successfully!", res.data);

      if (selectedEpisode !== "") {
        await axios.put(
          `http://localhost:3000/anime/${id}/episode_delete/${selectedEpisode}`,
          {
            email: email,
          }
        );
        //console.log(`Episode ${selectedEpisode} deleted successfully`);
      }

      goToHome();
      toggleRerender();
    } catch (error) {
      console.error(error.message);
    }
  };

  const goToHome = () => {
    window.location.href = "/home";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Anime Name"
            name="anime_name"
            value={anime.anime_name || ""}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
            size="large"
          />
          <br />

          <TextField
            label="Number of Episodes"
            name="number_of_episodes"
            value={anime.number_of_episodes || 0}
            onChange={handleChange}
            type="number"
            margin="normal"
            variant="outlined"
            fullWidth
            size="large"
          />
          <br />

          <FormControl
            variant="outlined"
            fullWidth
            size="large"
            margin="normal"
          >
            <InputLabel htmlFor="anime-type">Anime Type</InputLabel>
            <Select
              id="anime-type"
              name="anime_type"
              value={anime.anime_type || ""}
              onChange={handleChange}
              label="Anime Type"
            >
              <MenuItem value="TV">TV</MenuItem>
              <MenuItem value="Special">Special</MenuItem>
              <MenuItem value="ONA">ONA</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Movie">Movie</MenuItem>
              <MenuItem value="TV Special">TV Special</MenuItem>
              <MenuItem value="OVA">OVA</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            variant="outlined"
            size="large"
            margin="normal"
          >
            <InputLabel id="age-rating-label">Age Rating</InputLabel>
            <Select
              labelId="age-rating-label"
              id="age-rating"
              name="age_rating"
              value={anime.age_rating || ""}
              onChange={handleChange}
              label="Age Rating"
            >
              <MenuItem value="PG - Children">PG - Children</MenuItem>
              <MenuItem value="PG-13 - Teens 13 or older">
                PG-13 - Teens 13 or older
              </MenuItem>
              <MenuItem value="Rx - Hentai">Rx - Hentai</MenuItem>
              <MenuItem value="R - 17+ (violence & profanity)">
                R - 17+ (violence & profanity)
              </MenuItem>
              <MenuItem value="G - All Ages">G - All Ages</MenuItem>
              <MenuItem value="R+ - Mild Nudity">R+ - Mild Nudity</MenuItem>
            </Select>
          </FormControl>
          <br />

          <FormControl
            variant="outlined"
            fullWidth
            size="large"
            margin="normal"
          >
            <InputLabel htmlFor="demographic">Demographic</InputLabel>
            <Select
              id="demographic"
              name="demographic"
              value={anime.demographic || ""}
              onChange={handleChange}
              label="Demographic"
            >
              <MenuItem value="Seinen">Seinen</MenuItem>
              <MenuItem value="Shoujo">Shoujo</MenuItem>
              <MenuItem value="Shounen">Shounen</MenuItem>
              <MenuItem value="Josei">Josei</MenuItem>
              <MenuItem value="Kids">Kids</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            variant="outlined"
            fullWidth
            size="large"
            margin="normal"
          >
            <InputLabel htmlFor="season">Season</InputLabel>
            <Select
              id="season"
              name="season"
              value={anime.season || ""}
              onChange={handleChange}
              label="Season"
            >
              <MenuItem value="Spring">Spring</MenuItem>
              <MenuItem value="Summer">Summer</MenuItem>
              <MenuItem value="Fall">Fall</MenuItem>
              <MenuItem value="Winter">Winter</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Year"
            name="year"
            value={anime.year || 0}
            onChange={handleChange}
            type="number"
            margin="normal"
            variant="outlined"
            fullWidth
            size="large"
          />
          <br />

          <FormControl
            variant="outlined"
            fullWidth
            size="large"
            margin="normal"
          >
            <InputLabel htmlFor="anime-source">Source</InputLabel>
            <Select
              id="anime-source"
              name="anime_source"
              value={anime.anime_source || ""}
              onChange={handleChange}
              label="Source"
            >
              <MenuItem value="4-koma manga">4-koma manga</MenuItem>
              <MenuItem value="Music">Music</MenuItem>
              <MenuItem value="Book">Book</MenuItem>
              <MenuItem value="Novel">Novel</MenuItem>
              <MenuItem value="Web novel">Web novel</MenuItem>
              <MenuItem value="Mixed media">Mixed media</MenuItem>
              <MenuItem value="Visual novel">Visual novel</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              <MenuItem value="Unknown">Unknown</MenuItem>
              <MenuItem value="Web manga">Web manga</MenuItem>
              <MenuItem value="Manga">Manga</MenuItem>
              <MenuItem value="Light novel">Light novel</MenuItem>
              <MenuItem value="Picture book">Picture book</MenuItem>
              <MenuItem value="Game">Game</MenuItem>
              <MenuItem value="Card game">Card game</MenuItem>
              <MenuItem value="Original">Original</MenuItem>
              <MenuItem value="Radio">Radio</MenuItem>
            </Select>
          </FormControl>
          <br />

          <FormGroup>
            <FormControlLabel
              control={
                <TextareaAutosize
                  rowsMin={3}
                  rowsMax={6}
                  aria-label="description"
                  placeholder="Description"
                  name="description"
                  value={anime.description || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    minHeight: "100px", // Set a minimum height to prevent the box from collapsing
                    resize: "none", // Disable resizing
                    overflowY: "auto", // Enable vertical scrolling if the content overflows
                    padding: "10px", // Adjust padding as needed
                    fontSize: "16px", // Adjust font size as needed
                  }}
                />
              }
              label="Description"
              labelPlacement="top"
            />
          </FormGroup>
          <TextField
            label="Thumbnail Url"
            name="title_screen"
            value={anime.title_screen || ""}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
            size="large"
          />
          <br />

          <TextField
            label="Next Season"
            name="next_season"
            value={anime.next_season || ""}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
            size="large"
          />
          <br />

          <TextField
            label="Previous Season"
            name="previous_season"
            value={anime.previous_season || ""}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            fullWidth
            size="large"
          />
          <br />
          <FormControl
            variant="outlined"
            fullWidth
            size="large"
            margin="normal"
          >
            <InputLabel htmlFor="episode-select">
              Select Episode To Delete{" "}
            </InputLabel>
            <Select
              id="episode-select"
              name="episode"
              value={selectedEpisode}
              onChange={(e) => setSelectedEpisode(e.target.value)}
              label="Select Episode"
              style={{ width: "50%" }}
            >
              {episodes.map((episode) => (
                <MenuItem key={episode.episode_no} value={episode.episode_no}>
                  {`Episode ${episode.episode_no}: ${episode.episode_title}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginRight: "500px" }}
          >
            Submit
          </Button>

          <Button
            variant="contained"
            // onClick={handleAddAnime}
            style={{ color: "white" }}
          >
            <Link
              to={`/anime/${id}/addEpisode`}
              style={{ textDecoration: "none", color: "white" }}
            >
              Add Episodes
            </Link>
          </Button>
        </form>
      )}
    </motion.div>
  );
};

export default AnimePage;
