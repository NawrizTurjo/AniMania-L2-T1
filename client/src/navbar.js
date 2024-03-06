import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State to track window width
  const imgLogo =
    "https://firebasestorage.googleapis.com/v0/b/animania-88956.appspot.com/o/files%2F681761d0-b158-4aca-adc1-c1165722c1fb?alt=media&token=4d6ca537-9c18-4120-879b-5bc854a96e55";
  const isSearchAnimePage = location.pathname === "/searchAnime";

  // Function to handle window resize
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize); // Add event listener for window resize
    return () => {
      window.removeEventListener("resize", handleResize); // Clean up on component unmount
    };
  }, []);

  // Toggle menu based on window width
  useEffect(() => {
    if (windowWidth > 768) {
      setMenuOpen(false); // Close menu on larger screens
    }
  }, [windowWidth]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle menu visibility
  };

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <img
          src={imgLogo}
          alt="AniMania Logo"
          className="logo"
          width="150px"
          height="60px"
        />
      </Link>
      {windowWidth <= 768 && ( // Render menu icon only on smaller screens
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
      )}
      {(menuOpen || windowWidth > 768) && ( // Render menu options on smaller screens or when menu is open on larger screens
        <ul className="menu-options">
          <CustomLink to="/home" className="home-link" onClick={toggleMenu}>
            Home
          </CustomLink>
          <CustomLink to="/genre" onClick={toggleMenu}>
            Genre
          </CustomLink>
          <CustomLink to="/Top100" onClick={toggleMenu}>
            Top 100 Anime
          </CustomLink>
          <CustomLink to="/about" onClick={toggleMenu}>
            About Us
          </CustomLink>
          <CustomLink to="/sign_up" onClick={toggleMenu}>
            sign_up
          </CustomLink>
          <CustomLink to="/login" onClick={toggleMenu}>
            login
          </CustomLink>
          <CustomLink to="/AdvancedSearch" onClick={toggleMenu}>
            Advanced Search
          </CustomLink>
        </ul>
      )}
      {!isSearchAnimePage && windowWidth > 768 && (
        <SearchBar navigate={navigate} />
      )}
    </nav>
  );
}

export function CustomLink({ to, children, ...props }) {
  return (
    <li>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

function SearchBar({ navigate }) {
  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements.searchTerm.value.trim();

    if (searchTerm) {
      navigate("/searchAnime", { state: { searchTerm } });
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input type="text" name="searchTerm" placeholder="Search..." />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
