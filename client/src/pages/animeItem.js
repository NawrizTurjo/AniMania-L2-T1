import React from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';

const AnimeListItem = ({
  title,
  ep,
  anime_type,
  age_rating,
  demo,
  season,
  yr,
  thumbnail,
  id,
}) => (
  <li className="list-group-item align-items-center">
    {thumbnail && (
      <img src={thumbnail} alt={`${title} Thumbnail`} className="thumbnail" />
    )}

    <h6>{title}</h6>
    <p>
      Num of episodes: {ep != null ? ep : "N/A"} | Type:{" "}
      {anime_type != null ? anime_type : "N/A"} |{" "}
      {age_rating != null ? age_rating : "N/A"}
    </p>
    <p>Demographic: {demo != null ? demo : "N/A"}</p>
    <p>
      Season: {season != null ? season : "N/A"} | Year:{" "}
      {yr != null ? yr : "N/A"}
    </p>
    {/* <button className="btn btn-primary">Edit</button>
    <button className="btn btn-primary">Delete</button> */}
    <Stack direction="row" spacing={10}>
    <a href={`http://localhost:3001/anime/${id}`}>
      <Button variant="outlined" color="secondary" startIcon={<EditIcon />}>Edit</Button>
    </a>
      <Button  color="secondary" ><FavoriteIcon /></Button>
      <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>Delete</Button>
    </Stack>
  </li>
);

const AnimeItem = ({ currentanimes, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <ul className="list-group list-group-horizontal-md flex-row flex-wrap">
      {currentanimes.map((anime, index) => (
        <AnimeListItem
          key={index}
          title={anime.anime_name}
          ep={anime.number_of_episodes}
          anime_type={anime.anime_type}
          age_rating={anime.age_rating}
          demo={anime.demographic}
          season={anime.season}
          yr={anime.year}
          thumbnail={anime.title_screen}
          id={anime.anime_id}
        />
      ))}
    </ul>
  );
};

export default AnimeItem;
