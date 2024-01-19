import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./GenreAnimes.css";
import "bootstrap/dist/css/bootstrap.min.css";

const GenreAnimes = ({ id, name }) => {
  const [loading, setLoading] = useState(true);
  const [animeList, setAnimeList] = useState([]);

  useEffect(() => {
    console.log("Genre ID:", id);
    axios
      .get(`http://localhost:3000/genre/${id}`)
      .then((res) => {
        console.log(res.data);
        setAnimeList(res.data);
        setLoading(false);
        console.log(animeList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // Function to chunk the array into groups of 5
  const chunkArray = (arr, size) => {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, index) =>
      arr.slice(index * size, index * size + size)
    );
  };

  const groupedAnimeList = chunkArray(animeList, 5);

  return (
    <div>
      <a href={`http://localhost:3001/genre/${id}`}>
        <h1>{name}</h1>
      </a>
      <ul className="list-group list-group-horizontal-md flex-row flex-wrap">
        {/* {groupedAnimeList.map((group, index) => (
          <li key={index} className="list-group-item">
            <ul>
              {group.map(anime => (
                <li key={anime.anime_id}>
                  <a href={`http://localhost:3001/anime/${anime.anime_id}`}>
                    {anime.anime_name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))} */}
        {animeList.map((anime) => (
          <li key={anime.anime_id} className="list-group-item align-items-center">
            <a
              key={anime.anime_id}
              href={`http://localhost:3001/anime/${anime.anime_id}`}
              className="list-group-item d-flex align-items-center"
            >
              <img
                src={anime.title_screen}
                className="mini-image mr-2"
                style={{ width: "30px", height: "50px" }}
              />
              {anime.anime_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreAnimes;
