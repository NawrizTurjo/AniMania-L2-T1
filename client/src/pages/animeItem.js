import React from "react";

const AnimeListItem = ({
  title,
  ep,
  type,
  age_rating,
  demo,
  season,
  yr,
  thumbnail,
  id,
}) => (
  <li className="anime-list-item">
    <a href={`http://localhost:3001/anime/${id}`}>
      {thumbnail && (
        <img src={thumbnail} alt={`${title} Thumbnail`} className="thumbnail" />
      )}
    </a>
    <h6>{title}</h6>
    <p>
      Num of episodes: {ep != null ? ep : "N/A"} | Type:{" "}
      {type != null ? type : "N/A"} | {age_rating != null ? age_rating : "N/A"}
    </p>
    <p>Demographic: {demo != null ? demo : "N/A"}</p>
    <p>
      Season: {season != null ? season : "N/A"} | Year:{" "}
      {yr != null ? yr : "N/A"}
    </p>
  </li>
);

const AnimeItem =({currentanimes,loading})=>{
    if(loading){
        return <h2>Loading...</h2>
    }

    return(
        <ul className="anime-list">
              {currentanimes.map((anime, index) => (
                <AnimeListItem
                  key={index}
                  title={anime.anime_name}
                  ep={anime.number_of_episodes}
                  type={anime.type}
                  age_rating={anime.age_rating}
                  demo={anime.demographic}
                  season={anime.season}
                  yr={anime.year}
                  thumbnail={anime.title_screen}
                  id={anime.anime_id}
                />
              ))}
        </ul>
    )
}

export default AnimeItem;