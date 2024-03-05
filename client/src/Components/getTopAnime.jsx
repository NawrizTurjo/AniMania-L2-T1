import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../pages/pagination3";
import AnimeItem from "../pages/animeItem";

export default function GetTopAnime({
  forceRerender,
  toggleRerender,
  setProgress,
}) {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  let userEmail = localStorage.getItem("email");
  //   let forceRerender = localStorage.getItem("forceRerender");
  //   let toggleRerender = localStorage.getItem("toggleRerender");

  const [currentPage, setCurrentPage] = useState(1);
  const [animePerPage] = useState(10);
  const indexOfLastAnime = currentPage * animePerPage;
  const indexOfFirstAnime = indexOfLastAnime - animePerPage;
  const currentanimes = animes.slice(indexOfFirstAnime, indexOfLastAnime);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getTopAnime = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:3000/top100`, {
        userEmail,
      });
      setAnimes(res.data);
      setLoading(false);
      console.log(animes);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTopAnime();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <div className="row">
      <section>
        <div className="anime-list-container">
          <AnimeItem
            currentanimes={currentanimes}
            loading={loading}
            forceRerender={forceRerender}
            toggleRerender={toggleRerender}
          />
        </div>
      </section>
      <section className="pagination-container">
        <Pagination
          animePerPage={animePerPage}
          totalAnimes={animes.length}
          paginate={paginate}
          toggleRerender={toggleRerender}
        />
      </section>
    </div>
  );
}

/*
        "anime_id": 54499,
        "anime_name": "mme",
        "number_of_episodes": 12,
        "anime_type": "ONA",
        "age_rating": "PG - Children",
        "demographic": "Shounen",
        "season": "summer",
        "year": 2020,
        "anime_source": "Manga",
        "description": "11111",
        "title_screen": "aa",
        "next_season": null,
        "previous_season": null,
        "streaming_sites": "c",
        "mal_score": 11,
        "genres": "Action",
        "user_id": null,
        "is_favorite": false,
        "status": null  
*/
