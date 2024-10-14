const express = require('express');
const { getAllTopics } = require('./controllers/endpoints.controller');
const app = express();
const endpoints = require("./endpoints.json")

app.use(express.json());

app.get('/api/topics', getAllTopics);

app.all('*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
})

app.use((err,req,res,next) => {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
})

module.exports = app;