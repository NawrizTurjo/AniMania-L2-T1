import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import GenreAnimes from "./genre_id";
import GenrePage from "./genrePage";
import Test from "./test";
import Loader from "./loader.js";
import { motion } from "framer-motion/dist/framer-motion";

const Genre = ({ setProgress }) => {
  const [loading, setLoading] = useState(true);
  const [genre, setGenre] = useState([]);

  useEffect(() => {
    setProgress(10);

    axios
      .get(`http://localhost:3000/genre`)
      .then((res) => {
        // console.log(res.data);
        setGenre(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(() => {
      setProgress(100);
    }, 1000);
  }, []);
  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <h1>Genre</h1>
      <table className="table table-striped d-flex justify-content-center">
        <thead>
          {/* <tr>
            <th>Genre ID</th>
            <th>Genre Name</th>
          </tr> */}
        </thead>
        <tbody>
          {genre.map((genre) => (
            <React.Fragment key={genre.genre_id}>
              {/* <tr>
                <td>{genre.genre_id}</td>
                <td>
                  <Link to={`http://localhost:3001/genre/${genre.genre_id}`}>{genre.genre_name}</Link>
                </td>
              </tr> */}
              <tr>
                <td colSpan="2">
                  <GenrePage id={genre.genre_id} name={genre.genre_name} />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Genre;
