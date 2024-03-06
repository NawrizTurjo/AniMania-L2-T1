UPDATE STUDIO
SET country = 'Japan'
WHERE studio_id IS NOT NULL;

UPDATE review
SET
	review_text = 'This is a test',
	review_time = CURRENT_TIMESTAMP,
	status = 'Pending'
WHERE
	review_id = 3;
	
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
      WHERE R.anime_id = 5114;
			
SELECT *
FROM review
WHERE status = 'pending'
ORDER BY review_id
;			

UPDATE review
SET
	status = 'approved',
	moderator_id = 38
WHERE
	review_id = 1;

SELECT "id"
from person
where email = 'mod@mail.com';

UPDATE users_anime_list
SET
	status = 'Watching'
WHERE
	anime_id = 5114 AND user_id = 24;
	
SELECT "id"
      from person
      where email = 'eren@mikasa.com';

with T AS(
        SELECT DISTINCT (anime_id),user_id,status
        FROM users_anime_list ua
        where user_id = (
          SELECT "id"
          FROM person
          WHERE email = 'eren@mikasa.com'
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
            a.mal_score DESC
            );

with T AS(
        SELECT DISTINCT (anime_id),user_id,status
        FROM users_anime_list ua
        where user_id = (
          SELECT "id"
          FROM person
          WHERE email = 'eren@mikasa.com'
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

DROP TABLE review;

CREATE TABLE REVIEW(
    ANIME_ID INT REFERENCES ANIME(ANIME_ID),
    MODERATOR_ID INT REFERENCES person(ID),
    USER_ID INT REFERENCES person(ID),
    REVIEW_ID serial,
    review_text text,
    review_time timestamp,
    STATUS VARCHAR(10),
    review_role VARCHAR(100),
    PRIMARY KEY(ANIME_ID,USER_ID)
);

ALTER TABLE review
ADD COLUMN RATING FLOAT DEFAULT 0;

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

SELECT DISTINCT(anime_source)
      from anime;


ALTER TABLE anime
ALTER COLUMN title_screen TYPE TEXT;

SELECT anime_type
from anime
WHERE anime_id = 54503;

/
CREATE OR REPLACE FUNCTION before_delete_user_function()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM watch_history WHERE user_id = OLD."id";
    DELETE FROM users_anime_list WHERE user_id = OLD."id";
    DELETE FROM comments WHERE user_id = OLD."id";
    DELETE FROM review WHERE user_id = OLD."id";
    DELETE FROM reaction WHERE user_id = OLD."id";
    DELETE FROM notifications WHERE users_id = OLD."id";
    DELETE FROM "USER" WHERE user_id = OLD."id";
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_delete_user
BEFORE DELETE ON person
FOR EACH ROW
EXECUTE FUNCTION before_delete_user_function();
/

CREATE INDEX ON ANIME (anime_id);

CREATE INDEX ON ANIME (anime_name);

CREATE INDEX ON "characters" (CHARACTER_NAME);

CREATE INDEX ON tags (TAG_NAME);

CREATE INDEX ON episodes (anime_id);

CREATE INDEX ON ANIME (mal_score);

CREATE INDEX ON ANIME (YEAR);



SELECT a.*
FROM TAGS T JOIN tag_id_table TI ON (t.tag_id = ti.tag_id)
JOIN anime a ON (TI.anime_id = a.anime_ID)

WHERE T.tag_name = 'Demons';

SELECT *
FROM "characters"
WHERE UPPER(character_name) LIKE '%ELRIC%';

SELECT anime_id
FROM character_anime_relationship
WHERE character_id = 11;

CREATE SEQUENCE anime_anime_id_seq;
SELECT setval('anime_anime_id_seq', COALESCE((SELECT MAX(anime_id)+1 FROM anime), 1), false);
ALTER TABLE anime ALTER COLUMN anime_id SET DEFAULT nextval('anime_anime_id_seq');
ALTER TABLE anime ALTER COLUMN anime_id TYPE integer;
ALTER TABLE anime ALTER COLUMN anime_id SET NOT NULL;

CREATE SEQUENCE character_ch_id_seq;
SELECT setval('character_ch_id_seq', COALESCE((SELECT MAX(character_id)+1 FROM "characters"), 1), false);
ALTER TABLE "characters" ALTER COLUMN character_id SET DEFAULT nextval('character_ch_id_seq');
ALTER TABLE "characters" ALTER COLUMN character_id TYPE integer;
ALTER TABLE "characters" ALTER COLUMN character_id SET NOT NULL;


/
CREATE OR REPLACE PROCEDURE insert_character(
    p_name VARCHAR(250),
    p_role VARCHAR(250),
    p_gender VARCHAR(250),
    p_profile_picture TEXT,
    p_user_role VARCHAR(255),
		EMAIL TEXT
) AS $$
BEGIN
		
    IF p_user_role = 'U' THEN
        INSERT INTO requested_chars (character_name, ROLE, gender, profile_picture)
        VALUES (p_name, p_role, p_gender, p_profile_picture);
    ELSIF p_user_role = 'M' THEN
        INSERT INTO "characters" (character_name, ROLE, gender, profile_picture)
        VALUES (p_name, p_role, p_gender, p_profile_picture);
    ELSE
        RAISE EXCEPTION 'Invalid user role';
    END IF;
END;
$$ LANGUAGE plpgsql;
/

/
CREATE OR REPLACE PROCEDURE insert_character(
    p_name VARCHAR(250),
    p_role VARCHAR(250),
    p_gender VARCHAR(250),
    p_profile_picture TEXT,
    p_user_role VARCHAR(255),
		EMAIL TEXT
) 
	u_id INTEGER;
	BEGIN
			SELECT email_to_id(email) into u_id;
			IF p_user_role = 'U' THEN
-- 					INSERT INTO requested_chars (character_name, ROLE, gender, profile_picture)
-- 					VALUES (p_name, p_role, p_gender, p_profile_picture);
						DBMS_OUTPUT.PUT_LINE(U_ID);
			ELSIF p_user_role = 'M' THEN
-- 					INSERT INTO "characters" (character_name, ROLE, gender, profile_picture)
-- 					VALUES (p_name, p_role, p_gender, p_profile_picture);
						DBMS_OUTPUT.PUT_LINE(U_ID);
						DBMS_OUTPUT.PUT_LINE(P_USER_ROLE);
			ELSE
					RAISE EXCEPTION 'Invalid user role';
			END IF;
	END;

/

/
CREATE OR REPLACE PROCEDURE insert_character(
    p_name VARCHAR(250),
    p_role VARCHAR(250),
    p_gender VARCHAR(250),
    p_profile_picture TEXT,
    p_user_role VARCHAR(255),
    p_email TEXT,
		P_ANIME_ID INT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    u_id INTEGER;
		C_ID INTEGER;
BEGIN
    SELECT email_to_id(p_email) INTO u_id;
    
    IF p_user_role = 'U' THEN
--         Insert into requested_chars table
        INSERT INTO USER_REQ_CHARACTER (character_name, ROLE, gender, profile_picture,USER_EMAIL)
        VALUES (p_name, p_role, p_gender, p_profile_picture,p_email);
        
        -- Print the user ID (for testing)
--         RAISE NOTICE 'User ID: %', u_id;
    ELSIF p_user_role = 'M' THEN
--         Insert into characters table
        INSERT INTO characters (character_name, ROLE, gender, profile_picture)
        VALUES (p_name, p_role, p_gender, p_profile_picture);
				
				SELECT MAX(CHARACTER_ID) INTO C_ID FROM "characters";
				
				INSERT INTO character_anime_relationship (character_id,anime_id) VALUES (C_ID,P_ANIME_ID);
				
				update moderator set others = others + 1 where moderator_id = u_id;
        
        -- Print the user ID and user role (for testing)
--         RAISE NOTICE 'User ID: %, User Role: %', u_id, p_user_role;
    ELSE
        -- Raise exception for invalid user role
        RAISE EXCEPTION 'Invalid user role';
    END IF;
END;
$$;

/

/
CREATE OR REPLACE TRIGGER ON "characters"
BEFORE INSERT
FOR EACH ROW

BEGIN
	INSERT INTO character_anime_relationship 
END;
/

-- Execute the stored procedure with sample values
CALL insert_character(
    'John Doe', -- p_name
    'Main',     -- p_role
    'Male',     -- p_gender
    'https://example.com/profile.jpg', -- p_profile_picture
    'U',        -- p_user_role
    'john@example.com' -- p_email
);
/

CREATE TABLE USER_REQ_CHARACTER(
	ID SERIAL PRIMARY KEY,
	ANIME_ID INT NOT NULL,
	CHARACTER_NAME VARCHAR(250),
	ROLE VARCHAR(250),
	GENDER VARCHAR(250),
	PROFILE_PICTURE TEXT,
	USER_EMAIL VARCHAR(250),
	MODERATOR_ID INT DEFAULT NULL,
	REQ_STATUS VARCHAR(250) DEFAULT 'pending',
	REQ_DATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	ACC_DATE TIMESTAMP DEFAULT NULL
)
;



INSERT INTO USER_REQ_CHARACTER (CHARACTER_NAME,ROLE,GENDER,PROFILE_PICTURE,USER_EMAIL,ANIME_ID)
VALUES(
		'John Doe 1', 
    'Main',     
    'Female',     
    'https://example.com/profile.jpg',
		'eren@mikasa.com',
		1
		);

DROP TABLE USER_REQ_CHARACTER;

SELECT *
FROM USER_REQ_CHARACTER;

-- Create a function for the trigger
CREATE OR REPLACE FUNCTION update_acc_date()
RETURNS TRIGGER AS $$
DECLARE
	C_ID INTEGER; 
BEGIN
    NEW.ACC_DATE := CURRENT_TIMESTAMP;
		NEW.REQ_STATUS := 'ACCEPTED';
		UPDATE MODERATOR SET OTHERS = OTHERS + 1 WHERE moderator_id = NEW.moderator_id;
		
		INSERT INTO "characters" (character_name, "ROLE", gender, profile_picture)
    VALUES (OLD.character_name, OLD."role", OLD.gender, OLD.profile_picture);
		
		SELECT MAX(CHARACTER_ID) INTO C_ID FROM "characters";
		
		INSERT INTO character_anime_relationship (character_id ,anime_id) values (C_ID, OLD.anime_id);
			
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
/
-- Create a trigger to call the function before update on REQ_STATUS
CREATE OR REPLACE TRIGGER update_acc_date_trigger
BEFORE UPDATE OF MODERATOR_ID
ON USER_REQ_CHARACTER
FOR EACH ROW
EXECUTE FUNCTION update_acc_date();
/
UPDATE USER_REQ_CHARACTER SET moderator_id = 2 WHERE ID =1; 

DROP FUNCTION update_acc_date;

DROP TRIGGER update_acc_date_trigger;

ALTER TABLE MODERATOR ADD COLUMN OTHERS INT DEFAULT 0;

ALTER TABLE moderator DROP COLUMN OTHERS;


/
CREATE OR REPLACE PROCEDURE insert_character(
    p_name VARCHAR(250),
    p_role VARCHAR(250),
    p_gender VARCHAR(250),
    p_profile_picture TEXT,
    p_user_role VARCHAR(255),
    p_email TEXT,
    p_anime_id INT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    u_id INTEGER;
    c_id INTEGER;
BEGIN
    SELECT email_to_id(p_email) INTO u_id;
    
    IF p_user_role = 'U' THEN
        -- Insert into requested_chars table
        INSERT INTO USER_REQ_CHARACTER (character_name, "role", gender, profile_picture, USER_EMAIL,anime_id)
        VALUES (p_name, p_role, p_gender, p_profile_picture, p_email,p_anime_id);
        
    ELSIF p_user_role = 'M' THEN
        -- Insert into characters table
        INSERT INTO "characters" (character_name, "ROLE", gender, profile_picture)
        VALUES (p_name, p_role, p_gender, p_profile_picture);
        
        -- Get the maximum character_id
        SELECT MAX(CHARACTER_ID) INTO c_id FROM "characters";
        
        -- Insert into character_anime_relationship
        INSERT INTO character_anime_relationship (character_id, anime_id)
        VALUES (c_id, p_anime_id);
        
        -- Update moderator count
        UPDATE moderator SET others = others + 1 WHERE moderator_id = u_id;
        
    ELSE
        -- Raise exception for invalid user role
        RAISE EXCEPTION 'Invalid user role';
    END IF;
END;
$$;
/

CALL insert_character(
    'John Doe6', -- p_name
    'Main',     -- p_role
    'Male',     -- p_gender
    'https://example.com/profile.jpg', -- p_profile_picture
    'U',        -- p_user_role
    'eren@mikasa.com', -- p_email
    1       -- p_anime_id
);
/
SELECT *
FROM "characters"
LIMIT 1;

SELECT *
FROM USER_REQ_CHARACTER
LIMIT 1;

SELECT *
FROM "characters" C JOIN character_anime_relationship CA ON (C.character_id = CA.character_id)
WHERE CHARACTER_NAME = 'John Doe6';




CREATE OR REPLACE FUNCTION GET_KARMA(EMAIL VARCHAR) RETURNS INT4 AS $$
DECLARE MID INT4;
ADDED_S INT4;
ADDED_E INT4;
DELETED_S INT4;
DELETED_E INT4;
R_V INT4;
F_C INT4;
O_C INT4;
KARMA INT4;
BEGIN
SELECT EMAIL_TO_ID(EMAIL) INTO MID;
SELECT added_series,
	added_episodes,
	deleted_series,
	deleted_episodes,
	review_verifications,
	filtered_comments,
	OTHERS
	INTO ADDED_S,
	ADDED_E,
	DELETED_S,
	DELETED_E,
	R_V,
	F_C,
	O_C
FROM moderator
WHERE moderator_id = MID;
KARMA := R_V * 2 + F_C * 1 + DELETED_E * 2 + ADDED_E * 3 + ADDED_S * 5 + DELETED_S * 4 + O_C * 3;
RETURN KARMA;
END;
$$ LANGUAGE plpgsql;

SELECT COUNT(*) FROM USER_REQ_CHARACTER
WHERE REQ_STATUS = 'ACCEPTED' AND USER_EMAIL = 'eren@mikasa.com';

update USER_REQ_CHARACTER set moderator_id = 18 where "id" = 8;

CREATE OR REPLACE FUNCTION GET_CONTRIBUTION(EMAIL VARCHAR) RETURNS FLOAT AS $$
DECLARE UID INT4;
ANIME_LIST INT4;
EP_NUM INT4;
FIN_CNT INT4;
REV INT4;
COM INT4;
REACH INT4;
ACT_TIME INTERVAL;
HOURS INT4;
CONT FLOAT;
CHAR_REQ INT4;
BEGIN
SELECT EMAIL_TO_ID(EMAIL) INTO UID;
SELECT DISTINCT(count(*)) INTO ANIME_LIST
from users_anime_list
where user_id = UID;
SELECT DISTINCT(count(*)) INTO EP_NUM
from watch_history
where user_id = UID;
SELECT DISTINCT(count(*)) INTO FIN_CNT
FROM users_anime_list
WHERE user_id = UID
	AND end_date IS NOT NULL;
SELECT DISTINCT(count(*)) INTO REV
FROM review
WHERE user_id = UID;
SELECT DISTINCT(count(*)) INTO COM
FROM comments
WHERE user_id = UID;
SELECT GET_REACH(UID) INTO REACH;
SELECT active_time INTO ACT_TIME
FROM "USER";
HOURS := EXTRACT(
	HOUR
	FROM ACT_TIME
);
SELECT count(*) INTO CHAR_REQ
from user_req_character
where user_email = EMAIL and req_status = 'ACCEPTED';
CONT := ANIME_LIST * 2 + EP_NUM * 0.8 + FIN_CNT * 5 + REV * 4 + COM * 1.2 + REACH * 2 + HOURS * 0.1 + CHAR_REQ * 2;
RETURN CONT;
END;
$$ LANGUAGE plpgsql;
/
SELECT count(*)
from user_req_character
where user_email = 'eren@mikasa.com' and req_status = 'ACCEPTED';

update user_req_character set moderator_id = 2 where id = 5;

SELECT others
from moderator
where moderator_id = 2;

SELECT *
FROM USER_REQ_CHARACTER
WHERE REQ_STATUS = 'pending'
ORDER BY REQ_DATE DESC
;


CREATE OR REPLACE FUNCTION GET_KARMA(EMAIL VARCHAR) RETURNS FLOAT AS $$
DECLARE MID INT4;
ADDED_S INT4;
ADDED_E INT4;
DELETED_S INT4;
DELETED_E INT4;
R_V INT4;
F_C INT4;
O_C INT4;
ACC_REQ INT4;
KARMA FLOAT;
BEGIN
SELECT EMAIL_TO_ID(EMAIL) INTO MID;
SELECT added_series,
	added_episodes,
	deleted_series,
	deleted_episodes,
	review_verifications,
	filtered_comments,
	OTHERS INTO ADDED_S,
	ADDED_E,
	DELETED_S,
	DELETED_E,
	R_V,
	F_C,
	O_C
FROM moderator
WHERE moderator_id = MID;
SELECT COUNT(*) INTO ACC_REQ
FROM USER_REQ_CHARACTER
WHERE moderator_id = MID AND REQ_STATUS = 'ACCEPTED';
KARMA := R_V * 2 + F_C * 1 + DELETED_E * 2 + ADDED_E * 3 + ADDED_S * 5 + DELETED_S * 4 + O_C * 3 + ACC_REQ * 1.5;
RETURN KARMA;
END;
$$ LANGUAGE plpgsql;

-- DROP FUNCTION GET_KARMA(EMAIL VARCHAR);


SELECT email_to_id( 'mod@mail.com' );

SELECT *
from  "characters"
ORDER BY character_id DESC
LIMIT 1;











