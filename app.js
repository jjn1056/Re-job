const express = require('express');
const app = express();
const port = 3000;
var config = require('./config');
var Client = require('mariasql');

var c = new Client({
    host: '127.0.0.1',
    user: 'root',
    password: config.mariaPassword,
    port: 3306
});

c.query('SHOW DATABASES', function (err, rows) {
    if (err)
        throw err;
    console.dir(rows);
});

c.end();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));