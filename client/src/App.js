import { Route,Routes } from "react-router-dom";
import Navbar from "./navbar";
import About from "./pages/about";
import Home from "./pages/home";
import Pricing from "./pages/pricing";
import Landing from "./pages/landing";
import Footer from "./footer";
function App(){ 
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
