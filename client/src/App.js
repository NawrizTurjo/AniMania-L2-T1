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
import { useState,useEffect } from "react";
function App(){ 
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
          <Route path="/Home" element={<Home forceRerender={forceRerender}/>} />
          <Route path="/about" element={<About />} />
          <Route path="/season" element={<Season />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/sign_up" element={<SignUp />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/anime/:id" element={<AnimePage toggleRerender={toggleRerender}/>} />
          <Route path="/genre/:id" element={<GenreAnimes/>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
