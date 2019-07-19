var express = require("express");
var {Pool} = require('pg');
var app = express();
var bodyParser = require("body-parser");

// Server Port
var port = process.env.PORT || 8080;


// Heroku DB connection 
var connectionString = process.env.DATABASE_URL || "postgres://sezwxagibmnild:011c15c1eda11d997cc06823796c598c6962193d626a2a96bcc65a1d4c7368cf@ec2-107-22-211-248.compute-1.amazonaws.com:5432/d9f9mroorggnn4?ssl=true";
var pool = new Pool({connectionString: connectionString});

// View Setup

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "views");
app.set("view engine", "ejs");

// Globals
var userID;
var tourneyID;

// Routes
app.get("/", function(req, res){
    
    console.log("SERVER UP");
    res.render("login");

});

// Registration
app.post("/login", function(req, res){
    
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    
    console.log(username);
    console.log(password);
    console.log(email);
    
    var sq = "\'";
    var sql = "INSERT INTO users (username, pass, email) values (" + sq + username + sq + ", " + sq + password + sq + ", " + sq + email + sq + ")";
    //console.log("Sending Query: " + sql);
    
    pool.query(sql, function(err, result) {
    // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        };
    });
    res.render("login");
});

// Login Verification
app.post("/verify", function(req, res){
    
    var username = req.body.username;
    var password = req.body.password;
    
    var sq = "\'";
    var sql = "SELECT user_id FROM users WHERE username =" + sq + username + sq + "AND pass =" + sq + password + sq;
    pool.query(sql, function(err, result) {
    // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            res.render("error");
        };
        if (result.rowCount > 0){
            console.log(result.rowCount);
            userID = result.rows[0].user_id;
            // Pull Profile Info
            var psql = "SELECT username, birthday, bio, avatar FROM users WHERE user_id =" + userID;
            console.log(psql);
            pool.query(psql, function(err, results){
                if (err) {
                    console.log("Error in query: ")
                    console.log(err);
                    res.render("error");
                }
                else {
                    var params = {
                        username: results.rows[0].username,
                        birthday: results.rows[0].birthday,
                        bio: results.rows[0].bio,
                        avatar: results.rows[0].avatar
                    };
                    console.log(params);
                    res.render("myProfile", params);
                }
            });   
        }
        else
            res.render("error");
    });
});

app.post("/postTourney", function(req, res){
    
    var name = req.body.tourneyName;
    var rules = req.body.rules;
    var prize = req.body.prize;
    
    var sq = "\'";
    var sql = "INSERT INTO tourneys (name, rules, prize, host) values (" + sq + name + sq + ", " + sq + rules + sq + ", " + sq + prize + sq + ", " + sq + userID + sq + ")";
    //console.log("Sending Query: " + sql);
    
    pool.query(sql, function(err, result) {
    // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        else {
            var psql = "SELECT * FROM tourneys WHERE host =" + userID;
            console.log(psql);
            pool.query(psql, function(err, results){
                if (err) {
                    console.log("Error in query: ")
                    console.log(err);
                    res.render("error");
                }
                else {
                    var params = [];
                    for (var i = 0; i < results.rowCount; i++){
                        var obj = {
                            name: results.rows[i].name,
                            rules: results.rows[i].rules
                        };
                        params.push(obj);
                    }
                    console.log(params);
                    res.render("myTourneys", {tourneys: params});
                }
            });
        }
    });
});

app.get("/myProfile", function(req, res){
    
    console.log("myProfile");
    var psql = "SELECT username, birthday, bio, avatar FROM users WHERE user_id =" + userID;
    console.log(psql);
    pool.query(psql, function(err, results){
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            res.render("error");
        }
        else {
            var params = {
                username: results.rows[0].username,
                birthday: results.rows[0].birthday,
                bio: results.rows[0].bio,
                avatar: results.rows[0].avatar
            };
            console.log(params);
            res.render("myProfile", params);
        }
    });
});

app.get("/myTourneys", function(req, res){
    
    console.log("myTourneys");
    var psql = "SELECT * FROM tourneys WHERE host =" + userID;
    console.log(psql);
    pool.query(psql, function(err, results){
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            res.render("error");
        }
        else {
            var params = [];
            for (var i = 0; i < results.rowCount; i++){
                var obj = {
                    name: results.rows[i].name,
                    rules: results.rows[i].rules,
                    id: results.rows[i].tourney_id
                };
                params.push(obj);
            }
            console.log(params[0].id);
            res.render("myTourneys", {tourneys: params});
        }
    });
});

app.get("/createTourney", function(req, res){
    
    console.log("createTourney");
    res.render("createTourney");

});

app.get("/register", function(req, res){
    
    console.log("register");
    res.render("register");

});

app.get("/goEditPage", function(req, res){
    
    console.log("editProfile");
    res.render("editProfile");

});

app.post("/editProfile", function(req, res){
    
    console.log("editProfile");
    var birthday = req.body.birthday;
    var bio = req.body.bio;
    var avatar = req.body.avatar;
    
    console.log(birthday);
    console.log(bio);
    console.log(avatar);
    
    var sq = "\'";
    var sql = "UPDATE users SET birthday =" + sq + birthday + sq + ", bio =" + sq + bio + sq + ", avatar =" + sq + avatar + sq + "WHERE user_id =" + userID;
    console.log("Sending Query: " + sql);
    
    pool.query(sql, function(err, result) {
    // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        else {
            var psql = "SELECT username, birthday, bio, avatar FROM users WHERE user_id =" + userID;
            console.log(psql);
            pool.query(psql, function(err, results){
                if (err) {
                    console.log("Error in query: ")
                    console.log(err);
                    res.render("error");
                }
                else {
                    var params = {
                        username: results.rows[0].username,
                        birthday: results.rows[0].birthday,
                        bio: results.rows[0].bio,
                        avatar: results.rows[0].avatar
                    };
                    res.render("myProfile", params);
                }
            });
        }
    });
});

