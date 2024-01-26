
const express = require("express");
//const fetch = require("node-fetch"); // Import node-fetch module
const app = express();
const cors = require("cors");
const pool = require("../db");

var mypw = "123";
const new_anime=[52991,5114,9253,28977,38524,39486,11061,41467,9969,43608,42938,34096,51535,28851,4181,35180,2904,15335,51009,37491,37987,35247,32281,40682,47917,36838,45649,49387,54492,37510,52198,40028,31758,32935,47778,48583,17074,50399,37521,50160,24701,52034,2921
];
var count=0;

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

    if (count <= 41) {
        count++;
        setTimeout(iteration_manga, 1000, new_anime[count + 1]);
    }
}
iteration_manga(new_anime[0]);