---------------------------------------------------------------------------------------TRIGGERS BEFORE DELETE comments
CREATE 
	OR REPLACE FUNCTION before_delete_comments_function ( ) RETURNS TRIGGER AS $$ BEGIN
	DELETE 
	FROM
		reaction 
	WHERE
		comment_id = OLD.comment_id;
	RETURN OLD;
	
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER beforeDeleteComments BEFORE DELETE ON comments FOR EACH ROW
EXECUTE FUNCTION before_delete_comments_function ( );----------------------------------------------------------------delete 1 (soft)

----------------------------------------------------------------------------------------BEFORE DELETE ANIMES

CREATE OR REPLACE FUNCTION before_delete_anime_function()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM tag_id_table WHERE anime_id = OLD.anime_id;
    DELETE FROM users_anime_list WHERE anime_id = OLD.anime_id;
		DELETE FROM watch_history WHERE anime_id = OLD.anime_id;
    DELETE FROM comments WHERE anime_id = OLD.anime_id;
    DELETE FROM sound_tracks WHERE anime_id = OLD.anime_id;
    DELETE FROM review WHERE anime_id = OLD.anime_id;
    DELETE FROM anime_studio_relationship WHERE anime_id = OLD.anime_id;
    DELETE FROM character_anime_relationship WHERE anime_id = OLD.anime_id;
    DELETE FROM genre_anime_relationship WHERE anime_id = OLD.anime_id;
    DELETE FROM staffs WHERE anime_id = OLD.anime_id;
    DELETE FROM episodes WHERE anime_id = OLD.anime_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_delete_anime
BEFORE DELETE ON anime
FOR EACH ROW
EXECUTE FUNCTION before_delete_anime_function();------------------------------------------------------delete 2

----------------------------------------------------------------------------------BEFORE DELETE ANIME episodes

CREATE OR REPLACE FUNCTION before_delete_episode_function()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM watch_history WHERE anime_id = OLD.anime_id AND episode_no = OLD.episode_no;
    DELETE FROM comments WHERE anime_id = OLD.anime_id AND episode_no = OLD.episode_no;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER BeforeDeleteEpisode
BEFORE DELETE ON episodes
FOR EACH ROW
EXECUTE FUNCTION before_delete_episode_function();-----------------------------------------------------------delete 3

----------------------------------------------------------------------------------------CREATE TABLE NOTIFICATIONS

CREATE TABLE NOTIFICATIONS(

users_id INT REFERENCES person(id),
notifications VARCHAR(1000),
is_seen VARCHAR(3)

);

---------------------------------------------------------------------------------------REMOVE USER

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

-
CREATE OR REPLACE FUNCTION after_inserting_episodes_function()
RETURNS TRIGGER AS $$
DECLARE 
    NAME VARCHAR(255);
    USER_ROW person%ROWTYPE;
BEGIN
    SELECT anime_name INTO NAME
    FROM anime
    WHERE anime_id = NEW.anime_id;

    FOR USER_ROW IN SELECT * FROM person LOOP
			if user_row.role='U' THEN
        INSERT INTO notifications (users_id, notifications, track_date)
        VALUES (USER_ROW."id",'Hey, '||USER_ROW.user_name|| ' We would like to announce that New episode for ' || NAME || ' has been released !!!', CURRENT_TIMESTAMP);
			end if;	
    END LOOP;

    RETURN NULL; -- Since this is an AFTER INSERT trigger, no modifications to the row are allowed, so we return NULL.
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_inserting_episodes
AFTER INSERT ON episodes
FOR EACH ROW
EXECUTE FUNCTION after_inserting_episodes_function();

-----------------------------------------------------------------------------------------After insert anime

CREATE OR REPLACE FUNCTION after_inserting_anime_function()
RETURNS TRIGGER AS $$
DECLARE 
    NAME VARCHAR(255);
    USER_ROW person%ROWTYPE;
BEGIN
    SELECT anime_name INTO NAME
    FROM anime
    WHERE anime_id = NEW.anime_id;

    FOR USER_ROW IN SELECT * FROM person LOOP
			if user_row.role='U' THEN
        INSERT INTO notifications (users_id, notifications, track_date)
        VALUES (USER_ROW."id",'Hey, '||USER_ROW.user_name|| ' We would like to announce that a brand new anime named: ' || NAME || ' has been released !!!', CURRENT_TIMESTAMP);
			end if;	
    END LOOP;

    RETURN NULL; -- Since this is an AFTER INSERT trigger, no modifications to the row are allowed, so we return NULL.
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_inserting_anime
AFTER INSERT ON anime
FOR EACH ROW
EXECUTE FUNCTION after_inserting_anime_function();


----------------------------------------------------------------------------------after insert person

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

--------------------------------------------------------------------------------------------------