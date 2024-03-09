import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../pages/pagination3";
import AnimeItem from "../pages/animeItem";
import { useLocation } from "react-router-dom";
import Typewriter from "typewriter-effect";

export default function GetTopAnime({
  forceRerender,
  toggleRerender,
  setProgress,
}) {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const {
    user: routeUser,
    email: routeEmail,
    userRole: routeUserRole,
    img_url: routeImgUrl,
  } = location.state || {};

  const [userEmail, setEmail] = useState(
    routeEmail || localStorage.getItem("email") || ""
  );

  const [userRole, setUserRole] = useState(
    routeUserRole || localStorage.getItem("userRole") || ""
  );

  //let userEmail = localStorage.getItem("email");
  //   let forceRerender = localStorage.getItem("forceRerender");
  //   let toggleRerender = localStorage.getItem("toggleRerender");

  const [currentPage, setCurrentPage] = useState(1);
  const [animePerPage] = useState(10);
  const indexOfLastAnime = currentPage * animePerPage;
  const indexOfFirstAnime = indexOfLastAnime - animePerPage;
  const currentanimes = animes.slice(indexOfFirstAnime, indexOfLastAnime);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getTopAnime = async () => {
    try {
      setLoading(true);
      //const userEmail = userEmail;
      const res = await axios.post(`http://localhost:3000/top100`, {
        userEmail,
      });
      setAnimes(res.data);
      setLoading(false);
      console.log(animes);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTopAnime();
  }, [forceRerender]);

  const [currentPlan, setCurrentPlan] = useState({});

  let update = localStorage.getItem("update");

  let balance = localStorage.getItem("balance");
  let planName = localStorage.getItem("currentPlanName");
  let planEnd = localStorage.getItem("currentPlanEnd");

  const getCurrentPlan = async () => {
    try {
      setLoading(true);
      const getCurrentPlans = await axios.post(
        `http://localhost:3000/getCurrentPlan`,
        { userEmail: userEmail }
      );
      setCurrentPlan(getCurrentPlans.data[0]);
      console.log(getCurrentPlans.data);
      console.log(getCurrentPlans.data[0]);
      localStorage.setItem(
        "currentPlanName",
        getCurrentPlans.data[0].plan_name
      );
      localStorage.setItem(
        "currentPlanEnd",
        getCurrentPlans.data[0].plan_end_date
      );
      localStorage.setItem("balance", getCurrentPlans.data[0].wallet_balance);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getCurrentPlan();
  }, [update]);

  useEffect(() => {
    // Update local state and local storage when user and email change

    //localStorage.setItem("user", user);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("userRole", userRole);
    //localStorage.setItem("img_url", img_url);
  }, [userEmail, userRole]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="row">
      <div className="typewriter">
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
              wrapperClassName: "custom-typewriter",
            }}
          />
        </h4>
      </div>

      <div className="typewriter">
        <h4>
          {" "}
          <Typewriter
            options={{
              strings: ["Top 100 Anime - as rated by our users"],
              autoStart: true,
              loop: true,
              delay: 200,
              deleteSpeed: 15,
              pauseFor: 2000,
              skipAddStyles: true,
              // cursor: "_",
              wrapperClassName: "custom-typewriter-1",
            }}
          />
        </h4>
      </div>

      <section>
        <div className="anime-list-container">
          <AnimeItem
            currentanimes={currentanimes}
            loading={loading}
            forceRerender={forceRerender}
            toggleRerender={toggleRerender}
          />
        </div>
      </section>
      <section className="pagination-container">
        <Pagination
          animePerPage={animePerPage}
          totalAnimes={animes.length}
          paginate={paginate}
          toggleRerender={toggleRerender}
        />
      </section>
    </div>
  );
}

/*
        "anime_id": 54499,
        "anime_name": "mme",
        "number_of_episodes": 12,
        "anime_type": "ONA",
        "age_rating": "PG - Children",
        "demographic": "Shounen",
        "season": "summer",
        "year": 2020,
        "anime_source": "Manga",
        "description": "11111",
        "title_screen": "aa",
        "next_season": null,
        "previous_season": null,
        "streaming_sites": "c",
        "mal_score": 11,
        "genres": "Action",
        "user_id": null,
        "is_favorite": false,
        "status": null  
*/
