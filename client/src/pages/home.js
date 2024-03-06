import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./pagination2";
import AnimeItem from "./animeItem";
//import { useParams } from 'react-router-dom';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { faAlignRight } from "@fortawesome/free-solid-svg-icons";
import PersonIcon from "@mui/icons-material/Person";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LogoutIcon from "@mui/icons-material/Logout";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion/dist/framer-motion";
import AnimeList from "../Components/getAnimeList";
import History from "../Components/getHistory";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Home({ forceRerender, toggleRerender, setProgress }) {
  const [isNotification, setIsNotification] = useState(false);
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

  let karma = localStorage.getItem("karma");
  let contribution = localStorage.getItem("contribution");

  const [forceRerender2, toggleRerender2] = useState(false);

  //const { username } = useParams();
  const [animes, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [animePerPage] = useState(10);

  const [sort, setSort] = useState("ANIME_NAME");

  // const history = useHistory();
  const handleChange = (event) => {
    setSort(event.target.value);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [anchorE3, setAnchorE3] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const getKarma = async (email) => {
    // e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/getKarma`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res.data);
      localStorage.setItem("karma", res.data[0].get_karma);
      console.log("Karma: ", res.data[0].get_karma);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getContribution = async (email) => {
    // e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/getContribution`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(res.data);

      localStorage.setItem("contribution", res.data[0].get_contribution);
      return res.data[0].get_contribution;
    } catch (err) {
      console.error(err.message);
    }
  };

  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const open3 = Boolean(anchorE3);

  // const getAnime = async () => {
  //   try {
  //     setLoading(true);
  //     console.log(1);
  //     const res = await axios.put("http://localhost:3000/home",
  //     JSON.stringify({ sort }),
  //     {
  //       headers: { "Content-Type": "application/json" },
  //       withCredentials: true,
  //     }
  //     );
  //     setAnime(res.data);
  //     setLoading(false);
  //   } catch (err) {
  //     console.error(err.message);
  //   }
  // };
  // useEffect(() => {
  //   getAnime();
  // }, [forceRerender,sort]);

  const getAnime = async () => {
    try {
      setLoading(true);
      console.log(1);

      const userEmail = email;
      const res = await axios.post("http://localhost:3000/home", { userEmail });
      setAnime(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    setProgress(10);
    getAnime();
    setTimeout(() => {
      setProgress(100);
    }, 500);
    getKarma(email);
    getContribution(email);
  }, [forceRerender]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     setLoading(true);
  //     const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  //     setPosts(res.data);
  //     setLoading(false);
  //   };

  //   fetchPosts();
  // }, []);

  // Get current posts
  useEffect(() => {
    // Update local state and local storage when user and email change

    localStorage.setItem("user", user);
    localStorage.setItem("email", email);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("img_url", img_url);
  }, [user, email, userRole, img_url]);
  const indexOfLastAnime = currentPage * animePerPage;
  const indexOfFirstAnime = indexOfLastAnime - animePerPage;
  const currentanimes = animes.slice(indexOfFirstAnime, indexOfLastAnime);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // return (
  //   <div className="container mt-5">
  //     <h1 className="text-primary mb-3">My Blog</h1>
  //     <Posts animes={currentanimes} loading={loading} />
  //     <Pagination
  //       animePerPage={animePerPage}
  //       totalAnimes={posts.length}
  //       paginate={paginate}
  //     />
  //   </div>
  // );
  const navigate = useNavigate();
  const navigate2 = useNavigate();

  const handleClick = (event) => {
    if (user !== "" && userRole === "M")
      navigate("/moderatorDash", { state: { user, email } });
    else if (user !== "" && userRole === "U")
      navigate("/userDash", { state: { user, email } });
    else navigate("/login");
  };

  const handleClick2 = (event) => {
    if (user !== "" && userRole === "U")
      navigate("/notifications", { state: { user, email } });
  };

  const handleLogout = async (e) => {
    // e.preventDefault();
    // try {
    //   const response = await axios.post(
    //     `http://localhost:3000/logout`,
    //     JSON.stringify({ user, email }),
    //     {
    //       headers: { 'Content-Type': 'application/json' },
    //       withCredentials: true,
    //     }
    //   );
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("userRole");
    localStorage.removeItem("img_url");
    setUser("");
    setEmail("");
    setUserRole("");
    setImgUrl("");
    toggleRerender();

    // navigate("/login");
    // } catch (err) {
    //   console.error(err.message);
    // }
  };
  let imgsrc = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <motion.div
      className="Home-div container-fluid"
      style={{ padding: 0, margin: 0, marginLeft: 0, marginRight: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="typewriter">
        <h4>
          {" "}
          <Typewriter
            options={{
              strings: [
                "Unlock the Magic of Animation - where stories unfold, emotions ignite, and worlds come alive",
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 20,
              pauseFor: 2000,
              skipAddStyles: true,
              // cursor: "_",
            }}
          />
        </h4>
      </div>
      <div className="flex-row flex-wrap ">
        {userRole === "U" && (
          <Button
            color="action"
            variant="contained"
            onClick={handleClick2}
            style={{ float: "right" }}
            onMouseEnter={(event) => {
              setAnchorE3(event.currentTarget);
            }}
            onMouseLeave={() => {
              setAnchorE3(null);
            }}
          >
            {isNotification ? <NotificationsIcon /> : <NotificationsNoneIcon />}
            {/* <NotificationsIcon /> */}
          </Button>
        )}

        <Button
          color="action"
          variant="contained"
          onClick={handleClick}
          style={{ float: "right" }}
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <PermIdentityIcon />
        </Button>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
          }}
          open={open}
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
        >
          <Typography sx={{ p: 1 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {user === "" ? (
                <p>You are not logged in</p>
              ) : (
                <Avatar alt={imgsrc} src={img_url} />
              )}

              {user && (
                <div>
                  <h3 className="d-flex ml-4">
                    <b style={{ fontFamily: "Consolas" }}>{user}</b>
                  </h3>
                </div>
              )}
            </div>
            {email && (
              <div>
                <h3>
                  <b>Email:</b> {email}
                </h3>
              </div>
            )}
            {userRole === "U" && (
              <div>
                <h3>
                  <b>Contributions: </b>
                  {contribution}
                </h3>
              </div>
            )}

            {userRole === "M" && (
              <div>
                <h3>
                  <b>Karma: </b>
                  {karma}
                </h3>
              </div>
            )}
          </Typography>
        </Popover>
        <Button
          color="action"
          variant="contained"
          onClick={handleLogout}
          style={{ float: "right" }}
          onMouseEnter={(event) => {
            setAnchorE2(event.currentTarget);
          }}
          onMouseLeave={() => {
            setAnchorE2(null);
          }}
        >
          <LogoutIcon />
        </Button>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
          }}
          open={open2}
          anchorEl={anchorE2}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={() => {
            setAnchorE2(null);
          }}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1 }}>Logout</Typography>
        </Popover>
        {userRole === "U" && (
          <Popover
            id="mouse-over-popover"
            sx={{
              pointerEvents: "none",
            }}
            open={open3}
            anchorEl={anchorE3}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onClose={() => {
              setAnchorE3(null);
            }}
            disableRestoreFocus
          >
            <Typography sx={{ p: 1 }}>Notifications</Typography>
          </Popover>
        )}

        <img
          src="./images/AniMania.png"
          alt="AniMania Logo"
          className="logo_big img-fluid"
        />
      </div>
      <div className="d-inline w-1280 m-0">
        {userRole === "U" && (
          <div>
            <History />
          </div>
        )}
        <div className="row">
          <section>
            <div className="anime-list-container">
              <AnimeItem
                currentanimes={currentanimes}
                loading={loading}
                forceRerender={forceRerender}
                toggleRerender={toggleRerender}
              />
            </div>
          </section>
          <section className="pagination-container">
            <Pagination
              animePerPage={animePerPage}
              totalAnimes={animes.length}
              paginate={paginate}
              toggleRerender={toggleRerender}
            />
          </section>
        </div>
        {userRole === "U" && (
          <div>
            <AnimeList toggleRerender={toggleRerender}/>
          </div>
        )}
      </div>
    </motion.div>
  );
}
