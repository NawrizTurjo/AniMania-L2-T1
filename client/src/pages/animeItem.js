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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Loader from "./loader.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  forceRerender,
  toggleRerender,
}) => {
  const [genres, setGenres] = useState([]);
  const [concatenatedString, setConcatenatedString] = useState("");
  const [open, setOpen] = React.useState(false);
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
  }, [id]);

  useEffect(() => {
    const newConcatenatedString = genres
      .map((genre) => genre.genre_name)
      .join(", ");
    setConcatenatedString(newConcatenatedString);
  }, [genres]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    window.location.href = `http://localhost:3001/watch/anime/episodes/${id}`;
    // toast.success('🦄 Wow so easy!', {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "dark",
    //   // transition: Bounce,
    //   });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDelete = () => {
    setOpen(false);
  };

  const handleAgree = async () => {
    toggleRerender();
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const Open = Boolean(anchorEl);
  const pop_id = Open ? "simple-popover" : undefined;
  return (
    <li
      className="list-group-item align-items-center flex-wrap"
      style={{
        width: "500px",
        height: "700px",
        margin: "auto",
        borderRadius: "8px",
      }}
    >
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
      <p style={{ height: "70px" }}>
        Genre: {concatenatedString != null ? concatenatedString : "N/A"}
      </p>
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
          aria-owns={Open ? 'mouse-over-popover' : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <InfoIcon />
        </Button>
        <Popover
          // pop_id={pop_id}
          // open={Open}
          // anchorEl={anchorEl}
          // onClose={handleClose}
          // anchorOrigin={{
          //   vertical: "bottom",
          //   horizontal: "left",
          // }}
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={Open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
          // style={{
          //   maxWidth: "50%",
          //   maxHeight: "1000px",
          // }}
        >
          <Typography sx={{ p: 2 }}>{description}</Typography>
        </Popover>
        {/* <Button  color="secondary" ><FavoriteIcon /></Button> */}
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleClickOpen}
        >
          Delete
        </Button>
        <Dialog
          open={open}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this anime?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action will delete all about this anime from the database.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete}>Disagree</Button>
            <Button onClick={handleAgree} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
      <ToastContainer />
    </li>
  );
};

const AnimeItem = ({ currentanimes, loading, forceRerender,toggleRerender }) => {
  if (loading) {
    return <Loader />;
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
          forceRerender={forceRerender}
          toggleRerender={toggleRerender}
        />
      ))}
    </ul>
  );
};

export default AnimeItem;
