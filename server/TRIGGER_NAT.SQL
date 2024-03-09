CREATE OR REPLACE FUNCTION EMAIL_TO_ID(USERMAIL VARCHAR) RETURNS INT AS $$
DECLARE UID INT;
BEGIN
SELECT id INTO UID
FROM person
WHERE email = USERMAIL;
RETURN UID;
END;
$$ LANGUAGE plpgsql;
-- DROP TRIGGER IF EXISTS trigger_delete_reactions ON comments;
CREATE OR REPLACE FUNCTION update_filtered_comments() RETURNS TRIGGER AS $$ BEGIN IF TG_OP = 'UPDATE' THEN NEW.status := 'approved';
-------update in 2+ tables 2
NEW.moderator_id := NEW.moderator_id;
RAISE NOTICE 'Trigger update_filtered_comments() called with moderator_id: %',
NEW.moderator_id;
CALL FILTERED_COMMENTS_UPDATE(NEW.moderator_id, 'C');
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
/ --  DROP TRIGGER IF EXISTS update_filtered_comments ON comments;
CREATE TRIGGER trigger_update_filtered_comments
AFTER
UPDATE
	OR DELETE ON comments FOR EACH ROW EXECUTE FUNCTION update_filtered_comments();
/
CREATE OR REPLACE FUNCTION delete_reactions_after_comment_deletion() RETURNS TRIGGER AS $$ BEGIN
DELETE FROM reaction
WHERE comment_id = OLD.comment_id;
RETURN OLD;
END;
$$ LANGUAGE plpgsql;
/ CREATE TRIGGER trigger_delete_reactions BEFORE DELETE ON comments FOR EACH ROW EXECUTE FUNCTION delete_reactions_after_comment_deletion();
/
CREATE OR REPLACE PROCEDURE FILTERED_COMMENTS_UPDATE(MOD_ID IN INT4, FLAG VARCHAR) language plpgsql as $$ BEGIN IF FLAG = 'C' THEN
UPDATE moderator
SET filtered_comments = filtered_comments + 1
WHERE moderator_id = MOD_ID;
ELSE
UPDATE moderator
SET review_verifications = review_verifications + 1
WHERE moderator_id = MOD_ID;
END IF;
END;
$$ /
CREATE OR REPLACE PROCEDURE update_users_anime_list_status(
		p_status VARCHAR,
		p_anime_id INT,
		p_user_id INT
	) LANGUAGE plpgsql AS $$ BEGIN IF p_status = 'Watched' THEN
UPDATE users_anime_list
SET status = p_status,
	end_date = CURRENT_TIMESTAMP
WHERE anime_id = p_anime_id
	AND user_id = p_user_id;
ELSE
UPDATE users_anime_list
SET status = p_status
WHERE anime_id = p_anime_id
	AND user_id = p_user_id;
END IF;
END;
$$;
/
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
WHERE moderator_id = MID
	AND REQ_STATUS = 'ACCEPTED';
KARMA := R_V * 2 + F_C * 1 + DELETED_E * 2 + ADDED_E * 3 + ADDED_S * 5 + DELETED_S * 4 + O_C * 3 + ACC_REQ * 1.5;
RETURN KARMA;
END;
$$ LANGUAGE plpgsql;
/
CREATE OR REPLACE FUNCTION GET_REACH(UID INT4) RETURNS INT4 AS $$
DECLARE REACH INT4;
I INT4;
J INT4;
CNT INT4 := 0;
R RECORD;
S RECORD;
BEGIN FOR R IN
SELECT *
FROM comments
WHERE USER_ID = UID LOOP I := R.comment_id;
FOR S IN
SELECT *
FROM comments
WHERE USER_ID <> UID LOOP J := S.parent_id;
IF I = J THEN CNT := CNT + 1;
END IF;
END LOOP;
END LOOP;
-- Assign CNT to REACH or return CNT directly based on your requirements
REACH := CNT;
RETURN REACH;
END;
$$ LANGUAGE plpgsql;
/
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
CONT := ANIME_LIST * 2 + EP_NUM * 0.8 + FIN_CNT * 5 + REV * 4 + COM * 1.2 + REACH * 2 + HOURS * 0.1;
RETURN CONT;
END;
$$ LANGUAGE plpgsql;
/ CREATE INDEX ON ANIME (anime_id);
CREATE INDEX ON ANIME (anime_name);
CREATE INDEX ON "characters" (CHARACTER_NAME);
CREATE INDEX ON tags (TAG_NAME);
CREATE INDEX ON episodes (anime_id);
CREATE INDEX ON ANIME (mal_score);
CREATE INDEX ON ANIME (YEAR);
CREATE INDEX ON person(EMAIL);
CREATE INDEX ON staffs (ANIME_ID);
CREATE OR REPLACE PROCEDURE insert_character(
		-------------------------------------------------------------------------insert 3+ tables 1
		p_name VARCHAR(250),
		p_role VARCHAR(250),
		p_gender VARCHAR(250),
		p_profile_picture TEXT,
		p_user_role VARCHAR(255),
		p_email TEXT,
		p_anime_id INT
	) LANGUAGE plpgsql AS $$