app.get("/compTourneys", function(req, res){
    
    console.log("compTourneys");
    var psql = "SELECT name, rules, tourneys.tourney_id FROM tourneys INNER JOIN participants ON tourneys.tourney_id = participants.tourney_id INNER JOIN users ON users.user_id = participants.user_id WHERE users.user_id =" + userID;
    console.log(psql);
    pool.query(psql, function(err, results){
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            res.render("error");
        }
        else {
            var params = [];
            for (var i = 0; i < results.rowCount; i++){
                var obj = {
                    name: results.rows[i].name,
                    rules: results.rows[i].rules,
                    id: results.rows[i].tourney_id
                };
                params.push(obj);
            }
            console.log(params);
            res.render("compTourneys", {tourneys: params});
        }
    });
});

app.post("/viewTourney", function(req, res){
    
    console.log("viewTourney");
    var tourneyId = req.body.tourneyId;
    tourneyID = tourneyId;
    console.log(tourneyId);
    
    var psql = "SELECT * FROM tourneys WHERE tourney_id =" + tourneyId;
    console.log(psql);
    pool.query(psql, function(err, results){
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            res.render("error");
        }
        else {
            var params = [];
            for (var i = 0; i < results.rowCount; i++){
                var obj = {
                    name: results.rows[i].name,
                    rules: results.rows[i].rules,
                    prize: results.rows[i].prize,
                    id: results.rows[i].tourney_id
                };
                params.push(obj);
            }
            console.log(params);
            res.render("viewTourney", {tourney: params});
        }
    });
});

app.post("/viewParticipants", function(req, res){
    
    console.log("viewParticipants");
    var tourneyId = req.body.tourneyId;
    var psql = "SELECT username, avatar FROM users INNER JOIN participants ON users.user_id = participants.user_id INNER JOIN tourneys ON tourneys.tourney_id = participants.tourney_id WHERE tourneys.tourney_id =" + tourneyId;
    console.log(psql);
    pool.query(psql, function(err, results){
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            res.render("error");
        }
        else {
            var sql = "SELECT * FROM participants WHERE tourney_id =" + tourneyId;
            pool.query(sql, function(err, participants){
                if (err) {
                    console.log("Error in query: ")
                    console.log(err);
                    res.render("error");
                }
                else {
                    var params = [];
                    for (var i = 0; i < results.rowCount; i++){
                        var obj = {
                            name: results.rows[i].username,
                            icon: results.rows[i].avatar,
                            rank: participants.rows[i].rank,
                            wins: participants.rows[i].wins,
                            losses: participants.rows[i].losses,
                            status: participants.rows[i].status,
                            id: participants.rows[i].participant_id,
                            tourney: tourneyId 
                        };
                        params.push(obj);
                    }
                    console.log(params);
                    res.render("viewParticipants", {people: params});
                }
            });  
        }
    });
});

app.post("/editParticipant", function(req, res){
    
    console.log("editParticipants");
    var rank = req.body.rank;
    var wins = req.body.wins;
    var losses = req.body.losses;
    var status = req.body.status;
    var partId = req.body.partId;
    var tourneyId = req.body.tourneyId;
    
    var sq = "\'";
    var sql = "UPDATE participants SET rank = " + rank + ", wins = " + wins + ", losses = " + losses + ", status = " + sq + status + sq + "WHERE participant_id = " + partId;
    console.log("Sending Query: " + sql);
    
    pool.query(sql, function(err, result) {
    // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        else {
            console.log("viewParticipants");
            var psql = "SELECT username, avatar FROM users INNER JOIN participants ON users.user_id = participants.user_id INNER JOIN tourneys ON tourneys.tourney_id = participants.tourney_id WHERE tourneys.tourney_id = " + tourneyID;
            console.log(psql);
            pool.query(psql, function(err, results){
                if (err) {
                    console.log("Error in query: ")
                    console.log(err);
                    res.render("error");
                }
                else {
                    var sql = "SELECT * FROM participants WHERE tourney_id =" + tourneyID;
                    pool.query(sql, function(err, participants){
                        if (err) {
                            console.log("Error in query: ")
                            console.log(err);
                            res.render("error");
                        }
                        else {
                            var params = [];
                            for (var i = 0; i < results.rowCount; i++){
                                var obj = {
                                    name: results.rows[i].username,
                                    icon: results.rows[i].avatar,
                                    rank: participants.rows[i].rank,
                                    wins: participants.rows[i].wins,
                                    losses: participants.rows[i].losses,
                                    status: participants.rows[i].status,
                                    id: participants.rows[i].participant_id
                                };
                                params.push(obj);
                            }
                            console.log(params);
                            res.render("viewParticipants", {people: params});
                        }
                    });  
                }
            });
        }
    });
});

app.post("/toEditParticipants", function(req, res){
    
    console.log("toEditParticipants");
    var tourneyId = req.body.tourneyId;
    var partId = req.body.partId;
    
    var params = [];
    
    var obj = {
        tourneyId: tourneyId,
        partId: partId
    };
    params.push(obj);
    console.log(params);
    res.render("editParticipant", {tourney: params});
});

// Server Listening
app.listen(port, function() {
    console.log("The server is on port 8080");
});