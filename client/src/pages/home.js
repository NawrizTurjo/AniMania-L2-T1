import React, { useEffect, useState } from "react";
import axios from 'axios';
import Pagination from "./pagination";

const AnimeListItem = ({ title, description }) => (
  <li className="anime-list-item">
    <h6>{title}</h6>
    <p>{description}</p>
  </li>
);

export default function Home() {
  const [animes, setAnime] = useState([]);
  const [loading, setLoading] = useState(false);
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
  }, []);

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
  const currentPosts = animes.slice(indexOfFirstAnime, indexOfLastAnime);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // return (
  //   <div className="container mt-5">
  //     <h1 className="text-primary mb-3">My Blog</h1>
  //     <Posts animes={currentPosts} loading={loading} />
  //     <Pagination
  //       animePerPage={animePerPage}
  //       totalPosts={posts.length}
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
        <section className="col-md-6 right-half">
          <div className="anime-list-container">
          <ul className="anime-list">
              {animes.map((anime, index) => (
                <AnimeListItem key={index} title={anime.title} description={anime.description} />
              ))}
            </ul>
          </div>
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
