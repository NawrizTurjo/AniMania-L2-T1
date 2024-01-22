// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AnimesGenre = ({ id }) => {
//   const [genres, setGenres] = useState([]);
//   const getGenres = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/home",
//         JSON.stringify({ id }),
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );

//     //   console.log(response.data);
//       setGenres(response.data);
//       const concatenatedString = genres
//         .map((genre) => genre.genre_name)
//         .join(", ");
//         // console.log(genres);
//     //   console.log(concatenatedString);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   useEffect(() => {
//     getGenres();
//   }, []);
//   return <p>Genres: {concatenatedString}</p>;
// };

// export default AnimesGenre;
