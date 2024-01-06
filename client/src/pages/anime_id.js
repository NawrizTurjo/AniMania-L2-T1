import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AnimePage = () => {
  const [anime, setAnime] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  var title;
  const getAnime = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/anime/${id}`);
      setAnime(res.data[0]);
      setLoading(false);
      console.log(res.data);
      title = res.data[0].anime_name;
      console.log(title);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAnime();
  }, [id]);


  useEffect(() => {
    
    const fetchAnimeData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/anime/${id}`);
        setAnime(response.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchAnimeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnime((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3000/anime/${id}`, anime);
      console.log("Anime updated successfully!");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Anime Name:</label>
          <input
            type="text"
            name="anime_name"
            value={anime.anime_name}
            onChange={handleChange}
          />

          <label>Number of Episodes:</label>
          <input
            type="text"
            name="number_of_episodes"
            value={anime.number_of_episodes}
            onChange={handleChange}
          />

          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={anime.type}
            onChange={handleChange}
          />

          <label>Age Rating:</label>
          <input
            type="text"
            name="age_rating"
            value={anime.age_rating}
            onChange={handleChange}
          />

          <label>Demographic:</label>
          <input
            type="text"
            name="demographic"
            value={anime.demographic}
            onChange={handleChange}
          />

          <label>Season:</label>
          <input
            type="text"
            name="season"
            value={anime.season}
            onChange={handleChange}
          />

          <label>Year:</label>
          <input
            type="text"
            name="year"
            value={anime.year}
            onChange={handleChange}
          />

          <label>Source:</label>
          <input
            type="text"
            name="source"
            value={anime.source}
            onChange={handleChange}
          />

          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={anime.description}
            onChange={handleChange}
          />

          <label>Title Screen:</label>
          <input
            type="text"
            name="title_screen"
            value={anime.title_screen}
            onChange={handleChange}
          />

          <label>Next Season:</label>
          <input
            type="text"
            name="next_season"
            value={anime.next_season}
            onChange={handleChange}
          />

          <label>Previous Season:</label>
          <input
            type="text"
            name="previous_season"
            value={anime.previous_season}
            onChange={handleChange}
          />
          <input type="submit" value="Submit" />
        </form>
      )}
    </div>
  );
};

export default AnimePage;
