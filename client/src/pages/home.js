import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./pagination";
import AnimeItem from "./animeItem";
//import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";


export default function Home({forceRerender}) {
  const location = useLocation();
  const { user, email } = location.state || {};
  //const { username } = useParams();
  const [animes, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [animePerPage] = useState(10);

  const getAnime = async () => {
    try {
      setLoading(true);
      console.log(1);
      const res = await axios.get("http://localhost:3000/home");
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
      <h1>Hello, {user}!</h1>
      <h1>Email: {email}</h1>
      {/* //<h1>Welcome, {username}!</h1> */}
      <img
        src="./images/AniMania.png"
        alt="AniMania Logo"
        className="logo img-fluid"
      />
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
