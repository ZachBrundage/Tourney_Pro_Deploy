CREATE TABLE users
(
    user_id SERIAL NOT NULL PRIMARY KEY,
    username varchar(80) NOT NULL UNIQUE,
    pass varchar(255) NOT NULL,
    email varchar(225) NOT NULL,
    birthday date,
    bio text
);

-- Create New User Query --
INSERT INTO users (username, pass, email) VALUES ();

-- Add Birthday Query --
UPDATE users SET birthday = '' WHERE user_id = ;

-- Add Bio Query --
UPDATE users SET bio = '' WHERE user_id = ;

-- Create Tourneys Table --

CREATE TABLE tourneys
(
    tourney_id SERIAL NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL,
    rules text,
    prize text,
    host INTEGER NOT NULL,
    FOREIGN KEY (host) REFERENCES users (user_id)
);

-- Create Tourney Query --
INSERT INTO tourneys (name, rules, prize, host) VALUES ('First_Test', '1v1', '$15', 1);

-- Create Participants Table --
CREATE TABLE participants
(
    participant_id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tourney_id INTEGER NOT NULL,
    rank INTEGER,
    wins INTEGER,
    losses INTEGER,
    status varchar(80),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (tourney_id) REFERENCES tourneys (tourney_id)
);

-- Add Participant Query --
INSERT INTO participants (user_id, tourney_id) VALUES (1, 1);

-- Update Participant Query --
UPDATE participants 
SET rank = 3
, wins = 0
, losses = 2
, status = 'Eliminated' 
WHERE participant_id = 10;

-- Matches Table --
CREATE TABLE matches
(
    match_id SERIAL NOT NULL PRIMARY KEY,
    tourney_id INTEGER NOT NULL,
    comp_one INTEGER NOT NULL,
    comp_two INTEGER NOT NULL,
    match_schedule TEXT,
    winner INTEGER,
    loser INTEGER,
    FOREIGN KEY (comp_one) REFERENCES users (user_id),
    FOREIGN KEY (comp_two) REFERENCES users (user_id)
);

-- Create Match Query --
INSERT INTO matches (tourney_id, comp_one, comp_two, match_schedule)
VALUES (2, 8, 6, 'TODAY, ONLINE');

-- Update Match Query --
UPDATE matches
SET winner = 1
, loser = 6
WHERE match_id = 1;

-- Tournaments User Participates In --
SELECT name, rules, tourneys.tourney_id FROM tourneys
INNER JOIN participants ON tourneys.tourney_id = participants.tourney_id
INNER JOIN users ON users.user_id = participants.user_id
WHERE users.user_id = 6;

-- Usernames for each Participant --
SELECT username, avatar FROM users
INNER JOIN participants ON users.user_id = participants.user_id
INNER JOIN tourneys ON tourneys.tourney_id = participants.tourney_id
WHERE tourneys.tourney_id = 2;

-- Usernames for each Match --
SELECT username, avatar, match_id FROM users
INNER JOIN matches ON users.user_id = matches.comp_one
OR users.user_id = matches.comp_two
INNER JOIN tourneys ON tourneys.tourney_id = matches.tourney_id
WHERE tourneys.tourney_id = 2
ORDER BY matches.match_id ASC;

-- Match Details --
SELECT * FROM matches WHERE tourney_id = 2;




































