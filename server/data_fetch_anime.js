const jikan = require('@mateoaranda/jikanjs');
const express=require("express");
const app=express();
const cors=require("cors");
const pool=require("./db");

var mypw = "123"  // set mypw to the hr schema password


const jikanjs = require('@mateoaranda/jikanjs');

async function fetchData(i) {
    try {
        const response = await jikanjs.loadAnime(i);
        const data = response['data'];
        //console.log(data);
        

        await insertDataIntoDatabase(data);
    } catch (error) {
        console.error(`Error fetching or inserting data for anime with ID ${i}: ${error.message}`);
        // You can choose to skip the iteration or handle the error in a different way
    }
    if(i<=1500)
    {
        setTimeout(fetchData, 1000, i+1);
    }
    
}


async function insertDataIntoDatabase(data) {
    try {
        
        //const entry1Name = data.relations.entry && data.relations.entry[1] ? data.relations.entry[1].name : null;
        //const entry2Name = data.relations.entry && data.relations.entry[2] ? data.relations.entry[2].name : null;
         const result = await pool.query(
        `INSERT INTO  anime(anime_id, anime_name, number_of_episodes, "TYPE", age_rating,demographic,season,year,  "SOURCE",
          description,title_screen,next_season,previous_season )
        VALUES ($1, $2, $3, $4, $5, NULL ,$6, $7, $8, $9, $10, NULL, NULL)`,
        [
          data.mal_id,
          data.title_english,
          data.episodes,
          data.type,
          data.rating,
          data.season,
          data.year,
          //data.trailer_url,
          //data.status,
          data.source,
          data.synopsis,
          data.images.jpg.image_url,
          //data.relations[0].relation,
          //data.relations[1].relation
          //"post",
          //"pre"
          //entry1Name,
          //entry2Name
        ]
      );
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
