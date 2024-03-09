import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import KeyboardArrowUpSharpIcon from "@mui/icons-material/KeyboardArrowUpSharp";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { motion } from "framer-motion/dist/framer-motion";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Alert from "@mui/material/Alert";
import { toast, Toaster } from "react-hot-toast";
import VerifiedIcon from "@mui/icons-material/Verified";
// import Button from 'react-bootstrap/Button';
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Episodes({ toggleRerender, setProgress }) {
  const { id } = useParams();
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewloading, setReviewLoading] = useState(true);
  //let [source,setsource]=useState("");
  const [stat, setStat] = useState(false);
  const [animeStat, setAnimeStat] = useState(false);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const location = useLocation();
  const [editMode, setEditMode] = useState(false);
  const [editableReviewIndex, setEditableReviewIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [value, setValue] = useState(0);
  const [updatedRating, setUpdatedRating] = useState(0);
  const [studio, setStudio] = useState("");
  const [music, setMusic] = useState("");
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

  //   console.log(user, email, img_url, userRole);
  let [cleanedText, setCleanedText] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [isList, setIsList] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [newStatus, setNewStatus] = useState("Watching");
  const [status, setStatus] = useState("");

  const getAssets = async () => {
    try {
      setLoading(true);
      const res1 = await axios.post(`http://localhost:3000/getStudio`, {
        id: id,
      });
      const res2 = await axios.post(`http://localhost:3000/getSoundtracks`, {
        id: id,
      });

      console.log(email, id);

      // const res3 = await axios.post(`http://localhost:3000/getAnimeStatus`, {
      //   email: email,
      //   id: id,
      // });

      // const res4 = await axios.post(`http://localhost:3000/getMostFav`, {
      //   email: email,
      //   id: id,
      // });
      // setStudio(res1.data[0].studio_name);
      // setMusic(res2.data[0].title);

      // console.log("res3", res3.data);
      // console.log("res4", res4.data);
      // console.log(res4.data[0].anime_id == id);
      // setIsFav(res4.data[0].anime_id == id);

      // if (res3.data[0]?.watch_status != "No") {
      //   setStatus(res3.data[0].watch_status);
      //   setIsList(true);
      // } else {
      //   setStatus("");
      //   setIsList(false);
      // }

      // setNewStatus(res3.data[0]?.watch_status || "Watching");
      // // if (res4.data[0].anime_id !== id) {
      // //   console.log("notfav");
      // //   setIsFav(false);
      // // } else {
      // //   setIsFav(true);
      // //   console.log("isList");
      // // }
      // // console.log(res1.data[0].studio_name.join(", "));
      // // console.log(res2.data[0].title.join(", "));
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getAssets2 = async () => {
    try {
      setLoading(true);

      console.log(email, id);

      const res3 = await axios.post(`http://localhost:3000/getAnimeStatus`, {
        email: email,
        id: id,
      });

      const res4 = await axios.post(`http://localhost:3000/getMostFav`, {
        email: email,
      });

      console.log("res3", res3.data);
      console.log("res4", res4.data);
      console.log(res4.data[0].anime_id == id);
      setIsFav(res4.data[0].anime_id == id);

      if (res3.data[0]?.watch_status != "No") {
        setStatus(res3.data[0].watch_status);
        setIsList(true);
      } else {
        setStatus("");
        setIsList(false);
      }

      setNewStatus(res3.data[0]?.watch_status || "Watching");
      // if (res4.data[0].anime_id !== id) {
      //   console.log("notfav");
      //   setIsFav(false);
      // } else {
      //   setIsFav(true);
      //   console.log("isList");
      // }
      // console.log(res1.data[0].studio_name.join(", "));
      // console.log(res2.data[0].title.join(", "));
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getAnime = async () => {
    try {
      setProgress(10);
      setLoading(true);
      //   console.log(1);
      const res = await axios.get(
        `http://localhost:3000/watch/anime/episodes/${id}`
      );
      setAnime(res.data[0]);
      //console.log(res.data.age_rating);
      setLoading(false);
      setCleanedText(
        res.data[0].description.replace("[Written by MAL Rewrite]", "")
      );
      setAnimeStat((prev) => !prev);
      //   console.log(res.data);
      // toggleRerender();
      // setTimeout(() => {
      setProgress(100);
      // }, 1000);
    } catch (err) {
      console.error(err.message);
    }
  };
  const handleSubmitReview = async (event) => {
    event.preventDefault();
    console.log("Review:", review, "by ", user);
    // const oldReviews = reviews;
    try {
      setReviewLoading(true);
      await axios.post(`http://localhost:3000/watch/anime/episodes/${id}`, {
        id: id,
        review: review,
        rating: value,
        email: email,
      });
      // setReviews(res.data[0]);
      // console.log(res.data[0]);
      // setReviews([...reviews, response.data]);
      // console.log(response.data[0]);
      setReview("");
      setStat((prev) => !prev);
      setValue(0);
      const newReviews = await getReview();
      setReviews(newReviews);
      setReviewLoading(false);
    } catch (err) {
      console.log(err.message);
      if (err.message === "Request failed with status code 500") {
        alert("You cannot post multiple reviews for the same anime.");
        // setTimeout(() => {
        //   toast.error("This didn't work.");
        //   // setProgress(100);
        // }, 1000);
        handleShow();
        setReview("");
        // setReviews(oldReviews);
        // getReview();
        setValue(0);
        // return(
        //   <Alert severity="error">"You cannot post multiple reviews for the same anime."</Alert>
        //   )
        window.location.reload();
      }
    }
    // toggleRerender();
  };

  const getReview = async (event) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/watch/anime/episodes/${id}/reviews`
      );
      //   setAnime(res.data[0]);
      //console.log(res.data.age_rating);
      // setStat((prev)=>(!prev));
      console.log(stat);
      // setReviews(res.data);
      console.log(reviews);
      console.log(res.data);

      return res.data;
    } catch (err) {
      console.error(err.message);
    }
  };
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getReview();
  //   }, 10000); // Fetch reviews every 60 seconds

  //   // Cleanup function to clear the interval
  //   return () => clearInterval(interval);
  // }, []);

  const handleFavorite = async () => {
    try {
      const response = await axios.put("http://localhost:3000/home", {
        email: email,
        favString: JSON.stringify(!isList),
        anime_id: id,
      });
      // await getContribution(email);
      // await getAnimeList();
      // toggleRerender();

      console.log("This is isList state: ", isList);
      if (response.status === 200) {
        setIsList((prev) => !prev);
        // is_favorite = isList;
        // console.log("This is is_fav state: ", is_favorite);
        // toast.success(`Anime ${title} ${!isList ? "added to" : "removed from"} favorites`);
        if (!isList) {
          // toast.success(``);
          // toast.success(`${title} anime is added to your list`, {
          //   position: "top-left",
          //   autoClose: 5000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "colored",
          //   transition: Zoom,
          // });
          toast.success(`${anime.anime_name}  is added to your List`, {
            style: {
              border: "1px solid #1ae84d",
              padding: "16px",
              color: "#284ffc",
            },
            iconTheme: {
              primary: "#1ae84d",
              secondary: "#FFFAEE",
            },
          });
        } else {
          // toast.error(``);
          // toast.error(`${title} anime is removed from your list`, {
          //   position: "top-left",
          //   autoClose: 5000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "colored",
          //   transition: Zoom,
          // });
          setNewStatus("Watching");
          // setIsList(true);
          // setTimeout(() => {

          //   setNewStatus("Watching");
          // }
          //   , 1000);
          toast.error(`${anime.anime_name} is removed from your List`, {
            style: {
              border: "1px solid #fc2864",
              padding: "16px",
              color: "#fa2c02",
            },
            iconTheme: {
              primary: "#fc2864",
              secondary: "#FFFAEE",
            },
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

  const handleUpdatefavAnime = async (stringParam) => {
    console.log(stringParam);
    try {
      const response = await axios.post("http://localhost:3000/updateIsFav", {
        email: email,
        id: id,
        parameter: stringParam,
      });
      if (stringParam === "Update") {
        setIsFav(true);
        toast.success(`${anime.anime_name} is now your favourite anime`, {
          style: {
            border: "1px solid #1ae84d",
            padding: "16px",
            color: "#284ffc",
          },
          iconTheme: {
            primary: "#1ae84d",
            secondary: "#FFFAEE",
          },
        });
      } else {
        setIsFav(false);
        toast.error(`${anime.anime_name} anime is removed from your profile`, {
          style: {
            border: "1px solid #fc2864",
            padding: "16px",
            color: "#fa2c02",
          },
          iconTheme: {
            primary: "#fc2864",
            secondary: "#FFFAEE",
          },
        });
      }
      console.log(isFav);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  useEffect(() => {
    getAssets2();
  }, [isList, isFav]);

  const handleSelect = async (newStat) => {
    console.log(newStat);
    try {
      const response = await axios.put("http://localhost:3000/updateStatus", {
        status: newStat,
        email: email,
        anime_id: id,
      });
      // toast.success(`Anime ${title} status updated to ${newStat}`);
      // toggleRerender();
      toast.success(
        `${anime.anime_name} status has been updated to ${newStat}`,
        {
          style: {
            border: "1px solid #1ae84d",
            padding: "16px",
            color: "#284ffc",
          },
          iconTheme: {
            primary: "#1ae84d",
            secondary: "#FFFAEE",
          },
        }
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Failed to update favorite status");
    }
  };

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after unmounting

    const fetchReviews = async () => {
      const newReviews = await getReview();

      console.log(newReviews);
      if (isMounted) {
        const oldReviewTimes = reviews.map((review) => review.review_time);
        const newReviewTimes = newReviews.map((review) => review.review_time);

        if (JSON.stringify(newReviewTimes) !== JSON.stringify(oldReviewTimes)) {
          setReviewLoading(true);
          setReviews(newReviews);
          setTimeout(() => {
            setProgress(100);
          }, 500);
          setReviewLoading(false);
        }
      }
      // else {
      //   setReviewLoading(false);
      //   setReviews([]);
      //   setTimeout(() => {
      //     setProgress(100);
      //   }, 500);
      // }
    };

    const interval = setInterval(fetchReviews, 10000); // Fetch reviews every 60 seconds

    fetchReviews(); // Fetch reviews on component mount

    return () => {
      clearInterval(interval); // Cleanup function to clear the interval
      isMounted = false; // Update the flag to prevent state updates after unmounting
    };
  }, [reviews]); // Fetch reviews when id changes
  useEffect(() => {
    getReview();
  }, [stat, animeStat]);
  useEffect(() => {
    console.log(reviews); // Log updated reviews state
  }, [reviews]); // Log reviews whenever it changes

  useEffect(() => {
    getAnime();
    getAssets();
    // toggleRerender();
  }, []); // Log reviews whenever it changes
  // if (loading || reviewloading) {
  //   return <h1>Loading...</h1>;
  // }

  const handleUpdateReview = async (reviewId, reviewText, newRating) => {
    console.log("Review:", review, "by ", user);
    try {
      await toast.promise(
        axios.put(`http://localhost:3000/updateReview`, {
          review_id: reviewId,
          review_text: reviewText,
          rating: newRating,
        }),
        {
          loading: "Updating review...",
          success: <b>Review updated!</b>,
          error: <b>Could not update review.</b>,
        }
      );
      setEditedText("");
      setUpdatedRating(0);

      // setReviews(res.data[0]);
      // console.log(res.data[0]);
      // setReviews([...reviews, response.data]);
      // console.log(response.data[0]);
      // setReview("");
      setStat((prev) => !prev);
    } catch (err) {
      console.log(err.message);
    }
    // toggleRerender();
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      style={{ minHeight: "100vh" }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {loading !== true ? (
        <div className="row justify-content-center">
          <div className="col-lg-4">
            {/* Larger title screen */}
            <img
              src={anime.title_screen}
              alt={anime.anime_name}
              style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }}
            />
            {/* Add a button below the title screen */}
            {userRole === "U" ? (
              <Link
                to={`http://localhost:3001/watch/anime/episodes/${id}/episode/1`}
              >
                <button className="btn btn-danger btn-lg btn-block mt-3">
                  Watch Now
                </button>
              </Link>
            ) : (
              <Link to="http://localhost:3001/login">
                <button className="btn btn-primary btn-lg btn-block mt-3">
                  Login to Watch
                </button>
              </Link>
            )}
            <div className="d-flex flex-column mt-3">
              <div className="d-flex">
                <Link
                  to={`http://localhost:3001/${id}/characters`}
                  className="flex-grow-1 me-3"
                >
                  <button className="btn btn-info btn-lg btn-block">
                    See Characters
                  </button>
                </Link>
                <Link
                  to={`http://localhost:3001/${id}/staffs`}
                  className="flex-grow-1"
                >
                  <button className="btn btn-info btn-lg btn-block">
                    See Staffs
                  </button>
                </Link>
              </div>
            </div>
            {userRole === "U" && (
              <div className="mt-3">
                {isFav === true ? (
                  <FavoriteIcon
                    color="error"
                    fontSize="large"
                    onClick={() => handleUpdatefavAnime("Delete")}
                  />
                ) : (
                  <FavoriteBorderIcon
                    color="error"
                    fontSize="large"
                    onClick={() => handleUpdatefavAnime("Update")}
                  />
                )}
                {userRole === "U" && isList === true ? (
                  <CheckCircleIcon
                    color="success"
                    fontSize="large"
                    onClick={handleFavorite}
                  />
                ) : (
                  <AddBoxTwoToneIcon
                    color="primary"
                    fontSize="large"
                    onClick={handleFavorite}
                  />
                )}
                {userRole === "U" && isList === true && (
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
                      <Dropdown.Item
                        onClick={() => {
                          setNewStatus("Planned");
                          handleSelect("Planned");
                        }}
                      >
                        Planned
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setNewStatus("Watching");
                          handleSelect("Watching");
                        }}
                      >
                        Watching
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setNewStatus("Dropped");
                          handleSelect("Dropped");
                        }}
                      >
                        Dropped
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setNewStatus("Watched");
                          handleSelect("Watched");
                        }}
                      >
                        Watched
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setNewStatus("On hold");
                          handleSelect("On hold");
                        }}
                      >
                        On hold
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            )}
          </div>
          <div className="col-lg-8">
            {/* Anime details */}
            <div className="card shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-center">{anime.anime_name}</h2>
                <p className="card-text">{cleanedText}</p>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        <strong>Genre:</strong> {anime.genres}
                      </li>
                      <li className="list-group-item">
                        <strong>Year:</strong> {anime.year}
                      </li>
                      <li className="list-group-item">
                        <strong>Source:</strong> {anime.anime_source}
                      </li>
                      <li className="list-group-item">
                        <strong>Type:</strong> {anime.anime_type}
                      </li>
                      <li className="list-group-item">
                        <strong>Tags:</strong> {anime.tags}
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        <strong>Age Rating:</strong> {anime.age_rating}
                      </li>
                      <li className="list-group-item">
                        <strong>Anime ID:</strong> {anime.anime_id}
                      </li>
                      <li className="list-group-item">
                        <strong>Demographic:</strong> {anime.demographic}
                      </li>
                      <li className="list-group-item">
                        <strong>MAL Score:</strong> {anime.mal_score}
                      </li>
                      <li className="list-group-item">
                        <strong>Number of Episodes:</strong>{" "}
                        {anime.number_of_episodes}
                      </li>
                      <li className="list-group-item">
                        <strong>Season:</strong> {anime.season}
                      </li>
                      <li className="list-group-item">
                        <strong>Studio(s):</strong> {studio}
                      </li>
                      <li className="list-group-item">
                        <strong>Music:</strong> {music}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>Anime is Loading</h1>
        </div>
      )}
      {/* Review box */}
      {userRole === "U" && (
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <div className="card border-primary">
              <div className="card-body">
                <form onSubmit={handleSubmitReview}>
                  <div className="form-group">
                    <strong>
                      <label htmlFor="review">Your Review:</label>
                    </strong>
                    <textarea
                      className="form-control"
                      id="review"
                      rows="3"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      style={{ resize: "none" }}
                    ></textarea>
                  </div>

                  {review !== "" && (
                    <Stack direction="row" spacing={18} alignItems="center">
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "265px" }}
                        endIcon={<KeyboardArrowUpSharpIcon />}
                      >
                        Submit Review
                      </Button>
                      <Rating
                        name="simple-controlled"
                        value={value}
                        onChange={(event, newValue) => {
                          setValue(newValue);
                        }}
                        style={{ marginRight: "0" }}
                      />
                    </Stack>
                  )}
                  {review === "" && (
                    <Stack direction="row" spacing={18} alignItems="center">
                      <Button
                        //type="submit"
                        disabled
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "265px" }}
                        endIcon={<KeyboardArrowUpSharpIcon />}
                      >
                        Submit Review
                      </Button>
                      <Rating
                        name="disabled"
                        style={{ marginRight: "0" }}
                        value={value}
                        disabled
                      />
                    </Stack>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        {/* Render reviews */}
        {!reviewloading ? (
          <div>
            {reviews.map((review, index) => (
              <div key={index}>
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar alt={review.reviewer} src={review.img_src} />
                    <Typography variant="body1" style={{ marginRight: "10px" }}>
                      {review.reviewer}
                    </Typography>
                    {DateFormatter({ date: review.review_time })}
                    {email === review.email ? (
                      <Rating
                        name={`editable-rating-${index}`}
                        value={review.rating}
                        onChange={(event, newValue) => {
                          setUpdatedRating(newValue);
                          console.log(updatedRating);
                          review.rating = newValue;
                        }}
                      />
                    ) : (
                      <Rating name="read-only" value={review.rating} readOnly />
                    )}
                    {review.status === "approved" && (
                      <VerifiedIcon color="success" />
                    )}
                  </Stack>
                </Box>
                {/* Render editable textarea if user's email matches review email */}
                {email === review.email ? (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <textarea
                      className="form-control"
                      id={`review-${index}`}
                      rows={Math.min(
                        Math.ceil((review.review_text ?? "").length / 200) + 2,
                        25 // Maximum of 20 rows
                      )}
                      value={review.review_text}
                      style={{ resize: "none", width: "100%" }}
                      onChange={(e) => {
                        setEditedText(e.target.value);
                        review.review_text = e.target.value;
                      }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleUpdateReview(
                          review.review_id,
                          review.review_text,
                          review.rating
                        )
                      }
                    >
                      Save
                    </Button>
                  </Box>
                ) : (
                  // Render read-only textarea for other reviews
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <textarea
                      className="form-control-disabled"
                      id={`review-${index}`}
                      rows={Math.min(
                        Math.ceil(review.review_text.length / 200) + 2,
                        25 // Maximum of 20 rows
                      )}
                      value={review.review_text}
                      style={{ resize: "none", width: "100%" }}
                      readOnly
                    />
                  </Box>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Render a loading indicator or placeholder if reviews is null

          <h3>No reviews yet...</h3>
        )}
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
}

const DateFormatter = ({ date }) => {
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Convert the date string to a Date object
  const dateObject = new Date(date);

  // Format the date using dateFormatter
  const formattedDate = dateFormatter.format(dateObject);

  // string of formatted date
  return formattedDate;
};

// const styles = {
//   container: {
//       maxWidth: '800px',
//       margin: '0 auto',
//       padding: '20px',
//       fontFamily: 'Arial, sans-serif',
//   },
//   header: {
//       textAlign: 'center',
//       marginBottom: '30px',
//   },
//   title: {
//       fontSize: '36px',
//       marginBottom: '10px',
//   },
//   image: {
//       width: '50%',
//       borderRadius: '8px',
//       boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//   },
//   detailsContainer: {
//       background: '#f9f9f9',
//       padding: '20px',
//       borderRadius: '8px',
//       boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
//   },
//   description: {
//       marginBottom: '20px',
//   },
//   details: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//       gap: '10px',
//   },
//   detailLabel: {
//       fontWeight: 'bold',
//   },
// };

// editable review

// <div>
//   {/* Render reviews */}
//   {!reviewloading ? (
//     <div>
//       {reviews.map((review, index) => (
//         <div key={index}>
//           <Box
//             sx={{
//               mt: 4,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Stack direction="row" spacing={2} alignItems="center">
//               <Avatar alt={review.reviewer} src={review.img_src} />
//               <Typography variant="body1">{review.reviewer}</Typography>
//             </Stack>
//           </Box>
//           {/* Render editable textarea if user's email matches review email */}
//           {email === review.email ? (
//             <Box sx={{ mt: 2, textAlign: "center" }}>
//               <textarea
//                 className="form-control"
//                 id={`review-${index}`}
//                 rows={
//                   review.review_text.length / 500 > 1
//                     ? review.review_text.length / 500
//                     : 3
//                 }
//                 value={review.review_text}
//                 style={{ resize: "none", width: "100%" }}
//                 onChange={(e) => {
//                   const updatedReviews = [...reviews];
//                   updatedReviews[index].review_text = e.target.value;
//                   setReviews(updatedReviews);
//                 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => saveEditedReview(review.review_text, index)}
//               >
//                 Save
//               </Button>
//             </Box>
//           ) : (
//             // Render read-only textarea for other reviews
//             <Box sx={{ mt: 2, textAlign: "center" }}>
//               <textarea
//                 className="form-control-disabled"
//                 id={`review-${index}`}
//                 rows={
//                   review.review_text.length / 500 > 1
//                     ? review.review_text.length / 500
//                     : 3
//                 }
//                 value={review.review_text}
//                 style={{ resize: "none", width: "100%" }}
//                 readOnly
//               />
//             </Box>
//           )}
//         </div>
//       ))}
//     </div>
//   ) : (
//     // Render a loading indicator or placeholder if reviews is null
//     <h3>Loading reviews...</h3>
//   )}
// </div>