DECLARE u_id INTEGER;
c_id INTEGER;
BEGIN
SELECT email_to_id(p_email) INTO u_id;
IF p_user_role = 'U' THEN -- Insert into requested_chars table
INSERT INTO USER_REQ_CHARACTER (
		character_name,
		"role",
		gender,
		profile_picture,
		USER_EMAIL,
		anime_id
	)
VALUES (
		p_name,
		p_role,
		p_gender,
		p_profile_picture,
		p_email,
		p_anime_id
	);
ELSIF p_user_role = 'M' THEN -- Insert into characters table
INSERT INTO "characters" (character_name, "ROLE", gender, profile_picture)
VALUES (p_name, p_role, p_gender, p_profile_picture);
-- Get the maximum character_id
SELECT MAX(CHARACTER_ID) INTO c_id
FROM "characters";
-- Insert into character_anime_relationship
INSERT INTO character_anime_relationship (character_id, anime_id)
VALUES (c_id, p_anime_id);
-- Update moderator count
UPDATE moderator
SET others = others + 1
WHERE moderator_id = u_id;
ELSE -- Raise exception for invalid user role
RAISE EXCEPTION 'Invalid user role';
END IF;
END;
$$;
/
CREATE OR REPLACE FUNCTION update_acc_date() RETURNS TRIGGER AS $$
DECLARE C_ID INTEGER;
BEGIN NEW.ACC_DATE := CURRENT_TIMESTAMP;
NEW.REQ_STATUS := 'ACCEPTED';
UPDATE MODERATOR
SET OTHERS = OTHERS + 1
WHERE moderator_id = NEW.moderator_id;
INSERT INTO "characters" (character_name, "ROLE", gender, profile_picture)
VALUES (
		OLD.character_name,
		OLD."role",
		OLD.gender,
		OLD.profile_picture
	);
SELECT MAX(CHARACTER_ID) INTO C_ID
FROM "characters";
INSERT INTO character_anime_relationship (character_id, anime_id)
values (C_ID, OLD.anime_id);
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
/ -- Create a trigger to call the function before update on REQ_STATUS
CREATE OR REPLACE TRIGGER update_acc_date_trigger BEFORE
UPDATE OF MODERATOR_ID ON USER_REQ_CHARACTER FOR EACH ROW EXECUTE FUNCTION update_acc_date();
---------------------update on 2+ tables 1
/ ----------------------------------------------------------
/
CREATE OR REPLACE FUNCTION delete_review_notification() RETURNS TRIGGER AS $$
DECLARE A_NAME VARCHAR(100);
BEGIN
SELECT ANIME_NAME INTO A_NAME
FROM ANIME
WHERE ANIME_ID = OLD.ANIME_ID;
INSERT INTO notifications (users_id, NOTIFICATIONS, TRACK_DATE)
VALUES (
		OLD.user_id,
		'Your review on anime ' || A_NAME || ' has been deleted as it violates community guidelines!!',
		CURRENT_TIMESTAMP
	);
