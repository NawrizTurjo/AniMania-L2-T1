import { Route,Routes } from "react-router-dom";
import Navbar from "./navbar";
import About from "./pages/about";
import Home from "./pages/home";
import Season from "./pages/season";
import Genre from "./pages/genre";
import Landing from "./pages/landing";
import Footer from "./footer";
import AnimePage from "./pages/anime_id";
function App(){ 
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/season" element={<Season />} />
          <Route path="/genre" element={<Genre />} />
          <Route path="/anime/:id" element={<AnimePage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
