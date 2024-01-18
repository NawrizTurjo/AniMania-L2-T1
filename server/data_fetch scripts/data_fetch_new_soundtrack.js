const jikan = require('@mateoaranda/jikanjs');
const express=require("express");
const app=express();
const cors=require("cors");
const pool=require("../db");

var mypw = "123"  // set mypw to the hr schema password


const jikanjs = require('@mateoaranda/jikanjs');
const new_anime=[52991,5114,9253,28977,38524,39486,11061,41467,9969,43608,42938,34096,51535,28851,4181,35180,2904,15335,51009,37491,37987,35247,32281,40682,47917,36838,45649,49387,54492,37510,52198,40028,31758,32935,47778,48583,17074,50399,37521,50160,24701,52034,2921
];

// async function fetchData(i) {
//     try {
//         //const response = await jikanjs.loadAnime(i);
//         //const data = response['data'];
//         //const length1=response["data"]['theme']['openings'].length;
//         //const length2=data.theme.endings.length;
//         //console.log(data);



//         const response = await jikan.loadAnime(i);
//         const data = response['data'];

//         if (data && data.theme && data.theme.openings && data.theme.openings.length > 0) {
//             //await insertDataIntoDatabase(data, 'openings');
//             await insertDataIntoDatabase(data);
//         }
//         await insertDataIntoDatabase(data);

//         // if (data && data.theme && data.theme.endings && data.theme.endings.length > 0) {
//         //     //await insertDataIntoDatabase(data, 'endings');
//         // }
        

        
//     } catch (error) {
//         console.error(`Error fetching or inserting data for anime with ID ${i}: ${error.message}`);
//         // You can choose to skip the iteration or handle the error in a different way
//     }
//     if(i<=1)
//     {
//         setTimeout(fetchData, 1000, i+1);
//     }
    
// }

// CREATE TABLE SOUND_TRACKS (
//     ANIME_ID INT REFERENCES ANIME(ANIME_ID),
//     --MUSIC_ID INT,
//     TITLE VARCHAR(255),
//     BAND VARCHAR(255)
//     --PRIMARY KEY(ANIME_ID,MUSIC_ID)
// );

let arrayWithLength = new Array(1501); // creates an array with length 5, but all elements are initially undefined



iterator(0);

function iterator(i) {
    //const jikanjs = require("@mateoaranda/jikanjs");

    if (i <= 41) {
        jikan.loadAnime(new_anime[i], 'full').then((response) => {
            if (response && response['data'] && response['data']['theme'] && response['data']['theme']['openings'] && response['data']['theme']['openings'].length > 0) {
                console.log(response['data']['theme']['openings'][0]);
                arrayWithLength[i]=response['data']['theme']['openings'][0];
                insertDataIntoDatabase(new_anime[i],arrayWithLength[i]);
            } else {
                console.log(`No valid data for index ${i}`);
                //arrayWithLength[i]=null;
            }
        }).catch((error) => {
            console.error(`Error fetching data for index ${i}: ${error.message}`);
            //arrayWithLength[i]=null;
        });

        setTimeout(iterator,1000, i + 1);
    }
}

// for(var i=1;i<15;i++)
// {
//     if(arrayWithLength[i]!==null)
//     {
//         console.log('ok');
//         insertDataIntoDatabase(i,arrayWithLength[i]);
//     }
    
// }


async function insertDataIntoDatabase(i,data) {
    try {
        
        //var i = 0;
        //let demo_name;
        //if (data.demographics && data.demographics.length > 0) {
            
         //demo_name = data.theme.openings[i] ?? null;
       // } else {
        //demo_name = null;
        //}



        //for(var i=0;i<1;i++)
        //{
            const result = await pool.query(
                `INSERT INTO  sound_tracks(anime_id, title, band)
                VALUES ($1, $2, NULL)`,
                [
                    i,
                    data
                  //data.mal_id,
                  //data.theme.openings[i]
                  //demo_name
                ]  );
        //}
        // for(var i=0;i<1;i++)
        // {
        //     const result2 = await pool.query(
        //         `INSERT INTO  sound_tracks(anime_id, title, band)
        //         VALUES ($1, $2, NULL)`,
        //         [
        //           data.mal_id,
        //           data.theme.endings[i]
        //         ]);  
        // }

         
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

//fetchData(1);

// app.use(cors());
// app.use(express.json());

// app.listen(5001, () =>
// {
//     console.log("started...");
// });
