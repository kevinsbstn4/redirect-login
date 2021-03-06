var mysql = require("mysql");
var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");

var connection = mysql.createConnection({
  host: "localhost",
  user: "kevin",
  password: "0000",
  database: "nodelogin"
});

var app = express();
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", function(request, response) {
  response.sendFile(path.join(__dirname + "/login.html"));
});

app.post("/auth", function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function(error, results, fields) {
        if (results.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect("/home");
        } else {
          response.redirect("http://localhost:8000/");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

/*
app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

*/
app.get("/home", function(request, response) {
  if (request.session.loggedin) {
    response.redirect("/index");
  } else {
    response.send("Please login to view this page!");
  }
  response.end();
});

app.get("/index", (request, response) => {
  if (request.session.loggedin) {
    request.session.loggedin = false;
    response.sendfile("public/home.html");
  } else {
    response.redirect("http://localhost:8000/");
  }
});

app.listen(8000, () => {
  console.log("Server is running at port 8000");
});
