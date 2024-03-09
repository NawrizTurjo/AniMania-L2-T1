import axios from "axios";
import React, { useEffect, useState } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

export default function AnimeList({ toggleRerender }) {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = localStorage.getItem("user");
  const email = localStorage.getItem("email");

  const date = new Date();

  const getAnimeList = async () => {
    try {
      const animes = await axios.post(
        `http://localhost:3000/userDash/getAnimeList`,
        JSON.stringify({ email }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setAnimeList(animes.data);
      console.log(animes.data);
      setLoading(false);
      console.log(animeList);
      localStorage.setItem("animeList", JSON.stringify(animes.data));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getAnimeList();
  }, []);
  return (
    <>
      <Typography variant="h4" component="h2" gutterBottom>
        My Anime List
      </Typography>
      <ImageList>
        <ImageListItem
          key="Subheader"
          cols={animeList.length >= 10 ? 4 : 2}
          sx={{ height: "auto", width: "auto" }}
        >
          <ListSubheader component="div">{date.getMonth}</ListSubheader>
        </ImageListItem>
        {animeList.map((anime) => (
          <ImageListItem key={anime.anime_id}>
            <Link to={`/watch/anime/episodes/${anime.anime_id}`}>
              <img
                srcSet={`${anime.title_screen}?w=248&fit=crop&auto=format`}
                src={`${anime.title_screen}?w=248&fit=crop&auto=format`}
                alt={anime.anime_name}
                loading="lazy"
                style={{ maxHeight: "300px", maxWidth: "250px" }}
              />
            </Link>
            <ImageListItemBar
              title={anime.anime_name}
              subtitle={
                (anime.anime_type === null ? "" : anime.anime_type) +
                " (" +
                anime.status +
                ")"
              }
              // actionIcon={
              //   <IconButton
              //     sx={{ color: "rgba(255, 255, 255, 0.54)" }}
              //     aria-label={`info about ${anime.title}`}
              //   >
              //     <InfoIcon />
              //   </IconButton>
              // }
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
