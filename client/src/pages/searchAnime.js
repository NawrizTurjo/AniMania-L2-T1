import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./pagination2";
import AnimeItem from "./animeItem";
//import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion/dist/framer-motion";
import Typewriter from "typewriter-effect";

export default function SearchAnime({ forceRerender }) {
  const location = useLocation();
  const { searchTerm } = location.state || {};

  //const { user: routeUser, email: routeEmail } = location.state || {};

  // Use local state to store user information
  //const [user, setUser] = useState(routeUser || localStorage.getItem("user") || "");
  //const [email, setEmail] = useState(routeEmail || localStorage.getItem("email") || "");
  //const { username } = useParams();
  const [animes, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [animePerPage] = useState(10);

  const email = localStorage.getItem("email");

  const getAnime = async () => {
    try {
      if (!searchTerm) {
        // Handle the case when searchTerm is undefined or empty
        return;
      }
      console.log(searchTerm);
      setLoading(true);
      console.log(email);
      const userEmail = email;
      const res = await axios.post("http://localhost:3000/searchAnime", {
        userEmail,
        searchTerm,
      });
      setAnime(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getAnime();
  }, [forceRerender]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     setLoading(true);
  //     const res = await axios.get("https://jsonplaceholder.typicode.com/posts");
  //     setPosts(res.data);
  //     setLoading(false);
  //   };

  //   fetchPosts();
  // }, []);

  // Get current posts
  //   useEffect(() => {
  //     // Update local state and local storage when user and email change
  //     localStorage.setItem("user", user);
  //     localStorage.setItem("email", email);
  //   }, [user, email]);
  const indexOfLastAnime = currentPage * animePerPage;
  const indexOfFirstAnime = indexOfLastAnime - animePerPage;
  const currentanimes = animes.slice(indexOfFirstAnime, indexOfLastAnime);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // return (
  //   <div className="container mt-5">
  //     <h1 className="text-primary mb-3">My Blog</h1>
  //     <Posts animes={currentanimes} loading={loading} />
  //     <Pagination
  //       animePerPage={animePerPage}
  //       totalAnimes={posts.length}
  //       paginate={paginate}
  //     />
  //   </div>
  // );

  return (
    <motion.div
      className="Home-div container-fluid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <h4>
        {" "}
        <Typewriter
          options={{
            strings: [
              "Unlock the Magic of Animation - where stories unfold, emotions ignite, and worlds come alive",
            ],
            autoStart: true,
            loop: true,
            delay: 50,
            deleteSpeed: 20,
            pauseFor: 2000,
            skipAddStyles: true,
            // cursor: "_",
          }}
          // className=""
        />
      </h4>
      {/* <h1>Hello {user}!</h1>
      <h1>Email: {email}</h1> */}
      <h1>
        {"Search Results for:"}
        <Typewriter
          options={{
            strings: [searchTerm],
            autoStart: true,
            loop: true,
            delay: 100,
            deleteSpeed: 200,
            pauseFor: 2000,
            skipAddStyles: true,

            // cursor: "_",
          }}
          // className=""
        />
      </h1>
      <img
        src="./images/AniMania.png"
        alt="AniMania Logo"
        className="logo img-fluid"
      />
      <div className="row">
        {/* <section className="col-md-6 upper-part">
          <div className="card-container">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="card bg-light p-3 mt-3">
                <h6>{`Card ${index + 1} Title`}</h6>
                <p>{`This is the description for Card ${index + 1}`}</p>
              </div>
            ))}
          </div>
        </section> */}
        <section>
          <div className="anime-list-container">
            <AnimeItem currentanimes={currentanimes} loading={loading} />
          </div>
        </section>
        <section className="pagination-container">
          <Pagination
            animePerPage={animePerPage}
            totalAnimes={animes.length}
            paginate={paginate}
          />
        </section>
        {/* <section className="col-md-6 watched-anime-part" style={{ float: 'left' }}>
          <div className="watch-history-container">
            <ul className="anime-list">
              {[...Array(10)].map((_, index) => (
                <AnimeListItem key={index} title={`Watched Anime ${index + 1}`} description="Watched this recently" />
              ))}
            </ul>
          </div>
        </section> */}
      </div>
    </motion.div>
  );
}
