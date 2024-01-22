import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import Rating from "@mui/material/Rating";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import GenreAnimes from "./genre_id";
import axios from "axios";

const AnimeListItem = ({
  title,
  ep,
  anime_type,
  age_rating,
  demo,
  season,
  yr,
  thumbnail,
  id,
  rating,
  description,
}) => {
  const [genres, setGenres] = useState([]);
  const [concatenatedString, setConcatenatedString] = useState("");
  const getGenres = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/home",
        JSON.stringify({ id }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response.data);
      setGenres(response.data);
      const newconcatenatedString = genres
        .map((genre) => genre.genre_name)
        .join(", ");
        setConcatenatedString(newconcatenatedString);
        // console.log(genres);
    //   console.log(concatenatedString);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getGenres();
  }, []);

  useEffect(() => {
    const newConcatenatedString = genres.map((genre) => genre.genre_name).join(", ");
    setConcatenatedString(newConcatenatedString);
  }, [genres]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const pop_id = open ? "simple-popover" : undefined;
  return (
    <li className="list-group-item align-items-center flex-wrap" style={{ maxWidth: "500px", margin: "auto" }}>
      {thumbnail && (
        <img src={thumbnail} alt={`${title} Thumbnail`} className="thumbnail" />
      )}

      <h6>{title}</h6>
      <p>
        Num of episodes: {ep != null ? ep : "N/A"} | Type:{" "}
        {anime_type != null ? anime_type : "N/A"} |{" "}
        {age_rating != null ? age_rating : "N/A"}
      </p>
      <p>Demographic: {demo != null ? demo : "N/A"}</p>
      <p>
        Season: {season != null ? season : "N/A"} | Year:{" "}
        {yr != null ? yr : "N/A"}
      </p>
      <p>Genre: {concatenatedString !=null ? concatenatedString : "N/A"}</p>
      <Stack direction="row" spacing={7}>
        <Rating
          name="customized-10"
          value={rating}
          max={10}
          precision={0.1}
          size="large"
          readOnly
        />
        <h4>{rating}</h4>
      </Stack>
      <Stack direction="row" spacing={10}>
        <a href={`http://localhost:3001/anime/${id}`}>
          <Button variant="outlined" color="secondary" startIcon={<EditIcon />}>
            Edit
          </Button>
        </a>
        <Button
          color="secondary"
          aria-describedby={pop_id}
          variant="contained"
          onClick={handleClick}
        >
          <InfoIcon />
        </Button>
        <Popover
          pop_id={pop_id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Typography sx={{ p: 2 }}>{description}</Typography>
        </Popover>
        {/* <Button  color="secondary" ><FavoriteIcon /></Button> */}
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
          Delete
        </Button>
      </Stack>
    </li>
  );
};

const AnimeItem = ({ currentanimes, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <ul className="list-group list-group-horizontal-md flex-row flex-wrap">
      {currentanimes.map((anime, index) => (
        <AnimeListItem
          key={index}
          title={anime.anime_name}
          ep={anime.number_of_episodes}
          anime_type={anime.anime_type}
          age_rating={anime.age_rating}
          demo={anime.demographic}
          season={anime.season}
          yr={anime.year}
          thumbnail={anime.title_screen}
          id={anime.anime_id}
          rating={anime.mal_score}
          description={anime.description}
        />
      ))}
    </ul>
  );
};

export default AnimeItem;
