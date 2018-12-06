const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const pdf2Text = require('pdf2text');
const app = express();
const port = 3000;
const Client = require('mariasql');
const parser = require('concepts-parser');
const fs = require('fs');
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

var connection = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

fs.readFile('./sql/re-job.sql', 'utf8', function (err, data) {
    if (err) throw err;

    var sql = data.split(';')
        .filter((element) => {
            return element.length != 0
        })
        .map((element) => {
            if (element.length != 0)
                return element.replace(/\r?\n|\r/g, " ");
        });

    for (var iterator in sql) {
        connection.query(sql[iterator], function (err, rows) {
            if (err) throw err;
        });
    }
});

app.get('/', function (req, res) {
    res.render('index', {
    });
});

app.post('/resume', function (req, res) {
    let name = req.body.reName;
    let email = req.body.reEmail;
    let resumeFile = req.files.resumeFile;

    if (name === "" || email === "" || !(resumeFile)) {
        res.render('index', {
            error_resume: "Fill out all the fields and choose .pdf file."
        });
    } else if (!(/\.(pdf|pdf)$/i).test(resumeFile.name)) {
        // Modify regex if new file2text modules added
        res.render('index', {
            error_resume: "Only .pdf files are supported."
        });
    } else {
        pdf2Text(resumeFile.data).then(function (chunks, err) {
            var resumeString = chunks[0].join(' ');

            const concepts = parser.parse({ text: resumeString, lang: 'en' }, { mode: 'collect', filters: ['duplicate', 'invalid', 'partial', 'abbr', 'known'] });

            console.log(concepts);
            var resume = [];
            for (var id in concepts) {
                console.log(concepts[id]);
                if (concepts[id]._fields.endsWithNumber !== true) {
                    resume.push(concepts[id]._fields.value)
                }
            }

            console.log(resume);
        //});

        // Insert SQL

        connection.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            var sql = "INSERT INTO user (user_email, user_name) VALUES ('"+email+"', '"+name+"')";
            connection.query(sql,function (err,result) {
                if (err) throw err;
                console.log("record inserted");
            });
        });

        connection.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
            for (var i = 0; i < resume.length; ++i) {
                var sql = "INSERT INTO entities_resume (user_email, job_chunk) VALUES ('"+email+"', ?)";
                connection.query(sql, [i],function (err,result) {
                    if (err) throw err;
                    console.log(i, "th record inserted");
                });
            }
        });
        });


    }

    res.render('index', {

    });
});

app.post('/job', function (req, res) {
    let name = req.body.jobName;
    let email = req.body.jobEmail;
    let jobFile = req.files.jobFile;

    if (name === "" || email === "" || !(jobFile)) {
        res.render('index', { error_job: "Fill out all the fields and choose .pdf file." });
    } else if (!(/\.(pdf|pdf)$/i).test(jobFile.name)) {
        // Modify regex if new file2text modules added
        res.render('index', {
            error_job: "Only .pdf files are supported."
        });
    } else {
        pdf2Text(jobFile.data).then(function (chunks, err) {
            var jobString = chunks[0].join(' ');
            console.log(jobString);
        });

        // Insert SQL
    }

    res.render('index', {

    });
});

app.post('/re-match', function (req, res) {
    res.render('index', {

    });
});

connection.end();

app.listen(port, () => console.log(`Example app listening on port ${port}!`));