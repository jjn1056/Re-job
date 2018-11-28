const express = require('express');
const app = express();
const port = 3000;
require('dotenv').config();
var Client = require('mariasql');

// Setting up view engine
app.set('view engine', 'pug');
app.use(express.static("public"));

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

// home page 
app.get('/', function (req, res) {
    res.render('home', {
        "Education": [
            "Highschool Diploma",
            "Associate's degree",
            "Bachelor's degree",
            "Master's degree",
            "Doctoral degree"
        ],
        "Experience": [
            " > 0",
            "0 - 1",
            "1 - 3",
            "3 - 5",
            "5 - 10",
            "10 > "
        ],
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));