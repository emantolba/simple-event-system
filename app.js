const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const eventRouter = require('./Routers/eventRouter');
const authRouter = require('./Routers/authRouter');
const studentRouter = require('./Routers/studentRouter');
const speakerRouter = require('./Routers/speakerRouter');

const Server = express();
mongoose.connect('mongodb://localhost/eventSystemDB')
    .then(() =>{
        console.log('Connected to MongoDB...');
        Server.listen(process.env.PORT ||8080, () => {
            console.log('Listening ...');
        });

    })
    .catch(err => console.log("DB Connection Problem"));
//Logger MW
Server.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
    });

//Body Parser MW
Server.use(bodyParser.json());
Server.use(bodyParser.urlencoded({extended: false}));

//Routes
Server.use(authRouter);
Server.use(eventRouter);
Server.use(studentRouter);
Server.use(speakerRouter);

//Not Found MW
Server.use((req, res, next) => {
    res.status(404).json({massage:"Not Found"});
});

//Error Handler MW
Server.use((err, req, res, next) => {
    res.status(500).json({massage:err+" "});
});
    