const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
require('dotenv').config();
var Client = require('mariasql');

app.set('view engine', 'pug');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

var connection = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

connection.query('SHOW DATABASES', function (err, rows) {
    if (err)
        throw err;
    console.dir(rows);
});

connection.end();

app.get('/', function (req, res) {
    res.render('index', {
    });
});

app.post('/resume', function(req, res) {
    let name = req.body.reName;
    let email = req.body.reEmail;
    let resumeFile = req.files.resumeFile;

    if (name === "" || email === "" || !(resumeFile)) {
        res.render('index', {error_resume: "Fill out all the fields and choose .pdf file."});
    } else {

    }
});

app.post('/job', function(req, res) {
    let name = req.body.jobName;
    let email = req.body.jobEmail;
    let jobFile = req.files.jobFile;

    if (name === "" || email === "" || !(jobFile)) {
        res.render('index', {error_job: "Fill out all the fields and choose .pdf file."});
    } else {

    }
});

app.post('/re-match', function(req, res) {
    res.render('index', {

    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));