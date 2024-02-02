import React from "react";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./navbar";
import About from "./pages/about";
import Home from "./pages/home";
import Season from "./pages/season";
import Genre from "./pages/genre";
import Landing from "./pages/landing";
import Footer from "./footer";
import AnimePage from "./pages/anime_id";
import SignUp from "./pages/sign_up";
import Login from "./pages/login";
import GenreAnimes from "./pages/genre_id";
import SearchAnime from "./pages/searchAnime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ModeratorDash from "./pages/moderatorDash";
import Episodes from "./pages/episodePage";
import UserDash from "./pages/userDashboard";
import Episode from "./pages/eachEpisodePage";
import LoadingBar from "react-top-loading-bar";
import { AnimatePresence } from "framer-motion/dist/framer-motion";


function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // State to force rerender in Home component
  const [forceRerender, setForceRerender] = useState(false);
  const [progress, setProgress] = useState(0)  // Function to toggle forceRerender state
  const toggleRerender = () => {
    setForceRerender((prev) => !prev);
  };

  // Effect to log whenever forceRerender changes
  useEffect(() => {
    console.log("forceRerender changed:", forceRerender);
  }, [forceRerender]);

  return (
    <div>
      {/* <Router> */}
      <Navbar />
      <LoadingBar
        color="#57f1f9"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="container">
        <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<Landing toggleRerender={toggleRerender} setProgress={setProgress}/>}
          />
          <Route
            path="/Home"
            element={
              <Home
                forceRerender={forceRerender}
                toggleRerender={toggleRerender}
                setProgress={setProgress}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/season" element={<Season />} />
          <Route path="/genre" element={<Genre setProgress={setProgress}/>} />
          <Route path="/sign_up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/anime/:id"
            element={<AnimePage toggleRerender={toggleRerender} />}
          />
          <Route path="/genre/:id" element={<GenreAnimes />} />
          <Route
            path="/searchAnime"
            element={<SearchAnime forceRerender={forceRerender} />}
          />
          <Route
            path="/searchAnime/:searchTerm"
            element={<SearchAnime forceRerender={forceRerender} />}
          />
          {/* <Route path="/home/:username" component={Home} /> */}
          <Route
            path="/Home"
            element={<Home forceRerender={forceRerender} />}
          />
          <Route
            path="/searchAnime"
            element={<SearchAnime forceRerender={forceRerender} />}
          />
          <Route path="/moderatorDash" element={<ModeratorDash />}></Route>
          <Route path="/userDash" element={<UserDash />}></Route>
          <Route
            path="/watch/anime/episodes/:id"
            element={<Episodes toggleRerender={toggleRerender} setProgress={setProgress}/>}
          ></Route>
          <Route
            path="/watch/anime/episodes/:id/episode/:id2"
            element={<Episode />}
          ></Route>
        </Routes>
        </AnimatePresence>
      </div>
      <Footer />
      {/* </Router> */}
    </div>
  );
}

export default App;
