const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

const corsOptions = {
  origin: "http://localhost:3001",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/sign_up", async (req, res) => {
  try {
    const { user, pwd, email, userRole, img_url } = req.body;

    const newModerator = await pool.query(
      "INSERT INTO person (user_name, password,email,role,img_url) VALUES ($1, $2, $3, $4,$5) RETURNING id",
      [user, pwd, email, userRole, img_url]
    );
    console.log(1);

    if (userRole === "U") {
      const userId = newModerator.rows[0].id;
      await pool.query(
        `INSERT INTO "USER" 
        ( 
          user_id,
          bio,
          most_favourite_anime,
          first_access,
          last_access,
          active_time
        )
          
          VALUES ($1,'','',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,CURRENT_TIMESTAMP-CURRENT_TIMESTAMP)`,
        [userId]
      );
      res.json("user created successfully");
    } else {
      const moderatorId = newModerator.rows[0].id;
      await pool.query(
        `INSERT INTO moderator 
        ( moderator_id,
          added_series,
          deleted_series,
          added_episodes,
          deleted_episodes,
          review_verifications,
          filtered_comments)
      
      VALUES ($1,0,0,0,0,0,0)`,
        [moderatorId]
      );
      res.json("Moderator created successfully");
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// app.get("/auth", async (req, res) => {
//   try {
//     const {
//       user,
//       pwd
//     } = req.query;
//     console.log(user, pwd)
//     const person = await pool.query(
//       "SELECT * FROM PERSON where USER_NAME = $1 AND PASSWORD = $2",
//       [user,pwd]
//     );
//     res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//     res.json(person.rows);
//     console.log(person.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

app.post("/auth", async (req, res) => {
  try {
    const { user, pwd } = req.body;
    console.log(user, pwd);
    const person = await pool.query("SELECT * FROM PERSON where EMAIL = $1", [
      user,
    ]);
    if (person.rows.length > 0) {
      const userRole = person.rows[0].role;
      console.log(userRole);

      if (userRole === "U") {
        const userId = person.rows[0].id;
        const user = await pool.query(
          `
          UPDATE "USER"
          SET 
            LAST_ACCESS = CURRENT_TIMESTAMP,
            ACTIVE_TIME = CURRENT_TIMESTAMP - FIRST_ACCESS
          WHERE USER_ID = $1;

      `,
          [userId]
        );
        // res.header("Access-Control-Allow-Origin", "http://localhost:3001");
        // res.json(user.rows);
        console.log(user.rows);
        console.log("user");
      }
    }
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(person.rows);
    console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/moderatorDash", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const person = await pool.query(
      `SELECT p.user_name as name, M.added_series AS added_series,
      M.deleted_series,M.added_episodes,M.deleted_episodes,M.review_verifications,M.filtered_comments,
      p.img_url as img_url
      FROM person P JOIN moderator M ON (P.ID = M.moderator_id)
      WHERE P.email = $1
      `,
      [email]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(person.rows);
    console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/home", async (req, res) => {
  try {
    const { userEmail } = req.body;
    console.log(userEmail);

    const allAnimes = await pool.query(
      `
      with T AS(
        SELECT DISTINCT (anime_id),user_id
        FROM users_anime_list ua
        where user_id = (
          SELECT "id"
          FROM person
          WHERE email = $1
        )
        )
        
        (
        SELECT
            a.*
            ,
            string_agg(DISTINCT g.genre_name, ',') AS genres,
            ta.user_id AS user_id
            ,
            CASE WHEN ta.user_id IS NOT NULL THEN true ELSE false END AS is_favorite
        FROM 
            anime a
        LEFT JOIN 
            genre_anime_relationship ga ON ga.anime_id = a.anime_id
        LEFT JOIN 
            genres g ON g.genre_id = ga.genre_id
        LEFT JOIN 
            T ta on ta.anime_id = a.anime_id
        GROUP BY 
            a.anime_id,ta.user_id
        ORDER BY 
            a.mal_score DESC
            )
      `,
      [userEmail]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(allAnimes.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/watch/anime/episodes/:id", async (req, res) => {
  try {
    // const id = parseInt(req.params.id);
    const { id,review,email } = req.body;
    console.log(id,review,email);

    const userID = await pool.query(
      `
      SELECT "id"
      from person
      where email = $1
      `,[email]
    );

    console.log(userID.rows[0].id);

    

    // console.log(userID.rows[0].id);

    await pool.query(
      `
      INSERT INTO review ( anime_id, user_id, review_text, review_time, status, review_role )
      VALUES
      ( $1, $2, $3, CURRENT_TIMESTAMP, 'pending', 'U' );
      `,
      [id,userID.rows[0].id,review]
    );

    // const allReviews = await pool.query(
    //   `
    //   SELECT *,
    //   (SELECT user_name
    //   FROM person PE
    //   WHERE PE."id" = R.user_id) AS reviewer,
    //   (SELECT img_url
    //     FROM person PE
    //     WHERE PE."id" = R.user_id) AS img_src
    //   FROM review R
    //   WHERE R.anime_id = $1
    //   `,[id]
    // );

    // console.log(allReviews.rows);

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    // res.json(allReviews.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/watch/anime/episodes/:id/reviews", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const allReviews = await pool.query(
      `
      SELECT *,
      (SELECT user_name
      FROM person PE
      WHERE PE."id" = R.user_id) AS reviewer,
      (SELECT img_url
        FROM person PE
        WHERE PE."id" = R.user_id) AS img_src
      FROM review R
      WHERE R.anime_id = $1
      `,[id]
    );

    
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(allReviews.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/moderatorDash", async (req, res) => {
  try {
    const { newUsername, img_url, email } = req.body;
    console.log(newUsername, img_url, email);
    await pool.query(
      `UPDATE person SET user_name = $1,img_url=$2 WHERE email = $3`,
      [newUsername, img_url, email]
    );

    const person = await pool.query(
      `SELECT user_name
      FROM person
      WHERE email = $1`,
      [email]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(person.rows);
    console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/userDash", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const person = await pool.query(
      `
      SELECT 
        p.user_name as name, 
        p.img_url as img_url, 
        u.bio as bio, 
        u.most_favourite_anime as most_favourite_anime,
        u.first_access as first_access,
        u.last_access as last_access,
        u.active_time as active_time
      FROM person P JOIN "USER" u ON (P.ID = u.user_id)
      WHERE P.email = $1
      `,
      [email]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(person.rows);
    console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/userDash", async (req, res) => {
  try {
    const { url, email } = req.body;
    console.log(url, email);
    await pool.query(
      `
    UPDATE person
	SET
		img_url = $1
	WHERE email = $2
    `,
      [url, email]
    );

    const person = await pool.query(
      `SELECT img_url
      FROM person
      WHERE email = $1`,
      [email]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(person.rows);
    console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//-----------------------------------------------updating user

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      bio,
      most_favourite_anime,
      first_access,
      last_access,
      active_time,
    } = req.body;

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
    const {
      added_series,
      deleted_series,
      added_episodes,
      deleted_episodes,
      review_verifications,
      filtered_comments,
    } = req.body;

    const updateModerator = await pool.query(
      "UPDATE moderator SET added_series = $1, deleted_series = $2, added_episodes = $3, deleted_episodes = $4, review_verifications = $5, filtered_comments = $6 WHERE moderator_id = $7",
      [
        added_series,
        deleted_series,
        added_episodes,
        deleted_episodes,
        review_verifications,
        filtered_comments,
        id,
      ]
    );

    res.json("Moderator updated successfully");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/home", async (req, res) => {
  try {
    const allAnimes = await pool.query(
      `
      SELECT
      a.*,
      string_agg(DISTINCT(g.genre_name),',') AS genres

      FROM anime a

      LEFT JOIN genre_anime_relationship ga ON ga.anime_id = a.anime_id
      LEFT JOIN genres g ON g.genre_id = ga.genre_id
      GROUP BY a.anime_id
      ORDER BY a.mal_score desc
      `
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(allAnimes.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/watch/anime/episodes/:id/episode/:id2", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const id2 = parseInt(req.params.id2);
    const anime = await pool.query(
      `
     SELECT * FROM
     EPISODES E JOIN ANIME A ON E.ANIME_ID=A.ANIME_ID
     WHERE E.ANIME_ID=$1 AND E.EPISODE_NO=$2
      `,
      [id,id2]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(anime.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/watch/anime/episodes/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const anime = await pool.query(
      `
      SELECT
    a.*,
    string_agg(DISTINCT(g.genre_name),',') AS genres,
    string_agg(DISTINCT(s.studio_name),',') AS studios,
		string_agg(DISTINCT(t.tag_name),',') AS tags
    ,
		string_agg(DISTINCT(c.character_name),',') AS "characters"

    FROM anime a
    LEFT JOIN anime_studio_relationship ast ON a.anime_id = ast.anime_id
    LEFT JOIN studio s ON s.studio_id = ast.studio_id
    LEFT JOIN genre_anime_relationship ga ON ga.anime_id = a.anime_id
    LEFT JOIN genres g ON g.genre_id = ga.genre_id
    LEFT JOIN tag_id_table ti on (ti.anime_id = a.anime_id)
    LEFT JOIN tags t on (t.tag_id = ti.tag_id)
    LEFT JOIN character_anime_relationship ca on (a.anime_id=ca.anime_id)
    LEFT JOIN "characters" c on (ca.character_id=c.character_id)

    WHERE a.anime_id = $1
    GROUP BY a.anime_id
      `,
      [id]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(anime.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/home", async (req, res) => {
  try {
    const { email, favString, anime_id } = req.body;
    console.log(email, favString, anime_id);
    const userId = await pool.query(
      `SELECT id FROM person WHERE email = $1`,
      [email]
    );
    console.log(favString);
    console.log(userId.rows[0].id);
    if (favString === "true") {
      await pool.query(
        `INSERT INTO users_anime_list (user_id, anime_id) VALUES ($1, $2)`,
        [userId.rows[0].id, anime_id] // Replace anime_id with the actual anime ID
      );
    } else {
      await pool.query(
        `DELETE FROM users_anime_list WHERE user_id = $1 AND anime_id = $2`,
        [userId.rows[0].id, anime_id] // Replace anime_id with the actual anime ID
      );
    }
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json("Anime added to user's list");
    // console.log(animes.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/genre", async (req, res) => {
  try {
    const ALLGENRES = await pool.query(
      `
      SELECT * FROM GENRES 
      --WHERE GENRE_NAME <> 'Hentai'
			ORDER BY GENRE_ID
      `
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(ALLGENRES.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// app.get("/genre/:id", async (req, res) => {
//   try {
//     const allAnimes = await pool.query(
//       `SELECT DISTINCT (A.*)
//       FROM genres G JOIN genre_anime_relationship GA ON (G.genre_id = GA.genre_id)
//       JOIN anime A ON (GA.anime_id = A.anime_id)
//       WHERE G.genre_id = $1
//       ORDER BY A.anime_id
//       `,
//       [req.params.id]
//     );
//     res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//     res.json(allAnimes.rows);
//   } catch (error) {
//     console.error(error.message);
//   }
// });

app.get("/genre/:id", async (req, res) => {
  try {
    const genreId = parseInt(req.params.id);

    if (isNaN(genreId)) {
      // Handle the case where the parameter is not a valid integer
      return res.status(400).json({ error: "Invalid genre ID" });
    }
    const allAnimes = await pool.query(
      `SELECT DISTINCT (A.*)
      FROM genres G JOIN genre_anime_relationship GA ON (G.genre_id = GA.genre_id)
      JOIN anime A ON (GA.anime_id = A.anime_id)
      WHERE G.genre_id = $1
      ORDER BY A.mal_score DESC
      `,
      [genreId]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(allAnimes.rows);
  } catch (error) {
    console.error(error.message); // <-- Corrected from `error.message`
  }
});

app.get("/anime/:id", async (req, res) => {
  try {
    const idAnime = await pool.query(
      "SELECT * FROM ANIME where ANIME_ID = $1",
      [req.params.id]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(idAnime.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/searchAnime/:searchTerm", async (req, res) => {
  try {
    console.log(req.params.searchTerm);
    const idAnime = await pool.query(
      "SELECT * FROM ANIME WHERE ANIME_NAME ILIKE $1",
      [`%${req.params.searchTerm}%`] // Using ILIKE for case-insensitive search and % for wildcard
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(idAnime.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/anime/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(req.body);
    const {
      anime_name,
      number_of_episodes,
      anime_type,
      age_rating,
      demographic,
      season,
      year,
      anime_source,
      description,
      title_screen,
      next_season,
      previous_season,
    } = req.body;

    const updateAnime = await pool.query(
      `UPDATE ANIME SET ANIME_NAME = $1, NUMBER_OF_EPISODES = $2,ANIME_TYPE=$3,AGE_RATING=$4,DEMOGRAPHIC=$5,SEASON=$6,YEAR=$7,ANIME_SOURCE=$8,DESCRIPTION=$9,TITLE_SCREEN = $10,NEXT_SEASON=$11,PREVIOUS_SEASON=$12 WHERE ANIME_ID = $13`,
      [
        anime_name,
        number_of_episodes,
        anime_type,
        age_rating,
        demographic,
        season,
        year,
        anime_source,
        description,
        title_screen,
        next_season,
        previous_season,
        id,
      ]
    );

    res.json("Anime was updated");
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Internal Server Error");
  }
});

// -----------------------------------------------creating anime
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
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// -----------------------------------------------------------------CREATING TAGS

// app.post("/animania/:TAG_ID/:TAG_NAME",async(req,res) =>{
//     try {
//         const TAG_ID=req.params.TAG_ID;
//         const TAG_NAME=req.params.TAG_NAME;
//         const new_tag= await pool.query(
//             "INSERT INTO TAGS(TAG_ID,TAG_NAME)VALUES($1,$2) RETURNING *",
//                 [TAG_ID,TAG_NAME]
//         );
//         res.json(new_tag.rows[0]);
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// ----------------------------------------------------------------CREATING TAG-ID-TABLE

// app.post("/animania/:ANIME_ID/:TAG_ID",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const TAG_ID=req.params.TAG_ID;
//         const new_tag_id_table= await pool.query(
//             "INSERT INTO TAG_ID_TABLE(ANIME_ID,TAG_ID)VALUES($1,$2) RETURNING *",
//                 [ANIME_ID,TAG_ID]
//         );
//         res.json(new_tag_id_table.rows[0]);
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// -----------------------------------------------------------------CREATING GENRES

// app.post("/animania/:ANIME_ID/:GENRE_NAME",async(req,res) =>{
//     try {
//         const ANIME_ID=req.params.ANIME_ID;
//         const GENRE_NAME=req.params.GENRE_NAME;
//         const new_genre= await pool.query(
//             "INSERT INTO GENRES(ANIME_ID,GENRE_NAME)VALUES($1,$2) RETURNING *",
//                 [ANIME_ID,GENRE_NAME]
//         );
//         res.json(new_genre.rows[0]);
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// -----------------------------------------------------------------CREATING STAFFS

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
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// ----------------------------------------------------------CREATING CHARACTERS

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
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// -------------------------------------------------------------------------CREATING STUDIO

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
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// --------------------------------------------------------------------CREATING ANIME STUDIO RELATIONSHIP

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
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// ----------------------------------------------------------------CREATING EPISODES

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
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// ------------------------------------------------------------CREATING SUBTITLES

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
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// ----------------------------------------------------------------CREATING SOUND_TRACK

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
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// ----------------------------------------------------------CREATING MUSIC_GENRES

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
//     } catch (error) {
//         console.error(error.message);
//     }
// });

// -----------------------------------------------------------------CREATING

// CREATE TABLE WATCH_HISTORY(
//     USER_ID INT REFERENCES "USER"(USER_ID),
//     ANIME_ID INT ,--REFERENCES ANIME(ANIME_ID),
//     EPISODE_NO INT,-- REFERENCES EPISODES(EPISODE_NO),
//     TIME DATE,
//     VIEW_NO INT,

// Other configurations and routes