RETURN OLD;
END;
$$ LANGUAGE plpgsql;
/ / CREATE TRIGGER before_delete_review BEFORE DELETE ON review FOR EACH ROW EXECUTE FUNCTION delete_review_notification();
/
CREATE OR REPLACE FUNCTION update_review_notification() RETURNS TRIGGER AS $$
DECLARE A_NAME VARCHAR(100);
BEGIN IF NEW.STATUS = 'approved' THEN
SELECT ANIME_NAME INTO A_NAME
FROM ANIME
WHERE ANIME_ID = OLD.ANIME_ID;
INSERT INTO notifications (users_id, NOTIFICATIONS, TRACK_DATE)
VALUES (
		OLD.user_id,
		'Your review on anime ' || A_NAME || ' - ' || OLD.review_text || ' has been approved!!',
		CURRENT_TIMESTAMP
	);
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
/ CREATE TRIGGER before_update_review_status BEFORE
UPDATE OF status ON review FOR EACH ROW EXECUTE FUNCTION update_review_notification();
/ /
CREATE OR REPLACE FUNCTION update_comment_notification() RETURNS TRIGGER AS $$
DECLARE A_NAME VARCHAR(100);
BEGIN IF NEW.status = 'approved' THEN
SELECT ANIME_NAME INTO A_NAME
FROM ANIME
WHERE ANIME_ID = OLD.ANIME_ID;
INSERT INTO notifications (users_id, NOTIFICATIONS, TRACK_DATE)
VALUES (
		OLD.user_id,
		'Your comment on anime ' || A_NAME || ' Ep-' || OLD.episode_no || ' (' || OLD."text" || ') has been approved!!',
		CURRENT_TIMESTAMP
	);
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
/ CREATE TRIGGER before_update_comment_status BEFORE
UPDATE OF status ON comments FOR EACH ROW EXECUTE FUNCTION update_comment_notification();
/ /
CREATE OR REPLACE FUNCTION delete_comment_notification() RETURNS TRIGGER AS $$
DECLARE A_NAME VARCHAR(100);
BEGIN
SELECT ANIME_NAME INTO A_NAME
FROM ANIME
WHERE ANIME_ID = OLD.ANIME_ID;
INSERT INTO notifications (users_id, NOTIFICATIONS, TRACK_DATE)
VALUES (
		OLD.user_id,
		'Your comment on anime ' || A_NAME || ' Ep-' || OLD.episode_no || ' (' || OLD."text" || ') has been deleted as it violates community guidelines!!',
		CURRENT_TIMESTAMP
	);
RETURN OLD;
END;
$$ LANGUAGE plpgsql;
/ CREATE TRIGGER before_delete_comment BEFORE DELETE ON comments FOR EACH ROW EXECUTE FUNCTION delete_comment_notification();
/
CREATE OR REPLACE PROCEDURE ADD_PLAN (U_ID INT, P_ID INT) LANGUAGE plpgsql AS $$
DECLARE PLAN_INT INT;
DAY_STR VARCHAR(250);
P_BALANCE INT;
E_DATE TIMESTAMP;
P_DATE TIMESTAMP;
BEGIN
SELECT PLAN_INTERVAL,
	PLAN_VALUE INTO PLAN_INT,
	P_BALANCE
FROM PLANS
WHERE PLAN_ID = P_ID;
SELECT PLAN_END_DATE INTO P_DATE
FROM "USER"
WHERE USER_ID = U_ID;
IF COALESCE(P_DATE, CURRENT_TIMESTAMP) > CURRENT_TIMESTAMP THEN E_DATE := COALESCE(P_DATE, CURRENT_TIMESTAMP);
ELSE E_DATE := CURRENT_TIMESTAMP;
END IF;
DAY_STR := PLAN_INT || ' days';
UPDATE "USER"
SET PLAN_END_DATE = E_DATE + CAST(DAY_STR AS INTERVAL),
	WALLET_BALANCE = WALLET_BALANCE - P_BALANCE,
	CURRENT_PLAN = P_ID
