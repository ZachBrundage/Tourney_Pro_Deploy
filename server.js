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


// Routes
app.get("/", function(req, res){
    
    console.log("SERVER UP");
    res.render("login");

});

app.post("/login", function(req, res){
    
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    
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

app.get("/myProfile", function(req, res){
    
    console.log("myProfile");
    res.render("myProfile");

});

app.get("/myTourneys", function(req, res){
    
    console.log("myTourneys");
    res.render("myTourneys");

});

app.get("/createTourney", function(req, res){
    
    console.log("createTourney");
    res.render("createTourney");

});

app.get("/register", function(req, res){
    
    console.log("register");
    res.render("register");

});

// Server Listening
app.listen(port, function() {
    console.log("The server is on port 8080");
});