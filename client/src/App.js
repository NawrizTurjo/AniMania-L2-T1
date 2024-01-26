import React from "react";
import { Route,Routes } from "react-router-dom";
import Navbar from "./navbar";
import About from "./pages/about";
import Home from "./pages/home";
import Season from "./pages/season";
import Genre from "./pages/genre";
import Landing from "./pages/landing";
import Footer from "./footer";
import AnimePage from "./pages/anime_id";
import SignUp from "./pages/sign_up";
import Login from"./pages/login";
import GenreAnimes from "./pages/genre_id";
import SearchAnime from "./pages/searchAnime"
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ModeratorDash from "./pages/moderatorDash";
import Episodes from "./pages/episodePage";
import UserDash from "./pages/userDashboard";
import Episode from "./pages/eachEpisodePage";
function App(){ 
  const navigate = useNavigate();
  // State to force rerender in Home component
  const [forceRerender, setForceRerender] = useState(false);

  // Function to toggle forceRerender state
  const toggleRerender = () => {
    setForceRerender((prev) => !(prev));
  };

  // Effect to log whenever forceRerender changes
  useEffect(() => {
    console.log("forceRerender changed:", forceRerender);
  }, [forceRerender]);

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing toggleRerender={toggleRerender}/>} />
          <Route path="/Home" element={<Home forceRerender={forceRerender} toggleRerender={toggleRerender}/>} />
          <Route path="/about" element={<About />} />
          <Route path="/season" element={<Season />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/sign_up" element={<SignUp />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/anime/:id" element={<AnimePage toggleRerender={toggleRerender}/>} />
          <Route path="/genre/:id" element={<GenreAnimes/>} />
          <Route path="/searchAnime" element={<SearchAnime forceRerender={forceRerender} />} />
          <Route path="/searchAnime/:searchTerm" element={<SearchAnime forceRerender={forceRerender} />} />
          {/* <Route path="/home/:username" component={Home} /> */}
          <Route
          path="/Home"
          element={<Home forceRerender={forceRerender} />}/>
          <Route
          path="/searchAnime"
          element={<SearchAnime forceRerender={forceRerender} />}
          />
          <Route path="/moderatorDash" element={<ModeratorDash/>}></Route>
          <Route path="/userDash" element={<UserDash/>}></Route>
          <Route path="/watch/anime/episodes/:id" element={<Episodes toggleRerender={toggleRerender}/>}></Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
