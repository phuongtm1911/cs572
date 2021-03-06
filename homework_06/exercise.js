var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var fs = require('fs');
var path = require('path');

var app = express();

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

var grades = [{
    id: 1,
    name: "Asaad Saad",
    course: "CS572",
    grade: 95
}];

app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(cors());
app.use('/grades/:id', (req, res, next) => {
    const id = Number(req.params.id);
    const index = grades.findIndex(grade => grade.id === id);
    if (Number(index) === -1) {
        return res.status(404).send('Student not found');
    } else {
        req.index = index;
        next();
    }
});

var isJSON = (req, res, next) => {
    try {
        JSON.parse(req.body);
        next();
    } catch (e) {
        return res.status(400).send('Invalid request');
    }
};

app.get('/grades', (req, res, next) => {
    res.status(200).send(grades);
});

app.get('/grades/:id', (req, res, next) => {
    res.send(grades[req.index]);
});

app.post('/grades', isJSON, (req, res, next) => {
    var grade = req.body;
    grades.push(grade);
    res.status(201).send();
});

app.delete('/grades/:id', (req, res, next) => {
    grades.splice(req.index, 1);
    res.status(200).send();
});

app.listen(8080);
