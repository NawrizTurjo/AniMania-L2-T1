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

    if(userRole==='U')
    {
      const newModerator = await pool.query(
        "INSERT INTO person (user_name, password,email,role,img_url) VALUES ($1, $2, $3, $4,$5) RETURNING id",
        [user, pwd, email, userRole, img_url]
      );
      console.log(1);
      res.json("Successfully signed up");
    }
    else
    {
      const newModerator = await pool.query(
        "INSERT INTO person (user_name, password,email,role,img_url) VALUES ($1, $2, $3,'M_not' ,$4) RETURNING id",
        [user, pwd, email, img_url]
      );
      console.log(1);
      res.json("Successfully signed up");
    }
    

    // if (userRole === "U") {
    //   const userId = newModerator.rows[0].id;
    //   await pool.query(
    //     `INSERT INTO "USER"
    //     (
    //       user_id,
    //       bio,
    //       most_favourite_anime,
    //       first_access,
    //       last_access,
    //       active_time
    //     )

    //       VALUES ($1,'','',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,CURRENT_TIMESTAMP-CURRENT_TIMESTAMP)`,
    //     [userId]
    //   );
    //   res.json("user created successfully");
    // } else {
    //   const moderatorId = newModerator.rows[0].id;
    //   await pool.query(
    //     `INSERT INTO moderator
    //     ( moderator_id,
    //       added_series,
    //       deleted_series,
    //       added_episodes,
    //       deleted_episodes,
    //       review_verifications,
    //       filtered_comments)

    //   VALUES ($1,0,0,0,0,0,0)`,
    //     [moderatorId]
    //   );
    //   res.json("Moderator created successfully");
    // }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/getCurrentPlan", async (req, res) => {
  try {
    const { userEmail } = req.body;
    console.log(userEmail);

    const response = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [userEmail]
    );

    const userId = response.rows[0].id;

    const currentPlan = await pool.query(
      `
      SELECT 
        CASE 
          WHEN current_plan IS NULL THEN 'Trial'
          ELSE (
            SELECT PLAN_NAME
            FROM PLANS
            WHERE PLAN_ID = current_plan
          )
        END as PLAN_NAME,
        TO_CHAR(plan_end_date, 'YYYY-MM-DD HH24:MI:SS') AS plan_end_date,
        WALLET_BALANCE
      FROM "USER"
      WHERE user_id = $1;

      `,
      [userId]
    );

    console.log(currentPlan.rows);

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(currentPlan.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addPlans", async (req, res) => {
  try {
    const { userEmail, interval, value, name } = req.body;
    console.log(userEmail, interval, value, name);

    const response = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [userEmail]
    );

    const userId = response.rows[0].id;

    const currentPlan = await pool.query(
      `
      INSERT INTO PLANS 
        (PLAN_INTERVAL,PLAN_VALUE,PLAN_NAME) 
          VALUES  
          ($1,$2,$3);
      `,
      [interval, value, name]
    );

    const modUpdate = await pool.query(
      `
      UPDATE moderator
      SET OTHERS = OTHERS + 1
      WHERE moderator_id = $1;
      `,
      [userId]
    );

    console.log(currentPlan.rows);

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(currentPlan.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getAllPlans", async (req, res) => {
  try {
    // const { userEmail } = req.body;
    // console.log(userEmail);

    // const response = await pool.query(
    //   `
    //   SELECT EMAIL_TO_ID($1) as "id"
    //   `,
    //   [userEmail]
    // );

    // const userId = response.rows[0].id;

    const allPlans = await pool.query(
      `
      SELECT *
      FROM PLANS;

      `
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(allPlans.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getbalance", async (req, res) => {
  try {
    const { userEmail } = req.body;
    console.log(userEmail);

    const response = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [userEmail]
    );

    const userId = response.rows[0].id;

    const balance = await pool.query(
      `
      SELECT WALLET_BALANCE
        FROM "USER"
        WHERE USER_ID = $1;
      `,
      [userId]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(balance.rows[0].wallet_balance);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/updatePlan", async (req, res) => {
  try {
    const { userEmail, planId } = req.body;
    console.log(userEmail);

    const response = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [userEmail]
    );

    const userId = response.rows[0].id;

    const updatePlan = await pool.query(
      `
      CALL ADD_PLAN ($1,$2)
      `,
      [userId, planId]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(updatePlan.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addNewPlan", async (req, res) => {
  try {
    const { userEmail, planName, planInterval, planValue } = req.body;
    console.log(userEmail);

    const response = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [userEmail]
    );

    const userId = response.rows[0].id;

    const addNewPlan = await pool.query(
      `
      CALL ADD_NEW_PLAN ($1,$2,$3,$4);
      `,
      [userId, planName, planValue, planInterval]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(addNewPlan.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addBalance", async (req, res) => {
  try {
    const { email, value } = req.body;
    console.log(email, value);

    const addBalance = await pool.query(
      `
      CALL UPDATE_BALANCE ($1,$2);
      `,
      [email, value]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(addBalance.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/top100", async (req, res) => {
  try {
    const { userEmail } = req.body;
    console.log(userEmail);

    const allAnimes = await pool.query(
      `
      with T AS(
        SELECT DISTINCT (anime_id),user_id,status
        FROM users_anime_list ua
        where user_id = (
          SELECT EMAIL_TO_ID($1) as "id"
        )
        )
        
        (
        SELECT
            a.*
            ,
            string_agg(DISTINCT g.genre_name, ',') AS genres,
            ta.user_id AS user_id
            ,
            CASE WHEN ta.user_id IS NOT NULL THEN true ELSE false END AS is_favorite,
						CASE WHEN ta.user_id IS NOT NULL THEN ta.status ELSE NULL END AS status
        FROM 
            anime a
        LEFT JOIN 
            genre_anime_relationship ga ON ga.anime_id = a.anime_id
        LEFT JOIN 
            genres g ON g.genre_id = ga.genre_id
        LEFT JOIN 
            T ta on ta.anime_id = a.anime_id
				WHERE
						a.mal_score IS NOT NULL
        GROUP BY 
            a.anime_id,ta.user_id,ta.status
        ORDER BY 
            a.mal_score DESC 
        LIMIT 100
            );

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

app.post("/getStudio", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    const studios = await pool.query(
      `
      SELECT string_agg(S.studio_name,',') AS studio_name
      FROM studio S JOIN anime_studio_relationship A ON S.studio_id = A.studio_id
      WHERE A.anime_id = $1
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(studios.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getStaffs", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    const staffs = await pool.query(
      `
      SELECT *
      from staffs
      WHERE anime_id = $1;
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(staffs.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getSoundtracks", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    const music = await pool.query(
      `
      SELECT string_agg(title,',') as title
      FROM sound_tracks
      WHERE ANIME_ID = $1
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(music.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getCharacters", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    const characters = await pool.query(
      `
      SELECT C.*
      FROM "characters" C JOIN character_anime_relationship CA ON C.character_id = CA.character_id
      WHERE CA.anime_id = $1;
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(characters.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addCharacter", async (req, res) => {
  try {
    const { name, role, gender, profile_picture, userRole, email, anime_id } =
      req.body;
    console.log(name, role, gender, profile_picture);

    const characters = await pool.query(
      `
      CALL insert_character(
        $1, -- p_name
        $2,     -- p_role
        $3,     -- p_gender
        $4, -- p_profile_picture
        $5,        -- p_user_role
        $6, -- p_email
        $7      -- p_anime_id
    )
      `,
      [name, role, gender, profile_picture, userRole, email, anime_id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(characters.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/approveCharacters", async (req, res) => {
  try {
    const { char_id, email } = req.body;

    const result = await pool.query(
      `
        SELECT email_to_id($1) as "id"
      `,
      [email]
    );

    const m_id = result.rows[0].id;
    const response = await pool.query(
      `
      UPDATE USER_REQ_CHARACTER SET moderator_id = $1 WHERE "id" = $2;
      `,
      [m_id, char_id]
    );

    // Set response headers using set method
    res.set("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getReqCharacters", async (req, res) => {
  try {
    // const { name, role, gender, profile_picture } = req.body;
    // console.log(name, role, gender, profile_picture);

    const reqCharacters = await pool.query(
      `
      SELECT *
      FROM USER_REQ_CHARACTER
      WHERE REQ_STATUS = 'pending'
      ORDER BY REQ_DATE DESC
      
      `
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(reqCharacters.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/:id/addEpisode", async (req, res) => {
  try {
    // const {animeId} = req.params;
    const {
      animeId,
      episodeName,
      episodeNumber,
      videoUrl,
      episodeLength,
      thumbnail,
      releaseDate,
      streamingSites,
    } = req.body;
    // console.log(email);
    console.log(
      animeId,
      episodeName,
      episodeNumber,
      videoUrl,
      episodeLength,
      thumbnail,
      releaseDate,
      streamingSites
    );
    console.log(releaseDate);
    const response = await pool.query(
      `
      INSERT INTO episodes (anime_id,episode_no,episode_title,thumbnail,"LENGTH",release_date,availability,streaming_sites)
      values ($1,$2,$3,$4,$5,$6,'Y',$7)
      `,
      [
        animeId,
        episodeNumber,
        episodeName,
        thumbnail,
        episodeLength,
        releaseDate,
        streamingSites,
      ]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.rows);
    console.log(response.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/getKarma", async (req, res) => {
  try {
    const { email } = req.body;

    const karma = await pool.query(`SELECT get_karma($1)`, [email]);
    console.log(karma.rows[0].get_karma);
    res.json(karma.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/getContribution", async (req, res) => {
  try {
    const { email } = req.body;

    const contribution = await pool.query(`SELECT GET_CONTRIBUTION($1)`, [
      email,
    ]);
    console.log(contribution.rows[0].get_contribution);
    res.json(contribution.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/AdvancedSearch", async (req, res) => {
  const {
    searchString,
    season,
    genre,
    tag,
    year,
    ageRating,
    rating,
    type,
    demographic,
    source,
    episodeCount,
    characters,
    userEmail,
  } = req.body;
  console.log(userEmail);
  console.log(req.body);
  try {
    let query = `
    with T AS(
      SELECT DISTINCT (anime_id),user_id,status
      FROM users_anime_list ua
      where user_id = (
        SELECT EMAIL_TO_ID($1) as "id"
      )
      )
      (
      SELECT
          a.*,
          string_agg(DISTINCT g.genre_name,',') AS genres,
          string_agg(DISTINCT s.studio_name, ',') AS studios,
          string_agg(DISTINCT t.tag_name,',') AS tags,
          string_agg(DISTINCT c.character_name, ',') AS "characters"
          ,
            CASE WHEN ta.user_id IS NOT NULL THEN true ELSE false END AS is_favorite,
						CASE WHEN ta.user_id IS NOT NULL THEN ta.status ELSE NULL END AS status
      FROM anime a
      LEFT JOIN anime_studio_relationship ast ON a.anime_id = ast.anime_id
      LEFT JOIN studio s ON s.studio_id = ast.studio_id
      LEFT JOIN genre_anime_relationship ga ON ga.anime_id = a.anime_id
      LEFT JOIN genres g ON g.genre_id = ga.genre_id
      LEFT JOIN tag_id_table ti ON ti.anime_id = a.anime_id
      LEFT JOIN tags t ON t.tag_id = ti.tag_id
      LEFT JOIN 
            T ta on ta.anime_id = a.anime_id
      LEFT JOIN character_anime_relationship ca ON a.anime_id = ca.anime_id
      LEFT JOIN "characters" c ON ca.character_id = c.character_id
      WHERE 1 = 1`;

    if (searchString) {
      const editDistanceThreshold = 3;

      query += ` AND EXISTS (
        SELECT 1
        FROM generate_series(1, LENGTH(a.anime_name)) AS i
        WHERE LEVENSHTEIN(UPPER(SUBSTRING(a.anime_name FROM i FOR LENGTH('${searchString}'))), UPPER('${searchString}')) <= ${editDistanceThreshold}
      )`;
    }

    if (season) {
      query += ` AND a.season = '${season}'`;
    }
    if (genre) {
      const genresArray = genre.split(",").map((genre) => genre.trim());
      query += ` AND g.genre_name IN ('${genresArray.join("','")}')`;
    }
    if (tag) {
      const tagsArray = tag.split(",").map((tag) => tag.trim());
      query += ` AND UPPER(t.tag_name) IN ('${tagsArray
        .join("','")
        .toUpperCase()}')`;
    }
    if (year) {
      query += ` AND a.year = ${year}`;
    }
    if (ageRating) {
      query += ` AND a.age_rating = '${ageRating}'`;
    }
    if (rating) {
      query += ` AND a.mal_score >= ${rating}`;
    }
    if (type) {
      const typesArray = type.split(",").map((type) => type.trim());
      query += ` AND UPPER(a.anime_type) IN ('${typesArray
        .join("','")
        .toUpperCase()}')`;
    }
    if (demographic) {
      const demographicsArray = demographic
        .split(",")
        .map((demographic) => demographic.trim());
      query += ` AND a.demographic IN ('${demographicsArray.join("','")}')`;
    }
    if (source) {
      const sourcesArray = source.split(",").map((source) => source.trim());
      query += ` AND a.anime_source IN ('${sourcesArray.join("','")}')`;
    }
    if (episodeCount) {
      query += ` AND a.number_of_episodes >= ${episodeCount}`;
    }
    if (characters) {
      const charactersArray = characters
        .split(",")
        .map((character) => character.trim());
      query += ` AND UPPER(c.character_name) IN ('${charactersArray
        .join("','")
        .toUpperCase()}')`;
    }

    query += ` GROUP BY a.anime_id,ta.user_id,ta.status
              ORDER BY a.mal_score DESC
              )
    `;

    const results = await pool.query(query, [userEmail]);

    res.json(results.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.post("/AdvancedSearch2", async (req, res) => {
//   const {
//     searchString,
//     season,
//     genre,
//     tag,
//     year,
//     ageRating,
//     rating,
//     type,
//     demographic,
//     source,
//     episodeCount,
//     characters,
//     userEmail,
//   } = req.body;

//   try {
//     // Convert empty strings to null for numeric types
//     const yearValue = year === "" ? null : parseInt(year);
//     const ratingValue = rating === "" ? null : parseInt(rating);
//     const episodeCountValue =
//       episodeCount === "" ? null : parseInt(episodeCount);

//     const query = `
//             SELECT *
//             FROM AdvancedSearchFunction($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
//         `;
//     const values = [
//       searchString,
//       season,
//       genre,
//       tag,
//       yearValue,
//       ageRating,
//       ratingValue,
//       type,
//       demographic,
//       source,
//       episodeCountValue,
//       characters,
//       userEmail,
//     ];

//     const client = await pool.connect();
//     const result = await client.query(query, values);
//     client.release();

//     res.json(result.rows);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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
        SELECT DISTINCT (anime_id),user_id,status
        FROM users_anime_list ua
        where user_id = (
          SELECT EMAIL_TO_ID($1) as "id"
        )
        )
        
        (
        SELECT
            a.*
            ,
            string_agg(DISTINCT g.genre_name, ',') AS genres,
            ta.user_id AS user_id
            ,
            CASE WHEN ta.user_id IS NOT NULL THEN true ELSE false END AS is_favorite,
						CASE WHEN ta.user_id IS NOT NULL THEN ta.status ELSE NULL END AS status
        FROM 
            anime a
        LEFT JOIN 
            genre_anime_relationship ga ON ga.anime_id = a.anime_id
        LEFT JOIN 
            genres g ON g.genre_id = ga.genre_id
        LEFT JOIN 
            T ta on ta.anime_id = a.anime_id
        GROUP BY 
            a.anime_id,ta.user_id,ta.status
        ORDER BY 
            a.year desc
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
    const { id, review, rating, email } = req.body;
    console.log(id, review, email);

    const userID = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    console.log(userID.rows[0].id);

    // console.log(userID.rows[0].id);

    await pool.query(
      `
      INSERT INTO review ( anime_id, user_id, review_text, review_time, status, review_role,rating )
      VALUES
      ( $1, $2, $3, CURRENT_TIMESTAMP, 'pending', 'U',$4 );
      `,
      [id, userID.rows[0].id, review, rating]
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

    // setTimeout(() => {
    //   // setProgress(100);
    // }, 1000);

    // console.log(allReviews.rows);

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/uid", async (req, res) => {
  try {
    const { email } = req.body;
    const uid = await pool.query(`SELECT EMAIL_TO_ID($1) as "id"`, [email]);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(uid.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/watch/anime/episodes/:id/episode/:id2", async (req, res) => {
  try {
    // const id = parseInt(req.params.id);
    const { id, id2, comment, email } = req.body;
    //console.log(id, review, email);

    const userID = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    console.log(userID.rows[0].id);

    // console.log(userID.rows[0].id);

    await pool.query(
      `
      INSERT INTO comments ( anime_id,episode_no, user_id, text, comment_time, status, comment_role, parent_id )
      VALUES
      ( $1, $2, $3, $4,CURRENT_TIMESTAMP, 'pending', 'U', -1);
      `,
      [id, id2, userID.rows[0].id, comment]
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

    // setTimeout(() => {
    //   // setProgress(100);
    // }, 1000);

    // console.log(allReviews.rows);

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/watch/anime/episodes/:id/episode/:id2/reply", async (req, res) => {
  try {
    // const id = parseInt(req.params.id);
    const { id, id2, reply, email, parentId } = req.body;
    //console.log(id, review, email);

    const userID = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    console.log(userID.rows[0].id);

    // console.log(userID.rows[0].id);

    await pool.query(
      `
      INSERT INTO comments ( anime_id,episode_no, user_id, text, comment_time, status, comment_role, parent_id )
      VALUES
      ( $1, $2, $3, $4,CURRENT_TIMESTAMP, 'pending', 'U', $5);
      `,
      [id, id2, userID.rows[0].id, reply, parentId]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/updateStatus", async (req, res) => {
  try {
    const { status, email, anime_id } = req.body;
    console.log(status, email, anime_id);
    const user_res = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    const user_id = user_res.rows[0].id;
    // if (status === "Watched") {
    //   const response = await pool.query(
    //     `
    //       UPDATE users_anime_list
    //       SET
    //         status = $1,
    //         end_date = CURRENT_TIMESTAMP
    //       WHERE
    //       anime_id = $2 AND user_id = $3
    //         `,
    //     [status, anime_id, user_id]
    //   );
    // } else {
    //   const response = await pool.query(
    //     `
    //   UPDATE users_anime_list
    //   SET
    //     status = $1
    //   WHERE
    //   anime_id = $2 AND user_id = $3
    //     `,
    //     [status, anime_id, user_id]
    //   );
    // }
    const response = await pool.query(
      `
      CALL update_users_anime_list_status($1,$2,$3)
      `,
      [status, anime_id, user_id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/updateComment", async (req, res) => {
  try {
    const { comment_id, comment_text } = req.body;

    const response = await pool.query(
      `UPDATE comments
      SET
        text = $1,
        comment_time = CURRENT_TIMESTAMP,
        status = 'pending'
      WHERE
        comment_id = $2
        `,
      [comment_text, comment_id]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/updateReview", async (req, res) => {
  try {
    const { review_id, review_text, rating } = req.body;
    console.log(review_id, review_text, rating);

    const response = await pool.query(
      `UPDATE review
          SET
            review_text = $1,
            review_time = CURRENT_TIMESTAMP,
            status = 'pending',
            rating = $3
          WHERE
            review_id = $2
            `,
      [review_text, review_id, rating]
    );

    // const { newUsername, img_url, email } = req.body;
    // console.log(newUsername, img_url, email);
    // await pool.query(
    //   `UPDATE person SET user_name = $1,img_url=$2 WHERE email = $3`,
    //   [newUsername, img_url, email]
    // );

    // const person = await pool.query(
    //   `SELECT user_name
    //   FROM person
    //   WHERE email = $1`,
    //   [email]
    // );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/moderator/reviews", async (req, res) => {
  try {
    const allReviews = await pool.query(
      `
      SELECT *
      FROM review r join person p on r.user_id=p.id join anime a on a.anime_id=r.anime_id
      WHERE r.status = 'pending'
      ORDER BY r.review_id
      ;			

      `
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(allReviews.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/review/approve", async (req, res) => {
  try {
    const { updatedId, email } = req.body;
    //console.log(review_id);
    console.log(email);

    const moderator_id = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );
    const id = moderator_id.rows[0].id;

    const response = await pool.query(
      `
      UPDATE review
      SET
        status = 'approved',
        moderator_id = $1
      WHERE
        review_id = $2
      `,
      [id, updatedId]
    );
    // const updateModeratorQuery = await pool.query(
    //   `
    //   CALL FILTERED_COMMENTS_UPDATE($1,'R')
    //   `,
    //   [id]
    // );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
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
      (SELECT email
        FROM person PE
        WHERE PE."id" = R.user_id) AS email,
      (SELECT img_url
        FROM person PE
        WHERE PE."id" = R.user_id) AS img_src
      FROM review R
      WHERE R.anime_id = $1
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(allReviews.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/watch/anime/episodes/:id/episode/:id2/comments", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const id2 = parseInt(req.params.id2);
    console.log(id, id2);

    const allReviews = await pool.query(
      `
      SELECT *,
      (SELECT user_name
      FROM person PE
      WHERE PE."id" = R.user_id) AS reviewer,
      (SELECT email
        FROM person PE
        WHERE PE."id" = R.user_id) AS email,
      (SELECT img_url
        FROM person PE
        WHERE PE."id" = R.user_id) AS img_src
      FROM comments R
      WHERE R.anime_id = $1 AND R.episode_no=$2 AND R.parent_id= -1
      `,
      [id, id2]
    );
    //console.log(1);
    //console.log(allReviews);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(allReviews.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/watch/anime/episodes/:id/episode/:id2/replies", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const id2 = parseInt(req.params.id2);
    console.log(id, id2);

    const allReviews = await pool.query(
      `
      SELECT *,
      (SELECT user_name
      FROM person PE
      WHERE PE."id" = R.user_id) AS reviewer,
      (SELECT email
        FROM person PE
        WHERE PE."id" = R.user_id) AS email,
      (SELECT img_url
        FROM person PE
        WHERE PE."id" = R.user_id) AS img_src
      FROM comments R
      WHERE R.anime_id = $1 AND R.episode_no=$2 AND R.parent_id <> -1
      `,
      [id, id2]
    );
    //console.log(1);
    //console.log(allReviews);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(allReviews.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get(
  "/watch/anime/episodes/:id/episode/:id2/comments/:cId",
  async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const id2 = parseInt(req.params.id2);
      const cId = parseInt(req.params.cId);

      const query = `
      SELECT *,
      (SELECT user_name
      FROM person PE
      WHERE PE."id" = R.user_id) AS reviewer,
      (SELECT email
        FROM person PE
        WHERE PE."id" = R.user_id) AS email,
      (SELECT img_url
        FROM person PE
        WHERE PE."id" = R.user_id) AS img_src
      FROM comments R
      WHERE R.anime_id = $1 AND R.episode_no = $2 AND R.parent_id = $3
      `;
      const queryParams = [id, id2, cId];

      const allReviews = await pool.query(query, queryParams);

      if (allReviews.rows.length === 0) {
        // If no comments found with the specified cId, return 404 Not Found
        return res.status(404).json({ error: "Comment not found" });
      }

      res.header("Access-Control-Allow-Origin", "http://localhost:3001");
      res.status(200).json(allReviews.rows);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

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

app.put("/updateHistory", async (req, res) => {
  try {
    const { email, anime_id, episode_no } = req.body;

    console.log(email, anime_id, episode_no);

    const user_id = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    console.log(user_id.rows[0].id);
    // console.log(user_id);
    const uid = user_id.rows[0].id;

    const view = await pool.query(
      `
      SELECT MAX(view_no) AS MAX_VIEW
      FROM watch_history
      WHERE anime_id = $1 AND episode_no = $2;
      `,
      [anime_id, episode_no]
    );
    const maxView = view.rows[0].max_view ? view.rows[0].max_view + 1 : 1;

    console.log(maxView);

    const result = await pool.query(
      `
      INSERT INTO watch_history VALUES ($1, $2, $3,CURRENT_TIMESTAMP,$4)
      ON CONFLICT (user_id,anime_id,episode_no)
      DO UPDATE SET time = CURRENT_TIMESTAMP
      `,
      [uid, anime_id, episode_no, maxView]
    );

    // console.log(result);

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(result.rows);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/getHistory", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const history = await pool.query(
      `
      SELECT *,(
        SELECT anime_name
        FROM anime
        WHERE anime_id = WH.anime_id
      ) AS "name",
      (
        SELECT thumbnail
        FROM episodes
        WHERE anime_id = WH.anime_id AND episode_no = WH.episode_no
      ) AS thumbnail
      FROM watch_history WH
      WHERE WH.user_id = (
        SELECT EMAIL_TO_ID($1) as "id"
      )
      ORDER BY WH.anime_id, WH.episode_no
      `,
      [email]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(history.rows);
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

app.put("/userDash/updateBio", async (req, res) => {
  try {
    const { bio, email } = req.body;
    console.log(bio, email);
    await pool.query(
      `
    UPDATE "USER"
    SET
      bio = $1
    WHERE user_id = (
      SELECT EMAIL_TO_ID($2) as "id"
    )
    `,
      [bio, email]
    );

    const person = await pool.query(
      `SELECT bio
      FROM "USER"
      WHERE user_id = (
        SELECT EMAIL_TO_ID($1) as "id"
      )`,
      [email]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(person.rows);
    console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/userDash/getAnimeList", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const response = await pool.query(
      `
      with T AS(
        SELECT DISTINCT (anime_id),user_id,status
        FROM users_anime_list ua
        where user_id = (
          SELECT EMAIL_TO_ID($1) as "id"
        )
        )
        
        (
        SELECT
            a.*
            ,
            string_agg(DISTINCT g.genre_name, ',') AS genres,
            ta.user_id AS user_id
            ,
						ta.status AS status
        FROM 
            anime a
        LEFT JOIN 
            genre_anime_relationship ga ON ga.anime_id = a.anime_id
        LEFT JOIN 
            genres g ON g.genre_id = ga.genre_id
        LEFT JOIN 
            T ta on ta.anime_id = a.anime_id
				WHERE ta.user_id IS NOT NULL
        GROUP BY 
            a.anime_id,ta.user_id,ta.status
        ORDER BY 
            a.mal_score DESC
            );
    `,
      [email]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.rows);
    console.log(response.rows);
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
      [id, id2]
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
    const userId = await pool.query(`SELECT id FROM person WHERE email = $1`, [
      email,
    ]);
    console.log(favString);
    console.log(userId.rows[0].id);
    if (favString === "true") {
      await pool.query(
        `INSERT INTO users_anime_list (user_id, anime_id,status,start_date) VALUES ($1, $2,'Watching',CURRENT_TIMESTAMP)`,
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

app.get("/source", async (req, res) => {
  try {
    const ALLSOURCES = await pool.query(
      `
      SELECT DISTINCT(anime_source)
      from anime
      where anime_source is not NULL;
      `
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(ALLSOURCES.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/tags", async (req, res) => {
  try {
    const ALLTAGS = await pool.query(
      `
      SELECT * FROM TAGS 
			ORDER BY TAG_ID
      `
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(ALLTAGS.rows);
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

app.post("/searchAnime", async (req, res) => {
  try {
    const { userEmail, searchTerm } = req.body;
    console.log(userEmail, searchTerm);

    const editDistanceThreshold = 3;

    const allAnimes = await pool.query(
      `
      WITH T AS (
        SELECT DISTINCT (anime_id), user_id, status
        FROM users_anime_list ua
        WHERE user_id = (
            SELECT EMAIL_TO_ID($1) AS "id"
        )
    ),
    ED AS (
        SELECT a.anime_id
        FROM anime a
        CROSS JOIN generate_series(1, LENGTH(a.anime_name)) AS i
        WHERE LEVENSHTEIN(UPPER(SUBSTRING(a.anime_name FROM i FOR LENGTH($2))), UPPER($2)) <= ${editDistanceThreshold}
    )
    SELECT
        a.*,
        string_agg(DISTINCT g.genre_name, ',') AS genres,
        ta.user_id AS user_id,
        CASE WHEN ta.user_id IS NOT NULL THEN true ELSE false END AS is_favorite,
        CASE WHEN ta.user_id IS NOT NULL THEN ta.status ELSE NULL END AS status
    FROM 
        anime a
    LEFT JOIN 
        genre_anime_relationship ga ON ga.anime_id = a.anime_id
    LEFT JOIN 
        genres g ON g.genre_id = ga.genre_id
    LEFT JOIN 
        T ta on ta.anime_id = a.anime_id
    WHERE a.anime_id IN (SELECT anime_id FROM ED)
    GROUP BY 
        a.anime_id, ta.user_id, ta.status
    ORDER BY 
        a.mal_score DESC

      `,
      [userEmail, `%${searchTerm}%`]
    );
    /*
    FROM generate_series(1, LENGTH(a.anime_name)) AS i
        WHERE LEVENSHTEIN(UPPER(SUBSTRING(a.anime_name FROM i FOR LENGTH('${searchString}'))), UPPER('${searchString}')) <= ${editDistanceThreshold}
    */

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    // res.json();
    res.json(allAnimes.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
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

app.get("/anime/:id/ep", async (req, res) => {
  try {
    const idAnime = await pool.query(
      "SELECT * FROM episodes where ANIME_ID = $1",
      [req.params.id]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(idAnime.rows);
  } catch (error) {
    console.error(error.message);
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
app.post("/reactionL", async (req, res) => {
  try {
    // const id = parseInt(req.params.id);
    const { email, commentId } = req.body;
    //console.log(id, review, email);

    const userID = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    console.log(userID.rows[0].id);

    await pool.query(
      `
      DELETE FROM reaction WHERE user_id=$1 AND comment_id=$2;
      `,
      [userID.rows[0].id, commentId]
    );

    await pool.query(
      `
      INSERT INTO reaction (user_id, comment_id, reaction_type )
      VALUES
      ( $1, $2, 'L');
      `,
      [userID.rows[0].id, commentId]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/reactionD", async (req, res) => {
  try {
    // const id = parseInt(req.params.id);
    const { email, commentId } = req.body;
    //console.log(id, review, email);

    const userID = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    console.log(userID.rows[0].id);

    await pool.query(
      `
      DELETE FROM reaction WHERE user_id=$1 AND comment_id=$2;
      `,
      [userID.rows[0].id, commentId]
    );

    await pool.query(
      `
      INSERT INTO reaction (user_id, comment_id, reaction_type )
      VALUES
      ( $1, $2, 'D');
      `,
      [userID.rows[0].id, commentId]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getlikes", async (req, res) => {
  try {
    const allLikes = await pool.query(
      `
      SELECT COUNT(*) AS total_likes, comment_id
			from reaction
			where reaction_type='L'
			GROUP BY comment_id;
      `
    );
    //console.log(1);
    //console.log(allReviews);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(allLikes.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/getdislikes", async (req, res) => {
  try {
    const alDislLikes = await pool.query(
      `
      SELECT COUNT(*) AS total_dislikes, comment_id
			from reaction
			where reaction_type='D'
			GROUP BY comment_id;
      `
    );
    //console.log(1);
    //console.log(allReviews);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(alDislLikes.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/reactionLremove", async (req, res) => {
  try {
    // const id = parseInt(req.params.id);
    const { email, commentId } = req.body;
    //console.log(id, review, email);

    const userID = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    console.log(userID.rows[0].id);

    await pool.query(
      `
      DELETE FROM reaction WHERE user_id=$1 AND comment_id=$2 AND reaction_type='L';
      `,
      [userID.rows[0].id, commentId]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/reactionDremove", async (req, res) => {
  try {
    // const id = parseInt(req.params.id);
    const { email, commentId } = req.body;
    //console.log(id, review, email);

    const userID = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    console.log(userID.rows[0].id);

    await pool.query(
      `
      DELETE FROM reaction WHERE user_id=$1 AND comment_id=$2 AND reaction_type='D';
      `,
      [userID.rows[0].id, commentId]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to retrieve user's likes and dislikes
app.get("/getlike", async (req, res) => {
  //const userId = req.params.userId;

  try {
    const { email } = req.query;
    //console.log(email);
    const userID = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );
    const ID = userID.rows[0].id;
    console.log("a");
    console.log(ID);
    // Query database for user's likes and dislikes
    const allLikes = await pool.query(
      `SELECT comment_id FROM reaction WHERE user_id = $1 AND reaction_type='L'`,
      [ID]
    );
    //const dislikes = await pool.query(`SELECT comment_id FROM reaction WHERE user_id = $1 AND reaction_type='D'`, [ID]);
    //console.log(likes.rows[1]);
    // Send likes and dislikes data in response
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(allLikes.rows);
  } catch (error) {
    console.error("Error retrieving user likes and dislikes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getDislike", async (req, res) => {
  //const userId = req.params.userId;

  try {
    const { email } = req.query;
    //console.log(email);
    const userID = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );
    const ID = userID.rows[0].id;
    console.log("a");
    console.log(ID);
    // Query database for user's likes and dislikes
    const allLikes = await pool.query(
      `SELECT comment_id FROM reaction WHERE user_id = $1 AND reaction_type='D'`,
      [ID]
    );
    //const dislikes = await pool.query(`SELECT comment_id FROM reaction WHERE user_id = $1 AND reaction_type='D'`, [ID]);
    //console.log(likes.rows[1]);
    // Send likes and dislikes data in response
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(allLikes.rows);
  } catch (error) {
    console.error("Error retrieving user likes and dislikes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/review/decline", async (req, res) => {
  try {
    const { updatedId, email } = req.body;
    //console.log(review_id);
    console.log(email);

    const moderator_id = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );
    const id = moderator_id.rows[0].id;

    const response3 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, track_date)
     values
     ('EMAIL_TO_ID()', $1, current_date)
      `,
      [id]
    );

    const response = await pool.query(
      `
      DELETE FROM review
      WHERE
        review_id = $1
      `,
      [updatedId]
    );
    const response5 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, track_date)
     values
     ('FILTERED_COMMENTS_UPDATE()', $1, current_date)
      `,
      [id]
    );
    const updateModeratorQuery = await pool.query(
      `
      CALL FILTERED_COMMENTS_UPDATE($1,'R')
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/moderator/comments", async (req, res) => {
  try {
    const allReviews = await pool.query(
      `
      SELECT *
      FROM comments c join person p on c.user_id=p.id join anime a on a.anime_id=c.anime_id join episodes e on e.anime_id=c.anime_id and e.episode_no=c.episode_no
      WHERE c.status = 'pending'
      ORDER BY c.comment_id
      ;			

      `
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.status(200).json(allReviews.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/comment/approve", async (req, res) => {
  try {
    const { updatedId, email } = req.body;
    //console.log(review_id);
    console.log(email);

    const moderator_id = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );
    const id = moderator_id.rows[0].id;

    const response3 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, track_date)
     values
     ('EMAIL_TO_ID()', $1, current_date)
      `,
      [id]
    );

    const response = await pool.query(
      `
      UPDATE comments
      SET
        status = 'approved',
        moderator_id = $1
      WHERE
        comment_id = $2
      `,
      [id, updatedId]
    );
    // const updateModeratorQuery = await pool.query(
    //   `
    //   CALL FILTERED_COMMENTS_UPDATE($1,'C')
    //   `,
    //   [id]
    // );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/comment/decline", async (req, res) => { //--------------------------------------------------------------delete comment
  try {
    const { updatedId, email } = req.body;
    //console.log(review_id);
    console.log(email);

    const moderator_id = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );
    const id = moderator_id.rows[0].id;
    // const response3 = await pool.query(
    //   `
    //   DELETE FROM reaction
    //   WHERE
    //     comment_id = $1
    //   `,
    //   [updatedId]
    // );
    // const response = await pool.query(
    //   `
    //   DELETE FROM comments
    //   WHERE
    //     parent_id = $1
    //   `,
    //   [updatedId]
    // );
    const response3 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, track_date)
     values
     ('EMAIL_TO_ID()', $1, current_date)
      `,
      [id]
    );
    const response4 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, comment_id, track_date)
     values
     ('before_delete_comment_function()', $1, $2,current_date)
      `,
      [id, updatedId]
    );

    const response5 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, track_date)
     values
     ('FILTERED_COMMENTS_UPDATE()', $1, current_date)
      `,
      [id]
    );

    const response = await pool.query(
      `
      DELETE FROM comments
      WHERE
        comment_id = $1
      `,
      [updatedId]
    );
    const updateModeratorQuery = await pool.query(
      `
      CALL FILTERED_COMMENTS_UPDATE($1,'C')
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/deleteAccount", async (req, res) => { //----------------------------------------------------------delete account
  try {
    const { email } = req.body;
    //console.log(review_id);
    console.log(email);
    console.log(email);
    const user_id = await pool.query(
      `
      SELECT "id"
      FROM person
      WHERE email = $1
      `,
      [email]
    );
    console.log(email);
    const id = user_id.rows[0].id;
    const response3 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, track_date)
     values
     ('before_delete_user_function()', $1, current_date)
      `,
      [id]
    );
    console.log(id);
    const response = await pool.query(
      `
      DELETE FROM person
      WHERE
        "id" = $1
      `,
      [id]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/getNotifications", async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const response = await pool.query(
      `
    SELECT * FROM
    PERSON P JOIN NOTIFICATIONS N ON N.users_id= P."id"
    where P.email=$1
    ORDER BY N.track_date DESC
    FETCH first 10 rows only;
    `,
      [email]
    );
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.rows);
    console.log(response.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/addAnime", async (req, res) => { //---------------------------------------------------------------------addanime
  const {
    anime_name,
    title_screen,
    total_episodes,
    description,

    // searchString: searchString,
    season,
    genre,
    tag,
    year,
    ageRating,
    //rating: rating,
    type,
    demographic,
    source,
    opening_soundtrack,
    ending_soundtrack,
    streaming_sites,
    mal_score,
    //episodeCount: episodes,
    //characters: characters,
    userEmail,
  } = req.body;
  console.log(userEmail);
  try {
    // const ani_id= await pool.query(
    //   `select max(anime_id)+1
    //   from anime`

    // );
    // console.log(ani_id);
    const yearIn = isNaN(parseInt(year)) ? 0 : parseInt(year);
    const number_of_episodes_In = isNaN(parseInt(total_episodes))
      ? 0
      : parseInt(total_episodes);
    const mal_score_In = isNaN(parseInt(mal_score)) ? 0 : parseInt(mal_score);

    const newAnimeRes = await pool.query(
      "INSERT INTO anime (anime_name, title_screen, number_of_episodes, description, year, age_rating, anime_type, demographic, anime_source, streaming_sites, mal_score, season) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING anime_id",
      [
        anime_name,
        title_screen,
        number_of_episodes_In,
        description,
        yearIn,
        ageRating,
        type,
        demographic,
        source,
        streaming_sites,
        mal_score_In,
        season,
      ]
    );
    const ani_id = newAnimeRes.rows[0].anime_id;
    console.log(ani_id);
    const newsOound = await pool.query(
      `INSERT INTO sound_tracks (anime_id, title) VALUES($1, $2)`,
      [ani_id, opening_soundtrack]
    );
    
    const newsEound = await pool.query(
      `INSERT INTO sound_tracks (anime_id, title) VALUES($1, $2)`,
      [ani_id, ending_soundtrack]
    );

    for (const genreName of genre.split(", ")) {
      const genreResult = await pool.query(
        `SELECT genre_id FROM genres WHERE genre_name=$1`,
        [genreName]
      );
      // Extract the genre_id from the result
      if (genreResult.rows.length > 0) {
        const genreId = genreResult.rows[0].genre_id;
        await pool.query(
          "INSERT INTO genre_anime_relationship (anime_id, genre_id) VALUES ($1, $2)",
          [ani_id, genreId]
        );
      } else {
        // Handle the case where the genre does not exist, if necessary
        console.log(`Genre not found: ${genreName}`);
      }
    }

    for (const tagName of tag.split(", ")) {
      const tagResult = await pool.query(
        `SELECT tag_id FROM tags WHERE tag_name=$1`,
        [tagName]
      );
      // Extract the tag_id from the result
      if (tagResult.rows.length > 0) {
        const tagId = tagResult.rows[0].tag_id;
        await pool.query(
          "INSERT INTO tag_id_table(anime_id, tag_id) VALUES ($1, $2)",
          [ani_id, tagId]
        );
      } else {
        // Handle the case where the tag does not exist, if necessary
        console.log(`Tag not found: ${tagName}`);
      }
    }

    const user_id = await pool.query(
      `
  SELECT "id"
  FROM person
  WHERE email = $1
  `,
      [userEmail]
    );
    const id = user_id.rows[0].id;

    const updateanimeadd = await pool.query(
      `
  update moderator set added_series= added_series+1 where moderator_id=$1
  `,
      [id]
    );

    const response3 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, anime_id, track_date)
     values
     ('after_inserting_anime_function()', $1, $2, current_date)
      `,
      [id, ani_id]
    );

    res.json({ message: "Anime added successfully!" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/deleteAnime", async (req, res) => { //--------------------------------------------------------------------before delete anime
  try {
    const { email, anime_id } = req.body;
    console.log(email, anime_id);

    const user_res = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    const user_id = user_res.rows[0].id;
    console.log(user_id);

    const response3 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, anime_id, track_date)
     values
     ('before_delete_anime_function()', $1, $2, current_date)
      `,
      [user_id, anime_id]
    );

    const response = await pool.query(
      `
      delete from anime where anime_id= $1
      `,
      [anime_id]
    );

    const response2 = await pool.query(
      `
      update moderator
      set
        deleted_series = deleted_series + 1
        where
        moderator_id = $1
      `,
      [user_id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/anime/:id/episode_delete/:selectedEpisode", async (req, res) => {  //--------------------------------------- episode delete
  try {
    const { email } = req.body;
    //console.log( email, anime_id);
    const anime_id = parseInt(req.params.id);
    const episode_no = parseInt(req.params.selectedEpisode);



    const user_res = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );

    const user_id = user_res.rows[0].id;

    const response3 = await pool.query(
      `
     insert into log_table
     (function_or_procedure_name, person_id, anime_id, episode_no, track_date)
     values
     ('before_delete_episode_function()', $1, $2, $3, current_date)
      `,
      [user_id, anime_id, episode_no]
    );

    const response = await pool.query(
      `
      delete from episodes where anime_id= $1 and episode_no = $2
      `,
      [anime_id, episode_no]
    );

    const response2 = await pool.query(
      `
      update moderator
      set
        deleted_episodes = deleted_episodes + 1
        where
        moderator_id = $1
      `,
      [user_id]
    );


    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json();
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total anime
app.post("/admin/getAnimesCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM anime`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total epsisode
app.post("/admin/getEpisodesCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM episodes`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total character
app.post("/admin/getCharactersCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM characters`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total staff
app.post("/admin/getStaffsCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM staffs`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total review
app.post("/admin/getReviewsCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM review`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total comment
app.post("/admin/getCommentsCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM comments`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total genre
app.post("/admin/getGenresCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM genres`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total tag
app.post("/admin/getTagsCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM tags`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total studio
app.post("/admin/getStudiosCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM studio`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total sound_track
app.post("/admin/getSoundTracksCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM sound_tracks`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total user
app.post("/admin/getUsersCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM "USER"`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
//to get total moderator
app.post("/admin/getmoderatorsCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT count(*) FROM moderator`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0].count);
    console.log(episodes.rows[0].count);
  } catch (error) {
    console.error(error.message);
  }
});
// to get moderator who filetered highest comments
app.post("/admin/getmoderatorsfilteredCommentsCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`
    SELECT *
    from moderator m join person p on m.moderator_id=p. id
    WHERE m.filtered_comments=(SELECT max(filtered_comments)
    from moderator)`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0]);
    console.log(episodes.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});
//to get mod who filetered highest reviews
app.post("/admin/getmoderatorsfilteredreviewsCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`
    SELECT *
    from moderator m join person p on m.moderator_id=p. id
    WHERE m.review_verifications=(SELECT max(review_verifications)
    from moderator)`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0]);
    console.log(episodes.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});
// to get mod who added highest series
app.post("/admin/getmoderatorsaddingseriesCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`
    SELECT *
    from moderator m join person p on m.moderator_id=p. id
    WHERE m.added_series=(SELECT max(added_series)
    from moderator)`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0]);
    console.log(episodes.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});
// to get mod who deleted highest series
app.post("/admin/getmoderatorsdeletingseriesCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`
    SELECT *
    from moderator m join person p on m.moderator_id=p. id
    WHERE m.deleted_series=(SELECT max(deleted_series)
    from moderator)`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0]);
    console.log(episodes.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});
// to get mod who added highest ep
app.post("/admin/getmoderatorsaddingepCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`   
    SELECT *
    from moderator m join person p on m.moderator_id=p. id
    WHERE m.added_episodes=(SELECT max(added_episodes)
    from moderator)`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0]);
    console.log(episodes.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});
// to get mod who deleted highest ep
app.post("/admin/getmoderatorsdeletingepCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`
    SELECT *
    from moderator m join person p on m.moderator_id=p. id
    WHERE m.deleted_episodes=(SELECT max(deleted_episodes)
    from moderator)`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0]);
    console.log(episodes.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});
// to get mod who has highest karma
app.post("/admin/getmoderatorkarmaCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`SELECT *,
    (m.review_verifications * 2) +
    (m.filtered_comments * 1) +
    (m.deleted_series * 4) +
    (m.added_series * 5) +
    (m.deleted_episodes * 2) +
    (m.added_episodes * 3) +
    (COALESCE(m.others, 0) * 3) +
    (COALESCE(acc_req_count, 0) * 1.5) AS karma
FROM moderator m
JOIN person p ON m.moderator_id = p.id
LEFT JOIN (
 SELECT moderator_id, COUNT(*) AS acc_req_count
 FROM user_req_character
 WHERE req_status = 'ACCEPTED'
 GROUP BY moderator_id
) urc ON m.moderator_id = urc.moderator_id
WHERE (m.review_verifications * 2) +
   (m.filtered_comments * 1) +
   (m.deleted_series * 4) +
   (m.added_series * 5) +
   (m.deleted_episodes * 2) +
   (m.added_episodes * 3) +
   (COALESCE(m.others, 0) * 3) +
   (COALESCE(urc.acc_req_count, 0) * 1.5) = (
       SELECT MAX((review_verifications * 2) +
                  (filtered_comments * 1) +
                  (deleted_series * 4) +
                  (added_series * 5) +
                  (deleted_episodes * 2) +
                  (added_episodes * 3) +
                  (COALESCE(others, 0) * 3) +
                  (COALESCE(acc_req_count, 0) * 1.5))
       FROM moderator
       LEFT JOIN (
           SELECT moderator_id, COUNT(*) AS acc_req_count
           FROM user_req_character
           WHERE req_status = 'ACCEPTED'
           GROUP BY moderator_id
       ) urc ON moderator.moderator_id = urc.moderator_id
   );
`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0]);
    console.log(episodes.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});
// to get anime having highest reviews
app.post("/admin/getanimehighestreviewCount", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`
    SELECT
    a.anime_id,
    a.anime_name,
    COUNT(r.review_id) AS review_count
    FROM
    anime a
    JOIN
    review r ON a.anime_id = r.anime_id
    GROUP BY
    a.anime_id
    ORDER BY
    review_count DESC`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows[0]);
    console.log(episodes.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/chardecline", async (req, res) => {
  try {
    const { updatedId, email } = req.body;
    //console.log(review_id);
    console.log(email);

    const moderator_id = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );
    const id = moderator_id.rows[0].id;
    const response = await pool.query(
      `
      DELETE FROM user_req_character
      WHERE
        "id" = $1
      `,
      [updatedId]
    );
    const updateModeratorQuery = await pool.query(
      `
      update moderator
      set
      others = others + 1
      where moderator_id = $1
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/getStaffs", async (req, res) => {
  try {
    const { id } = req.body;
    console.log(id);

    const characters = await pool.query(
      `
      SELECT *
      FROM staffs
      WHERE anime_id = $1;
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(characters.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/getInterMod", async (req, res) => {
  try {
    // const { id } = req.body;
    // console.log(id);

    const characters = await pool.query(
      `
      SELECT *
      FROM person
      WHERE "role"='M_not';
      `
    );
    console.log(characters.rows);
    console.log(1);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(characters.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addStaff", async (req, res) => {
  try {
    const { name, role, gender, profile_picture, userRole, email, anime_id } =
      req.body;
    console.log(name, role, gender, profile_picture);

    const moderator_id = await pool.query(
      `
      SELECT EMAIL_TO_ID($1) as "id"
      `,
      [email]
    );
    const id = moderator_id.rows[0].id;

    const max_s_id = await pool.query(
      `
      select max(staff_id+1)
      from staffs
      `
    );

    const staff_id = max_s_id.rows[0].max;

    console.log(staff_id);

    const characters = await pool.query(
      `
      insert into staffs
        (name, role, gender, profile_picture, anime_id)
        values
        ($1, $2, $3, $4, $5)
      `,
      [name, role, gender, profile_picture, anime_id]
    );

    const updateModeratorQuery = await pool.query(
      `
      update moderator
      set
      others = others + 1
      where moderator_id = $1
      `,
      [id]
    );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(characters.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/declinemod", async (req, res) => {
  try {
    const { updatedId } = req.body;
    //console.log(review_id);
    //console.log(email);

    // const moderator_id = await pool.query(
    //   `
    //   SELECT EMAIL_TO_ID($1) as "id"
    //   `,
    //   [email]
    // );
    //const id = moderator_id.rows[0].id;
    const response = await pool.query(
      `
      DELETE FROM moderator
      WHERE
        moderator_id = $1
      `,
      [updatedId]
    );
    const response2 = await pool.query(
      `
      DELETE FROM person
      WHERE
        "id" = $1
      `,
      [updatedId]
    );
    // const updateModeratorQuery = await pool.query(
    //   `
    //   update moderator
    //   set
    //   others = others + 1
    //   where moderator_id = $1
    //   `,
    //   [id]
    // );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.put("/approvemod", async (req, res) => {
  try {
    const { updatedId } = req.body;
    //console.log(review_id);
    //console.log(email);

    // const moderator_id = await pool.query(
    //   `
    //   SELECT EMAIL_TO_ID($1) as "id"
    //   `,
    //   [email]
    // );
    //const id = moderator_id.rows[0].id;
    const response = await pool.query(
      `
      update person
       set role= 'M'
      WHERE
        "id" = $1
      `,
      [updatedId]
    );
    // const updateModeratorQuery = await pool.query(
    //   `
    //   update moderator
    //   set
    //   others = others + 1
    //   where moderator_id = $1
    //   `,
    //   [id]
    // );

    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(response.body);
    // console.log(person.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/admin/getLog", async (req, res) => {
  try {
    // const { id } = req.body;
    const episodes = await pool.query(`
    SELECT *
    from log_table`);
    res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.json(episodes.rows);
    console.log(episodes.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});