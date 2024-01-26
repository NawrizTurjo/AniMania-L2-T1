// Navbar.jsx
import React from "react";
import { Link, useNavigate,useLocation, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const imgLogo = "https://firebasestorage.googleapis.com/v0/b/animania-88956.appspot.com/o/files%2F681761d0-b158-4aca-adc1-c1165722c1fb?alt=media&token=4d6ca537-9c18-4120-879b-5bc854a96e55";
  const isSearchAnimePage = location.pathname === "/searchAnime";
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <img src= {imgLogo} alt="AniMania Logo" className="logo" width='150px' height ='60px'/>
      </Link>
      <ul>
        <CustomLink to="/home" className="home-link">
          Home
        </CustomLink>
        <CustomLink to="/genre">Genre</CustomLink>
        <CustomLink to="/season">Season</CustomLink>
        <CustomLink to="/about">About Us</CustomLink>
        <CustomLink to="/sign_up">sign_up</CustomLink>
        <CustomLink to="/login">login</CustomLink>
      </ul>
      { <CustomLink to="/advSearch">Advanced Search</CustomLink>}
      {!isSearchAnimePage && <SearchBar navigate={navigate} />}
    </nav>
  );
}

export function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
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
      // Navigate to the "searchAnime" page with the search term
      // navigate(`/searchAnime`);
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
