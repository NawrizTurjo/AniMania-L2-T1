import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./pagination";
import AnimeItem from "./animeItem";
//import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { faAlignRight } from "@fortawesome/free-solid-svg-icons";


export default function Home({forceRerender}) {
  const location = useLocation();
  //const { user, email } = location.state || {};
  const { user: routeUser, email: routeEmail } = location.state || {};

  // Use local state to store user information
  const [user, setUser] = useState(routeUser || localStorage.getItem("user") || "");
  const [email, setEmail] = useState(routeEmail || localStorage.getItem("email") || "");
  //const { username } = useParams();
  const [animes, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [animePerPage] = useState(10);

  const [sort, setSort] = useState('ANIME_NAME');

  const handleChange = (event) => {
    setSort(event.target.value);
  };

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
      const res = await axios.get(`http://localhost:3000/home`,
      );
      setAnime(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getAnime();
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
  }, [user, email]);
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



  return (
    <div className="Home-div container-fluid">
      <h4 className="text-center mt-3">
        Unlock the Magic of Animation - where stories unfold, emotions ignite,
        and worlds come alive
      </h4>
      <h1>Hello {user}!</h1>
      <h1>Email: {email}</h1>
      {/* //<h1>Welcome, {username}!</h1> */}
      {/* <ul className="list-group list-group-horizontal-md flex-row flex-wrap">
      <li className="list-group-item align-items-center flex-wrap"> */}
      <img
        src="./images/AniMania.png"
        alt="AniMania Logo"
        className="logo img-fluid"
      />
      {/* </li> */}
      {/* <li className="list-group-item align-items-center flex-wrap"> */}
      {/* <Box sx={{ width: 120, marginLeft: "auto"}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sort}
          label="Sort"
          onChange={handleChange}
        >
          <MenuItem value={'anime_id'}>id</MenuItem>
          <MenuItem value={'anime_name'}>Name</MenuItem>
          <MenuItem value={'year'}>Release Date</MenuItem>
          <MenuItem value={'age_Rating'}>Age_rating</MenuItem>
          <MenuItem value={'demographic'}>Demographic</MenuItem>
          <MenuItem value={'season'}>Season</MenuItem>
          <MenuItem value={'mal_score'}>Score</MenuItem>
        </Select>
      </FormControl>
    </Box> */}
      {/* </li> */}
      {/* </ul> */}
      <div className="row">
        {/* <section className="col-md-6 upper-part">
          <div className="card-container">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card bg-light p-3 mt-3">
                <h6>{`Card ${index + 1} Title`}</h6>
                <p>{`This is the description for Card ${index + 1}`}</p>
              </div>
            ))}
          </div>
        </section> */}
        <section>
          <div className="anime-list-container">
            <AnimeItem currentanimes={currentanimes} loading={loading} />
          </div>
        </section>
        <section className="pagination-container">
          <Pagination
            animePerPage={animePerPage}
            totalAnimes={animes.length}
            paginate={paginate}
          />
        </section>
        {/* <section className="col-md-6 watched-anime-part" style={{ float: 'left' }}>
          <div className="watch-history-container">
            <ul className="anime-list">
              {[...Array(10)].map((_, index) => (
                <AnimeListItem key={index} title={`Watched Anime ${index + 1}`} description="Watched this recently" />
              ))}
            </ul>
          </div>
        </section> */}
      </div>
    </div>
  );
}
