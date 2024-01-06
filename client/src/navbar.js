// Navbar.jsx
import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <img src= "./images/AniMania.png" alt="AniMania Logo" className="logo" width='93px' height ='62 px'/>
      </Link>
      <ul>
        <CustomLink to="/home" className="home-link">
          Home
        </CustomLink>
        <CustomLink to="/genre">Genre</CustomLink>
        <CustomLink to="/season">Season</CustomLink>
        <CustomLink to="/about">About Us</CustomLink>
      </ul>
      <SearchBar />
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
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

function SearchBar() {
  return (
    <div className="search-bar">
      {/* Your search bar JSX */}
      <input type="text" placeholder="Search..." />
      <button>Search</button>
    </div>
  );
}
