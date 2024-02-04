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
import { ToastContainer, toast } from "react-toastify";
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { json, useLocation } from "react-router";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";

const AnimeListItem = ({
  anime_id,
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
  genres,
  is_favorite,
  status,
  user_id,
  forceRerender,
  toggleRerender,
}) => {
  // const [genres, setGenres] = useState([]);
  // const [concatenatedString, setConcatenatedString] = useState("");
  const [open, setOpen] = React.useState(false);
  const [fav, setFav] = useState(false);

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

  useEffect(() => {
    setFav(is_favorite);
  },[id]);

  // console.log(user);
  // console.log(email);
  // console.log(userRole);
  // console.log(img_url);

  // useEffect(() => {
  //   const favString = JSON.stringify(fav);
  //   console.log(favString);
  //   const payload = {
  //     email: email,
  //     favString: favString,
  //     anime_id: anime_id,
  //   };
  //   console.log(payload);

  //   // Send the API request
  //   axios
  //     .put("http://localhost:3000/home", payload)
  //     .then((response) => {
  //       console.log("API request successful", response.data);
  //       // Handle response data if needed
  //     })
  //     .catch((error) => {
  //       console.error("Error making API request", error);
  //       // Handle errors if needed
  //     });

  //     setFav(fav);
  // }, [fav]);

  // useEffect(() => {
  //   setFav(is_favorite);
  // },[]);

  // console.log(title, fav);
  // console.log(user_id);

  // const getGenres = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3000/home",
  //       JSON.stringify({ id,email }),
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         withCredentials: true,
  //       }
  //     );

  //     console.log(response.data);
  //     setGenres(response.data);
  //     const newconcatenatedString = genres
  //       .map((genre) => genre.genre_name)
  //       .join(", ");
  //     setConcatenatedString(newconcatenatedString);
  //     // console.log(genres);
  //     //   console.log(concatenatedString);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  // useEffect(() => {
  //   getGenres();
  // }, [id]);

  // useEffect(() => {
  //   const newConcatenatedString = genres
  //     .map((genre) => genre.genre_name)
  //     .join(", ");
  //   setConcatenatedString(newConcatenatedString);
  // }, [genres]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  // const handleClick = (event) => {
  //   window.location.href = `http://localhost:3001/watch/anime/episodes/${id}`;
    // toast.success('🦄 Wow so easy!', {
    //   position: "top-left",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "dark",
    //   // transition: Bounce,
    //   });
  // };
  const [newStatus, setNewStatus] = useState(status || "Watching");

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

  // const handleWatch = () => {
  //   window.location.href = `http://localhost:3001/watch/anime/episodes/${id}`;
  // };

  // const handleFavorite = async (e) => {
  //   e.preventDefault();
  //   setFav(!fav);
  //   if (fav) {
  //     toast.error(`Removed ${title} from favorites`);
  //   } else {
  //     toast.success(`Added ${title} to favorites`);
  //   }
  // };
  const handleFavorite = async () => {
    try {
      const response = await axios.put("http://localhost:3000/home", {
        email: email,
        favString: JSON.stringify(!fav),
        anime_id: anime_id,
      });

      
      console.log("This is fav state: ",fav);
      if (response.status === 200) {
        setFav(!fav);
        is_favorite = fav;
        console.log("This is is_fav state: ",is_favorite);
        // toast.success(`Anime ${title} ${!fav ? "added to" : "removed from"} favorites`);
        if(!fav){
          // toast.success(``);
          toast.success(`${title} anime is added to your list`, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom,
            });
        }
        else{
          // toast.error(``);
          toast.error(`${title} anime is removed from your list`, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom,
            });
        }
      } else {
        toast.error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleSelect = async(newStat) => {
    console.log(newStat);
    try{
    const response = await axios.put("http://localhost:3000/updateStatus", {
        status: newStat,
        email: email,
        anime_id: anime_id,
      });
      toast.success(`Anime ${title} status updated to ${newStat}`);
    }
    catch(error){
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status");
    }
    
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
      <p style={{ height: "70px" }}>Genre: {genres != null ? genres : "N/A"}</p>
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
      <div className="d-flex justify-content-center align-items-center">
        <Stack className="mt-2" direction="row" spacing={6}>
          {userRole === "M" && (
            <Link to={`http://localhost:3001/anime/${id}`}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            </Link>
          )}

          {userRole === "U" && (
            <Link
              to={`http://localhost:3001/watch/anime/episodes/${id}/episode/1`}
            >
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<PlayCircleFilledIcon />}
              >
                Watch
              </Button>
            </Link>
          )}
          <Link to={`http://localhost:3001/watch/anime/episodes/${id}`}>
          <Button
            color="secondary"
            aria-describedby={pop_id}
            variant="contained"
            // onClick={handleClick}
            aria-owns={Open ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <InfoIcon />
          </Button>
          </Link>
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
              pointerEvents: "none",
            }}
            open={Open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
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
          {userRole === "M" && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleClickOpen}
            >
              Delete
            </Button>
          )}

          {userRole === "U" && (
            <IconButton color="error" onClick={handleFavorite}>
              {fav ? (<FavoriteIcon />
              ) : (<FavoriteBorderIcon />)}
            </IconButton>
          )}
          {userRole === "U" && fav==true &&
            (
              <Dropdown>
              {newStatus === "Planned" && (
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {newStatus}
                </Dropdown.Toggle>
              )}
              {newStatus === "Watching" && (
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {newStatus}
                </Dropdown.Toggle>
              )}
              {newStatus === "Dropped" && (
                <Dropdown.Toggle variant="danger" id="dropdown-basic">
                  {newStatus}
                </Dropdown.Toggle>
              )}
              {newStatus === "Watched" && (
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {newStatus}
                </Dropdown.Toggle>
              )}
              {newStatus === "On hold" && (
                <Dropdown.Toggle variant="warning" id="dropdown-basic">
                  {newStatus}
                </Dropdown.Toggle>
              )}
            
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => { setNewStatus("Planned"); handleSelect("Planned"); }}>Planned</Dropdown.Item>
                <Dropdown.Item onClick={() => { setNewStatus("Watching"); handleSelect("Watching"); }}>Watching</Dropdown.Item>
                <Dropdown.Item onClick={() => { setNewStatus("Dropped"); handleSelect("Dropped"); }}>Dropped</Dropdown.Item>
                <Dropdown.Item onClick={() => { setNewStatus("Watched"); handleSelect("Watched"); }}>Watched</Dropdown.Item>
                <Dropdown.Item onClick={() => { setNewStatus("On hold"); handleSelect("On hold"); }}>On hold</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
          )}
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
      </div>
      <ToastContainer />
    </li>
  );
};

const AnimeItem = ({
  currentanimes,
  loading,
  forceRerender,
  toggleRerender,
}) => {
  if (loading) {
    return <Loader />;
  }

  return (
    <ul className="list-group list-group-horizontal-md flex-row flex-wrap">
      {currentanimes.map((anime, index) => (
        <AnimeListItem
          key={index}
          anime_id={anime.anime_id}
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
          genres={anime.genres}
          is_favorite={anime.is_favorite}
          status={anime.status}
          user_id={anime.user_id}
          forceRerender={forceRerender}
          toggleRerender={toggleRerender}
        />
      ))}
    </ul>
  );
};

export default AnimeItem;
