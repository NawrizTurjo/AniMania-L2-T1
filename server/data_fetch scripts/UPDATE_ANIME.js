const jikan = require('@mateoaranda/jikanjs');
const express=require("express");
const app=express();
const cors=require("cors");
const pool=require("../db");

var mypw = "123"  // set mypw to the hr schema password
var j=0;

const jikanjs = require('@mateoaranda/jikanjs');

async function fetchData(i) {
    try {
        j=i;
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
    try {var i = 0;
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

        const result = await pool.query(
            `UPDATE ANIME
            SET anime_name=$1, demographic=$2, mal_score=$3, streaming_sites=$4
            WHERE anime_id=$5`,
            [
                data.title,
                demo_name,
                data.score,
                demo_url,
                data.mal_id
            ]
        );
    } catch (error) {
        console.error(`Error inserting data into the database: ${error.message}`);
        // Handle the error appropriately
    }
}


fetchData(0);

