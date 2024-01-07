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
        const response = await jikanjs.loadAnime(new_anime[i],'staff');
        const data = response['data'];
        const length=data.length;
        //console.log(data);

        await insertDataIntoDatabase(data,length,new_anime[i]);
    } catch (error) {
        console.error(`Error fetching or inserting data for anime with ID ${i}: ${error.message}`);
        // You can choose to skip the iteration or handle the error in a different way
    }
    if(i<=41)
    {
        setTimeout(fetchData, 1000, i+1);
    }
}

async function insertDataIntoDatabase(data,length,id) {
    try {


        for(var i=0; i<length; i++)
        {
                var j = 0;
                let demo_name;
                if ( data[i].person && data[i].person.positions && data[i].person.positions[0] && data[i].person.positions[0].length>0) {
                 demo_name = data[i].person.positions[0];
                }
                //  else {
                // demo_name = null;
                // }
                const result = await pool.query(
                `INSERT INTO  staffs(anime_id, staff_id, name, role, profile_picture, gender, date_of_birth, salary )
                VALUES ($1, $2, $3, $4, $5 ,NULL, NULL, 0)`,
                [
                  //data.mal_id,
                  id,
                  data[i].person.mal_id,
                  data[i].person.name,
                  demo_name,
                  data[i].person.images.jpg.image_url
                  //data[i].person.positions[0]
                ]
              );
        }
         
    } catch (error) {
      console.error(`Error inserting data into the database: ${error.message}`);
      // Handle the error appropriately
    }
  }

fetchData(0);
