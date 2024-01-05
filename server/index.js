const express=require("express");
const app=express();
const cors=require("cors");
const pool=require("./db");


//--------------------------------------creating user

app.post("/users", async (req, res) => {
    try {
        const { user_name, password, email, role, bio, most_favourite_anime, first_access, last_access, active_time } = req.body;

        const newUser = await pool.query(
            "INSERT INTO person (user_name, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id",
            [user_name, password, email, role]
        );

        const userId = newUser.rows[0].id;

        await pool.query(
            "INSERT INTO user (user_id, bio, most_favourite_anime, first_access, last_access, active_time) VALUES ($1, $2, $3, $4, $5, $6)",
            [userId, bio, most_favourite_anime, first_access, last_access, active_time]
        );

        res.json("User created successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//---------------------------------------------creating moderator

app.post("/moderators", async (req, res) => {
    try {
        const { user_name, password, email, role, added_series, deleted_series, added_episodes, deleted_episodes, review_verifications, filtered_comments } = req.body;

        const newModerator = await pool.query(
            "INSERT INTO person (user_name, password, email, role) VALUES ($1, $2, $3, $4) RETURNING id",
            [user_name, password, email, role]
        );

        const moderatorId = newModerator.rows[0].id;

        await pool.query(
            "INSERT INTO moderator (moderator_id, added_series, deleted_series, added_episodes, deleted_episodes, review_verifications, filtered_comments) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [moderatorId, added_series, deleted_series, added_episodes, deleted_episodes, review_verifications, filtered_comments]
        );

        res.json("Moderator created successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------updating user

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { bio, most_favourite_anime, first_access, last_access, active_time } = req.body;

        const updateUser = await pool.query(
            "UPDATE user SET bio = $1, most_favourite_anime = $2, first_access = $3, last_access = $4, active_time = $5 WHERE user_id = $6",
            [bio, most_favourite_anime, first_access, last_access, active_time, id]
        );

        res.json("User updated successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//------------------------------------------------updating moderator

app.put("/moderators/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { added_series, deleted_series, added_episodes, deleted_episodes, review_verifications, filtered_comments } = req.body;

        const updateModerator = await pool.query(
            "UPDATE moderator SET added_series = $1, deleted_series = $2, added_episodes = $3, deleted_episodes = $4, review_verifications = $5, filtered_comments = $6 WHERE moderator_id = $7",
            [added_series, deleted_series, added_episodes, deleted_episodes, review_verifications, filtered_comments, id]
        );

        res.json("Moderator updated successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//-----------------------------------------------creating anime
// ANIME_ID INT PRIMARY KEY ,
// ANIME_NAME VARCHAR(255),
// NUMBER_OF_EPISODES INT,
// "TYPE" VARCHAR(255),
// AGE_RATING VARCHAR(255),
// --{Genre}
// DEMOGRAPHIC VARCHAR(255),
// --{Tags}
// SEASON VARCHAR(255),
// YEAR INT,
// --User_rating()
// "SOURCE" VARCHAR(255), 
// DESCRIPTION VARCHAR(4000),
// TITLE_SCREEN VARCHAR(250),
// NEXT_SEASON VARCHAR(250),
// PREVIOUS_SEASON VARCHAR(250)

// app.post("/animania/:ANIME_ID/:ANIME_NAME/:NUMBER_OF_EPISODES/:TYPE/:AGE_RATING/:DEMOGRAPHIC/:SEASON/:YEAR/:SOURCE/:DESCRIPTION/:TITLE_SCREEN/NEXT_SEASON/PREVIOUS_SESAON",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const ANIME_NAME=req.params.ANIME_NAME;
//         const NUMBER_OF_EPISODES=req.params.NUMBER_OF_EPISODES;
//         const TYPE=req.params.TYPE;
//         const AGE_RATING=req.params.AGE_RATING;
//         const DEMOGRAPHIC=req.params.DEMOGRAPHIC;
//         const SEASON=req.params.SEASON;
//         const YEAR=req.params.YEAR;
//         const SOURCE=req.params.SOURCE;
//         const DESCRIPTION=req.params.DESCRIPTION;
//         const TITLE_SCREEN=req.params.TITLE_SCREEN;
//         const NEXT_SEASON=req.params.NEXT_SEASON;
//         const PREVIOUS_SEASON=req.params.PREVIOUS_SEASON;
//         const new_anime= await pool.query(
//             "INSERT INTO ANIME(ANIME_ID,ANIME_NAME,NUMBER_OF_EPISODES,TYPE,AGE_RATING,DEMOGRAPHIC,SEASON,YEAR,SOURCE,DESCRIPTION,TITLE_SCREEN,NEXT_SEASON,PREVIOUS_SEASON)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *",
//                 [ANIME_ID,ANIME_NAME,NUMBER_OF_EPISODES,TYPE,AGE_RATING,DEMOGRAPHIC,SEASON,YEAR,SOURCE,DESCRIPTION,TITLE_SCREEN,NEXT_SEASON,PREVIOUS_SEASON]
                
//         );
//         res.json(new_anime.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });



//-----------------------------------------------------------------CREATING TAGS

// app.post("/animania/:TAG_ID/:TAG_NAME",async(req,res) =>{
//     try {
//         const TAG_ID=req.params.TAG_ID;
//         const TAG_NAME=req.params.TAG_NAME;
//         const new_tag= await pool.query(
//             "INSERT INTO TAGS(TAG_ID,TAG_NAME)VALUES($1,$2) RETURNING *",
//                 [TAG_ID,TAG_NAME]   
//         );
//         res.json(new_tag.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//----------------------------------------------------------------CREATING TAG-ID-TABLE

// app.post("/animania/:ANIME_ID/:TAG_ID",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const TAG_ID=req.params.TAG_ID;
//         const new_tag_id_table= await pool.query(
//             "INSERT INTO TAG_ID_TABLE(ANIME_ID,TAG_ID)VALUES($1,$2) RETURNING *",
//                 [ANIME_ID,TAG_ID]   
//         );
//         res.json(new_tag_id_table.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//-----------------------------------------------------------------CREATING GENRES

// app.post("/animania/:ANIME_ID/:GENRE_NAME",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const GENRE_NAME=req.params.GENRE_NAME;
//         const new_genre= await pool.query(
//             "INSERT INTO GENRES(ANIME_ID,GENRE_NAME)VALUES($1,$2) RETURNING *",
//                 [ANIME_ID,GENRE_NAME]   
//         );
//         res.json(new_genre.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//-----------------------------------------------------------------CREATING STAFFS

// ANIME_ID INT REFERENCES ANIME(ANIME_ID),
//     STAFF_ID INT,
//     NAME VARCHAR(255),
//     ROLE VARCHAR(255),
//     PROFILE_PICTURE VARCHAR(255),
//     GENDER VARCHAR(10),
//     DATE_OF_BIRTH DATE,
//     SALARY INT,
//     SPECIALIZATION VARCHAR(255),
//     PRIMARY KEY(ANIME_ID,STAFF_ID)

// app.post("/animania/:ANIME_ID/:STAFF_ID/:NAME/:ROLE/:PROFILE_PICTURE/:GENDER/:DATE_OF_BIRTH/:SALARY/:SPECIALIZATION",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const STAFF_ID=req.params.STAFF_ID;
//         const NAME=req.params.NAME;
//         const ROLE=req.params.ROLE;
//         const PROFILE_PICTURE=req.params.PROFILE_PICTURE;
//         const GENDER=req.params.GENDER;
//         const DATE_OF_BIRTH=req.params.DATE_OF_BIRTH;
//         const SALARY=req.params.SALARY;
//         const SPECIALIZATION=req.params.SPECIALIZATION;
//         const new_staff= await pool.query(
//             "INSERT INTO STAFFS(ANIME_ID,STAFF_ID,NAME,ROLE,PROFILE_PICTURE,GENDER,DATE_OF_BIRTH,SALARY,SPECIALIZATION)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
//                 [ANIME_ID,STAFF_ID,NAME,ROLE,PROFILE_PICTURE,GENDER,DATE_OF_BIRTH,SALARY,SPECIALIZATION]   
//         );
//         res.json(new_staff.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//----------------------------------------------------------CREATING CHARACTERS

// ANIME_ID INT REFERENCES ANIME(ANIME_ID),
//     CHARACTER_ID INT,
//     CHARACTER_NAME VARCHAR(250),
//     "ROLE" VARCHAR(250),
//     GENDER VARCHAR(250),
//     PROFILE_PICTURE VARCHAR(250),

// app.post("/animania/:ANIME_ID/:CHARACTER_ID/:CHARACTER_NAME/:ROLE/:GENDER/:PROFILE_PICTURE",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const CHARACTER_ID=req.params.CHARACTER_ID;
//         const CHARACTER_NAME=req.params.CHARACTER_NAME;
//         const ROLE=req.params.ROLE;
//         const GENDER=req.params.GENDER;
//         const PROFILE_PICTURE=req.params.PROFILE_PICTURE;
//         const new_character= await pool.query(
//             "INSERT INTO CHARACTERS(ANIME_ID,CHARACTER_ID,CHARACTER_NAME,ROLE,GENDER,PROFILE_PICTURE)VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
//                 [ANIME_ID,CHARACTER_ID,CHARACTER_NAME,ROLE,GENDER,PROFILE_PICTURE]   
//         );
//         res.json(new_character.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//-------------------------------------------------------------------------CREATING STUDIO

// STUDIO_ID INT PRIMARY KEY,
//     STUDIO_NAME VARCHAR(255),
//     BUDGET INT,
//     REVENUE INT,
//     NO_OF_EMPLOYEES INT,
//     COUNTRY VARCHAR(255)

// app.post("/animania/:STUDIO_ID/:STUDIO_NAME/:BUDGET/:REVENUE/:NO_OF_EMPLOYEES/:COUNTRY",async(req,res) =>{
//     try {
//         const STUDIO_ID=req.params.STUDIO_ID;
//         const STUDIO_NAME=req.params.STUDIO_NAME;
//         const BUDGET=req.params.BUDGET;
//         const REVENUE=req.params.REVENUE;
//         const NO_OF_EMPLOYEES=req.params.NO_OF_EMPLOYEES;
//         const COUNTRY=req.params.COUNTRY;
//         const new_studio= await pool.query(
//             "INSERT INTO STUDIO(STUDIO_ID,STUDIO_NAME,BUDGET,REVENUE,NO_OF_EMPLOYEES,COUNTRY)VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
//                 [STUDIO_ID,STUDIO_NAME,BUDGET,REVENUE,NO_OF_EMPLOYEES,COUNTRY]   
//         );
//         res.json(new_studio.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//--------------------------------------------------------------------CREATING ANIME STUDIO RELATIONSHIP

// ANIME_ID INT REFERENCES ANIME(ANIME_ID),
//     STUDIO_ID INT REFERENCES STUDIO(STUDIO_ID)

// app.post("/animania/:ANIME_ID/:STUDIO_ID",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const STUDIO_ID=req.params.STUDIO_ID;
//         const new_anime_studio_relationship= await pool.query(
//             "INSERT INTO ANIME_STUDIO_RELATIONSHIP(ANIME_ID,STUDIO_ID)VALUES($1,$2) RETURNING *",
//                 [ANIME_ID,STUDIO_ID]   
//         );
//         res.json(new_anime_studio_relationship.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//----------------------------------------------------------------CREATING EPISODES

// ANIME_ID INT REFERENCES ANIME(ANIME_ID),
//     EPISODE_NO INT,
//     EPISODE_TITLE VARCHAR(255),
//     THUMBNAIL VARCHAR(255),
//     "LENGTH" VARCHAR(255), 
//     --"VIEWS" INT,
//     RELEASE_DATE DATE,
//     AVAILABILITY VARCHAR(255),
//     STREAMING_SITES VARCHAR(255),


// app.post("/animania/:ANIME_ID/:EPISODE_NO/:EPISODE_TITLE/:THUMBNAIL/:LENGTH/:RELEASE_DATE/:AVAILABILITY/:STREAMING_SITES",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const EPISODE_NO=req.params.EPISODE_NO;
//         const EPISODE_TITLE=req.params.EPISODE_TITLE;
//         const THUMBNAIL=req.params.THUMBNAIL;
//         const LENGTH=req.params.LENGTH;
//         const RELEASE_DATE=req.params.RELEASE_DATE;
//         const AVAILABILITY=req.params.AVAILABILITY;
//         const STREAMING_SITES=req.params.STREAMING_SITES;
//         const new_episode= await pool.query(
//             "INSERT INTO EPISODES(ANIME_ID,EPISODE_NO,EPISODE_TITLE,THUMBNAIL,LENGTH,RELEASE_DATE,AVAILABILITY,STREAMING_SITES)VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
//                 [ANIME_ID,EPISODE_NO,EPISODE_TITLE,THUMBNAIL,LENGTH,RELEASE_DATE,AVAILABILITY,STREAMING_SITES]   
//         );
//         res.json(new_episode.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//------------------------------------------------------------CREATING SUBTITLES

// ANIME_ID INT,
//     EPISODE_NO INT,
//     SUBTITLE_ID INT,
//     LANGUAGE VARCHAR(255),
//     CREATOR VARCHAR(255),
//     URL VARCHAR(255),


// app.post("/animania/:ANIME_ID/:EPISODE_NO/:SUBTITLE_ID/:LANGUAGE/:CREATOR/:URL",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const EPISODE_NO=req.params.EPISODE_NO;
//         const SUBTITLE_ID=req.params.SUBTITLE_ID;
//         const LANGUAGE=req.params.LANGUAGE;
//         const CREATOR=req.params.CREATOR;
//         const URL=req.params.URL;
//         const new_subtitle= await pool.query(
//             "INSERT INTO EPISODES(ANIME_ID,EPISODE_NO,SUBTITLE_ID,LANGUAGE,CREATOR,URL)VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
//                 [ANIME_ID,EPISODE_NO,SUBTITLE_ID,LANGUAGE,CREATOR,URL]   
//         );
//         res.json(new_subtitle.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//----------------------------------------------------------------CREATING SOUND_TRACK

// CREATE TABLE SOUND_TRACKS (
//     ANIME_ID INT REFERENCES ANIME(ANIME_ID),
//     MUSIC_ID INT,
//     TITLE VARCHAR(255),
//     BAND VARCHAR(255),
//     PRIMARY KEY(ANIME_ID,MUSIC_ID)
// );

// app.post("/animania/:ANIME_ID/:MUSIC_ID/:TITLE/:BAND",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const MUSIC_ID=req.params.MUSIC_ID;
//         const TITLE=req.params.TITLE;
//         const BAND=req.params.BAND;
//         const new_sound_track= await pool.query(
//             "INSERT INTO SOUND_TRACKS(ANIME_ID,MUSIC_ID,TITLE,BAND)VALUES($1,$2,$3,$4) RETURNING *",
//                 [ANIME_ID,MUSIC_ID,TITLE,BAND]   
//         );
//         res.json(new_sound_track.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });

//----------------------------------------------------------CREATING MUSIC_GENRES

// CREATE TABLE MUSIC_GENRES (
//     ANIME_ID INT,
//     MUSIC_ID INT,
//     GENRE VARCHAR(255),

// app.post("/animania/:ANIME_ID/:MUSIC_ID/:GENRE",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const MUSIC_ID=req.params.MUSIC_ID;
//         const GENRE=req.params.GENRE;
//         const new_music_genre= await pool.query(
//             "INSERT INTO SOUND_TRACKS(ANIME_ID,MUSIC_ID,GENRE)VALUES($1,$2,$3) RETURNING *",
//                 [ANIME_ID,MUSIC_ID,GENRE]   
//         );
//         res.json(new_music_genre.rows[0]);
//     } catch (err) {
//         console.error(err.message);
//     }
// });


//-----------------------------------------------------------------CREATING

// CREATE TABLE WATCH_HISTORY(
//     USER_ID INT REFERENCES "USER"(USER_ID),
//     ANIME_ID INT ,--REFERENCES ANIME(ANIME_ID),
//     EPISODE_NO INT,-- REFERENCES EPISODES(EPISODE_NO),
//     TIME DATE,
//     VIEW_NO INT,


app.use(cors());
app.use(express.json());

app.listen(5000, () =>
{
    console.log("started...");
});