WHERE user_id = U_ID;
END;
$$;
/
CREATE OR REPLACE PROCEDURE ADD_NEW_PLAN (M_ID INT, P_NAME VARCHAR, P_VALUE INT, P_INT INT) LANGUAGE plpgsql AS $$
DECLARE BEGIN
INSERT INTO PLANS (PLAN_NAME, PLAN_VALUE, PLAN_INTERVAL)
VALUES (P_NAME, P_VALUE, P_INT);
UPDATE moderator
SET OTHERS = OTHERS + 1
WHERE moderator_id = M_ID;
END;
$$;
/
CREATE OR REPLACE PROCEDURE UPDATE_BALANCE (MAIL VARCHAR, BALANCE INT) LANGUAGE plpgsql AS $$
DECLARE U_ID INT;
BEGIN
SELECT email_to_id(MAIL) INTO U_ID;
UPDATE "USER"
SET WALLET_BALANCE = WALLET_BALANCE + BALANCE
WHERE USER_ID = U_ID;
END;
$$;
/
CREATE OR REPLACE FUNCTION notifications_trigger_function() RETURNS TRIGGER AS $$ BEGIN NEW.is_seen := 'f';
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER notifications_before_insert BEFORE
INSERT ON notifications FOR EACH ROW EXECUTE FUNCTION notifications_trigger_function();
/ -- For adding all episodes
DO $$
DECLARE u_id INT;
n VARCHAR;
R RECORD;
AE RECORD;
I INT;
BEGIN -- Loop through each user in the user table
FOR R IN
SELECT *
FROM anime
where anime_id is not NULL
	and number_of_episodes is not NULL
	and anime_id <> 1
	and anime_id <> 1176 LOOP -- Insert notification for each user
	FOR I IN 1..R.number_of_episodes LOOP
INSERT INTO episodes
VALUES (
		R.anime_id,
		I,
		R.anime_name || '_episode_' || I,
		R.title_screen,
		24,
		CURRENT_DATE,
		'Y',
		'N/A',
		'N/A'
	);
END LOOP;
END LOOP;
END $$;
--------------------------------LAST_UPDATE---------------------------------------	
----------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE ADD_PLAN (U_ID INT, P_ID INT) LANGUAGE plpgsql AS $$
DECLARE PLAN_INT INT;
DAY_STR VARCHAR(250);
P_BALANCE INT;
E_DATE TIMESTAMP;
P_DATE TIMESTAMP;
BEGIN
SELECT PLAN_INTERVAL,
	PLAN_VALUE INTO PLAN_INT,
	P_BALANCE
FROM PLANS
WHERE PLAN_ID = P_ID;
SELECT PLAN_END_DATE INTO P_DATE
FROM "USER"
WHERE USER_ID = U_ID;
IF COALESCE(P_DATE, CURRENT_TIMESTAMP) > CURRENT_TIMESTAMP THEN E_DATE := COALESCE(P_DATE, CURRENT_TIMESTAMP);
ELSE E_DATE := CURRENT_TIMESTAMP;
END IF;
DAY_STR := PLAN_INT || ' days';
UPDATE "USER"
SET PLAN_END_DATE = E_DATE + CAST(DAY_STR AS INTERVAL),
	WALLET_BALANCE = WALLET_BALANCE - P_BALANCE,
	CURRENT_PLAN = P_ID
WHERE user_id = U_ID;
END;
$$;
/
ALTER TABLE "USER"
ALTER COLUMN most_favourite_anime
SET DEFAULT 0;

 
CREATE OR REPLACE FUNCTION insert_person_function()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'U' THEN
        INSERT INTO "USER" (user_id, bio, most_favourite_anime, first_access, last_access, active_time,wallet_balance,plan_end_date)
        VALUES (NEW.id, '', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP - CURRENT_TIMESTAMP,30,CURRENT_TIMESTAMP + INTERVAL '7 days');
    ELSE
        INSERT INTO moderator (moderator_id, added_series, deleted_series, added_episodes, deleted_episodes, review_verifications, filtered_comments)
        VALUES (NEW.id, 0, 0, 0, 0, 0, 0);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_person_trigger
AFTER INSERT ON person
FOR EACH ROW
EXECUTE FUNCTION insert_person_function();