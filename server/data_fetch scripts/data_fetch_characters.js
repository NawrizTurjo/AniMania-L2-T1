const jikan = require('@mateoaranda/jikanjs');
const express=require("express");
const app=express();
const cors=require("cors");
const pool=require("../db");

var mypw = "123"  // set mypw to the hr schema password


const jikanjs = require('@mateoaranda/jikanjs');
var j=0;

async function fetchData(i) {
    try {
        j=i;
        const response = await jikanjs.loadAnime(i,'characters');
        const data = response['data'];
        const length=data.length;
        //console.log(data);
        

        await insertDataIntoDatabase(data,length);
    } catch (error) {
        console.error(`Error fetching or inserting data for genre with ID ${i}: ${error.message}`);
        // You can choose to skip the iteration or handle the error in a different way
    }
    if(i<=1500)
    {
        setTimeout(fetchData, 1000, i+1);
    }
    
}

// ANIME_ID INT REFERENCES ANIME(ANIME_ID),
//     CHARACTER_ID INT,
//     CHARACTER_NAME VARCHAR(250),
//     "ROLE" VARCHAR(250),


async function insertDataIntoDatabase(data,length) {
    try {
            for(var i=0;i<length;i++)
            {
                const result = await pool.query(
                    `INSERT INTO  characters(character_id,character_name,"ROLE",gender,profile_picture )
                    VALUES ($1, $2, $3, NULL, NULL)`,
                    [
                      data[i].character.mal_id,
                      data[i].character.name,
                      data[i].role
                    ]
                  );
                
                //   const result2 = await pool.query(
                //     `INSERT INTO  character_anime_relationship(anime_id,character_id )
                //     VALUES ($1, $2)`,
                //     [
                //       j,
                //       data[i].character.mal_id
                //     ]
                //   );
                    
            }
            
         
    } catch (error) {
      console.error(`Error inserting data into the database: ${error.message}`);
      // Handle the error appropriately
    }
  }

fetchData(0);
