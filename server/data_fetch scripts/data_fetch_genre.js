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
        const response = await jikanjs.loadGenres('anime');
        const data = response['data'];
        console.log(data);
        

        await insertDataIntoDatabase(data);
    } catch (error) {
        console.error(`Error fetching or inserting data for genre with ID ${i}: ${error.message}`);
        // You can choose to skip the iteration or handle the error in a different way
    }
    if(i<=85)
    {
        setTimeout(fetchData, 1000, i+1);
    }
    
}


async function insertDataIntoDatabase(data) {
    try {
        
        //const entry1Name = data.relations.entry && data.relations.entry[1] ? data.relations.entry[1].name : null;
        //const entry2Name = data.relations.entry && data.relations.entry[2] ? data.relations.entry[2].name : null;
        //if (data[0].mal_id>0)
        //{
            const result = await pool.query(
                `INSERT INTO  genres(genre_id, genre_name )
                VALUES ($1, $2)`,
                [
                  data[j].mal_id,
                  data[j].name
                ]
              );
        //}
         
    } catch (error) {
      console.error(`Error inserting data into the database: ${error.message}`);
      // Handle the error appropriately
    }
  }

fetchData(0);
