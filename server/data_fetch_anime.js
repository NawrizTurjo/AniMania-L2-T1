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
      var i = 0;
      let demo_name;
      if (data.demographics && data.demographics.length > 0) {
          
       demo_name = data.demographics[i].name ?? null;
      } else {
      demo_name = null;
      }
      let demo_url;
      if (data.streaming && data.streaming.length > 0) {
           demo_url = data.streaming[i].url ?? null;
      } else {
          demo_url = null;
      }
        
        //const entry1Name = data.relations.entry && data.relations.entry[1] ? data.relations.entry[1].name : null;
        //const entry2Name = data.relations.entry && data.relations.entry[2] ? data.relations.entry[2].name : null;
         const result = await pool.query(
        `INSERT INTO  anime(anime_id, anime_name, number_of_episodes, "TYPE", age_rating,demographic,season,year,  "SOURCE",
          description,title_screen,next_season,previous_season,mal_score,streaming_sites )
        VALUES ($1, $2, $3, $4, $5 ,$6, $7, $8, $9, $10, $11, NULL, NULL,$12,$13)`,
        [
          data.mal_id,
          data.title,
          data.episodes,
          data.type,
          data.rating,
          //data.demographics[0].name,
          demo_name,
          data.season,
          data.year,
          //data.trailer_url,
          //data.status,
          data.source,
          data.synopsis,
          data.images.jpg.image_url,
          data.score,
          demo_url
          //data.streaming[0].url
          //data.relations[0].entry[0].name,
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
