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

