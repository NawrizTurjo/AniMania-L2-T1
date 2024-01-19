import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const GenreAnimes = () => {
  const [loading, setLoading] = useState(true);
  const [animeList, setAnimeList] = useState([]);
  const { id } = useParams();
  //const id=

  useEffect(() => {
    axios.get(`http://localhost:3000/genre/${id}`)
      .then(res => {
        console.log(res.data);
        setAnimeList(res.data);
        setLoading(false);
      })
      .catch(err => {
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
      <h1>Anime List</h1>
      <ul>
        {groupedAnimeList.map((group, index) => (
          <li key={index}>
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
        ))}
        {/* {animeList.map((anime) => (
          <li key={anime.anime_id}>
            <a href={`http://localhost:3001/anime/${anime.anime_id}`}>
              {anime.anime_name}
            </a>
          </li>
        ))} */}
      </ul>
    </div>
  );
};

export default GenreAnimes;
