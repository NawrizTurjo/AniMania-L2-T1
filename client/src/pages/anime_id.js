import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate  } from "react-router-dom";

const AnimePage = ({toggleRerender}) => {
  const [anime, setAnime] = useState({
    anime_name: "",
    number_of_episodes: 0,
    anime_type: "",
    age_rating: "",
    demographic: "",
    season: "",
    year: 0,
    anime_source: "",
    description: "",
    title_screen: "",
    next_season: "",
    previous_season: "",
  });
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const getAnime = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/anime/${id}`);
      setAnime(res.data[0]);
      setLoading(false);
      console.log(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAnime();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnime((prevData) => ({ ...prevData, [name]: value }));
    toggleRerender();
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(`http://localhost:3000/anime/${id}`, JSON.stringify(anime),{
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("Anime updated successfully!",res.data);
      goToHome();
      toggleRerender();
    } catch (error) {
      console.error(error.message);
    }
  };

  const goToHome = () => {
    window.location.href = "/home";
  };
  

  return (
    <div>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Anime Name:</label>
          <input
            anime_type="text"
            name="anime_name"
            value={anime.anime_name}
            onChange={handleChange}
          />

          <label>Number of Episodes:</label>
          <input
            anime_type="text"
            name="number_of_episodes"
            value={anime.number_of_episodes}
            onChange={handleChange}
          />

          <label>Type:</label>
          <input
            anime_type="text"
            name="anime_type"
            value={anime.anime_type}
            onChange={handleChange}
          />

          <label>Age Rating:</label>
          <input
            anime_type="text"
            name="age_rating"
            value={anime.age_rating}
            onChange={handleChange}
          />

          <label>Demographic:</label>
          <input
            anime_type="text"
            name="demographic"
            value={anime.demographic}
            onChange={handleChange}
          />

          <label>Season:</label>
          <input
            anime_type="text"
            name="season"
            value={anime.season}
            onChange={handleChange}
          />

          <label>Year:</label>
          <input
            anime_type="text"
            name="year"
            value={anime.year}
            onChange={handleChange}
          />

          <label>Source:</label>
          <input
            anime_type="text"
            name="anime_source"
            value={anime.anime_source}
            onChange={handleChange}
          />

          <label>Description:</label>
          <input
            anime_type="text"
            name="description"
            value={anime.description}
            onChange={handleChange}
          />

          <label>Thumbnail Url:</label>
          <input
            anime_type="text"
            name="title_screen"
            value={anime.title_screen}
            onChange={handleChange}
          />

          <label>Next Season:</label>
          <input
            anime_type="text"
            name="next_season"
            value={anime.next_season}
            onChange={handleChange}
          />

          <label>Previous Season:</label>
          <input
            anime_type="text"
            name="previous_season"
            value={anime.previous_season}
            onChange={handleChange}
          />
          <input type="submit" value="Submit" onClick={handleSubmit}/>
        </form>
      )}
    </div>
  );
};

export default AnimePage;
