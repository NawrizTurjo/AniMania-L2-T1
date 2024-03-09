import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import GenreAnimes from "./genre_id";
import GenrePage from "./genrePage";
import Test from "./test";
import Loader from "./loader.js";
import { motion } from "framer-motion/dist/framer-motion";

import styled, { keyframes } from "styled-components";

const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shadowAnimation = keyframes`
  0% {
    text-shadow: none;
  }
  50% {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.5);
  }
  100% {
    text-shadow: none;
  }
`;

const colorAnimation = keyframes`
  0% {
    color: #4568dc;
  }
  50% {
    color: #b06ab3;
  }
  100% {
    color: #4568dc;
  }
`;

const PlanHeading = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeInAnimation} 1s ease-in-out,
    ${shadowAnimation} 3s ease-in-out infinite,
    ${colorAnimation} 5s ease-in-out infinite;
`;

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
      <PlanHeading>Genres</PlanHeading>
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
