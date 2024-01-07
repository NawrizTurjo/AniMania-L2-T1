const jikan = require('@mateoaranda/jikanjs');
const express=require("express");
const app=express();
const cors=require("cors");
const pool=require("./db");

var mypw = "123"  // set mypw to the hr schema password


const jikanjs = require('@mateoaranda/jikanjs');
const new_anime=[52991,5114,9253,28977,38524,39486,11061,41467,9969,43608,42938,34096,51535,28851,4181,35180,2904,15335,51009,37491,37987,35247,32281,40682,47917,36838,45649,49387,54492,37510,52198,40028,31758,32935,47778,48583,17074,50399,37521,50160,24701,52034,2921
];


async function fetchData(i) {
    try {
        const response = await jikanjs.loadAnime(new_anime[i]);
        const data = response['data'];
        //console.log(data);
        

        await insertDataIntoDatabase(data);
    } catch (error) {
        console.error(`Error fetching or inserting data for anime with ID ${i}: ${error.message}`);
        // You can choose to skip the iteration or handle the error in a different way
    }
    if(i<=41)
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

fetchData(0);
