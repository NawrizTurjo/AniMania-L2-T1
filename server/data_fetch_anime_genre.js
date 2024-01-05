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
        const length=data.genres.length;
        //console.log(data);
        

        await insertDataIntoDatabase(data,length);
    } catch (error) {
        console.error(`Error fetching or inserting data for anime with ID ${i}: ${error.message}`);
        // You can choose to skip the iteration or handle the error in a different way
    }
    if(i<=1500)
    {
        setTimeout(fetchData, 1000, i+1);
    }
    
}


async function insertDataIntoDatabase(data,length) {
    try {
        for(var i=0;i<length;i++)
        {
            const result = await pool.query(
                `INSERT INTO genre_anime_relationship(genre_id,anime_id )
                VALUES ($1, $2)`,
                [
                    data.genres[i].mal_id,
                    data.mal_id
                ]
              );
        }
        
    } catch (error) {
      console.error(`Error inserting data into the database: ${error.message}`);
      // Handle the error appropriately
    }
  }

fetchData(1);

