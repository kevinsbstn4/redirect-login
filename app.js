//use path module
const path = require("path");
//use express module
const express = require("express");
//use hbs view engine
const hbs = require("hbs");
//use bodyParser middleware
const bodyParser = require("body-parser");
//use mysql database
const mysql = require("mysql");
const app = express();

//Create connection
const conn = mysql.createConnection({
  host: "localhost",
  user: "kevin",
  password: "0000",
  database: "daftar_pasien"
});

//connect to database
conn.connect(err => {
  if (err) throw err;
  console.log("Mysql Connected...");
});

//set views file
app.set("views", path.join(__dirname, "views"));
//set view engine
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use("/assets", express.static(__dirname + "/public"));
app.use(express.static("views"));

app.get("/pasien", (req, res) => {
  let sql = "SELECT * FROM list";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.render("pasien", {
      results: results
    });
  });
});

//route for insert data
app.post("/save", (req, res) => {
  let data = {
    nama_pasien: req.body.nama_pasien,
    umur_pasien: req.body.umur_pasien,
    asal_rs: req.body.asal_rs,
    status: req.body.status,
    asal_rumah: req.body.asal_rumah
  };
  let sql = "INSERT INTO list SET ?";
  let query = conn.query(sql, data, (err, results) => {
    if (err) throw err;
    res.redirect("/pasien");
  });
});

//route for update data
app.post("/update", (req, res) => {
  let sql =
    "UPDATE list SET nama_pasien='" +
    req.body.nama_pasien +
    "', umur_pasien='" +
    req.body.umur_pasien +
    "', asal_rs='" +
    req.body.asal_rs +
    "', status='" +
    req.body.status +
    "', asal_rumah='" +
    req.body.asal_rumah +
    "' WHERE nis=" +
    req.body.id;
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/pasien");
  });
});

//route for delete data
app.post("/delete", (req, res) => {
  let sql = "DELETE FROM list WHERE nis=" + req.body.nis + "";
  let query = conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect("/pasien");
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//server listening
app.listen(5000, () => {
  console.log("Server is running at port 5000");
});
