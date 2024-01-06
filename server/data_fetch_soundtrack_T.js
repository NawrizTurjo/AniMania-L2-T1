const jikan = require("@mateoaranda/jikanjs");
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

var mypw = "123"; // set mypw to the hr schema password

const jikanjs = require("@mateoaranda/jikanjs");

async function fetchData(i) {
  try {
    const response = await jikanjs.loadAnime(i);
    const data = response["data"];
    // const length1=response["data"]['theme']['openings'].length;
    //const length2=data.theme.endings.length;
    //console.log(data);

    await insertDataIntoDatabase(data);
  } catch (error) {
    console.error(
      `Error fetching or inserting data for anime with ID ${i}: ${error.message}`
    );
    // You can choose to skip the iteration or handle the error in a different way
  }
  if (i <= 1) {
    setTimeout(fetchData, 1000, i + 1);
  }
}

// CREATE TABLE SOUND_TRACKS (
//     ANIME_ID INT REFERENCES ANIME(ANIME_ID),
//     --MUSIC_ID INT,
//     TITLE VARCHAR(255),
//     BAND VARCHAR(255)
//     --PRIMARY KEY(ANIME_ID,MUSIC_ID)
// );

async function insertDataIntoDatabase(data) {
  try {
    //var i = 0;
    //let demo_name;
    //if (data.demographics && data.demographics.length > 0) {

    //demo_name = data.theme.openings[i] ?? null;
    // } else {
    //demo_name = null;
    //}

    for (var i = 0; i < 1; i++) {
      const result = await pool.query(
        `INSERT INTO  sound_tracks(anime_id, title, band)
                VALUES ($1, $2, NULL)`,
        [
          data.mal_id,
          data.theme.openings[i],
          //demo_name
        ]
      );
    }
    for (var i = 0; i < 1; i++) {
      const result2 = await pool.query(
        `INSERT INTO  sound_tracks(anime_id, title, band)
                VALUES ($1, $2, NULL)`,
        [data.mal_id, data.theme.endings[i]]
      );
    }

    //data.relations[0].entry[0].name,
    //data.relations[1].relation
    //"post",
    //"pre"
    //entry1Name,
    //entry2Name
  } catch (error) {
    console.error(`Error inserting data into the database: ${error.message}`);
    // Handle the error appropriately
  }
}

fetchData(1);

// app.use(cors());
// app.use(express.json());

// app.listen(5001, () =>
// {
//     console.log("started...");
// });
