// // const test = require ('./test');
// // console.log(test);
// // test.constructor();

// // const data = require('D:/L2-T1/project/simple.json');
// // for(let i=0; i<data['data'].length; i++) {
// //     console.log(data['data'][i].title + " " + data['data'][i]['animeSeason'].year);
// // }

// // Here we define our query as a multi-line string
// // Storing it in a separate .graphql/.gql file is also possible


// // const oracledb = require('oracledb');
// // oracledb.initOracleClient();
// // oracledb.autoCommit = true;
// // oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// const express=require("express");
// const app=express();
// const cors=require("cors");
// const pool=require("../db");

// var mypw = "123"  

// async function iteration_manga(i) {
//     var query = `
//     query ($id:Int) { # Define which variables will be used in the query (id)
//         Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
//         id
//         tags {
//             id
//             name
//             description
//         }
//     }
//     `;

//     // Define our query variables and values that will be used in the query request
//     var variables = {
//         id: i
//     };

//     // Define the config we'll need for our Api request
//     var url = 'https://graphql.anilist.co',
//         options = {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//             },
//             body: JSON.stringify({
//                 query: query,
//                 variables: variables
//             })
//         };

//     // Make the HTTP Api request
//     fetch(url, options).then(handleResponse)
//                     .then(handleData)
//                     .catch(handleError);

//     function handleResponse(response) {
//         return response.json().then(function (json) {
//             return response.ok ? json : Promise.reject(json);
//         });
//     }

//     async function handleData(data) {
//         console.log(123);
//         console.log(data['data']);
//         async function run() {
//             // const connection3 = await oracledb.getConnection ({
//             //     user: '"c##test"',
//             //     password: "test",
//             //     connectString: "0.0.0.0/orcl"
//             // });
//             const result = await pool.query(
//                 `INSERT INTO tag_id_table (anime_id, tag_id)
//                 VALUES (:a_id, :t_id)`, 
//                 [data['data'].id, data['data'].tags.id ]

//             );
//             //await connection3.close();
//             console.log(result);
//         }
//         try {
//             await run();
//         } catch (err) {
//             console.error(err);
//         }
//     }

//     function handleError(error) {
//         return
//         console.log(data['data']);
//         alert('Error, check console');
//         console.error(error);
//     }
//     if(i<10)
//     {
//         setTimeout(iteration_manga, 1000, i+1);
//     }
// }
// iteration_manga(0);

const express = require("express");
//const fetch = require("node-fetch"); // Import node-fetch module
const app = express();
const cors = require("cors");
const pool = require("../db");

var mypw = "123";

async function iteration_manga(i) {
    var query = `
    query ($id:Int) { # Define which variables will be used in the query (id)
        Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
            id
            tags {
                id
                name
                description
            }
        }
    }`; // Fixed GraphQL query syntax by adding a closing curly brace

    var variables = {
        id: i
    };

    var url = 'https://graphql.anilist.co',
        options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };

    fetch(url, options)
        .then(handleResponse)
        .then(handleData)
        .catch(handleError);

    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    async function handleData(data) {
        if (data['data'] && data['data'].Media && data['data'].Media.tags && data['data'].Media.tags.length > 0) {
            const l=data['data'].Media.tags.length ;
            for(var j=0;j<l;j++)
            {
            const tagId = data['data'].Media.tags[j].id;
            const tagName=data['data'].Media.tags[j].name;
            console.log(123);
            console.log(data['data']);
            try {
                const result = await pool.query(
                    `INSERT INTO tags (tag_id, tag_name)
                    VALUES ($1, $2)`,
                    [ tagId, tagName]
                );
                console.log(result);
            } catch (err) {
                console.error(err);
            }
            }
            
        } else {
            console.log("Tags array is empty or undefined.");
        }
    }
    

    function handleError(error) {
        console.error(error); // Log the error
        console.log("Error, check console");
    }

    if (i <= 1500) {
        setTimeout(iteration_manga, 1000, i + 1);
    }
}
iteration_manga(0);
