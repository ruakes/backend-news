const express = require('express');
const { getAllTopics, getEndpoints, getArticlesById, getAllArticles } = require('./controllers/endpoints.controller');
const app = express();


app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getAllArticles)

app.all('*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
});

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    } else {
        next(err)
    }
})

app.use((err,req,res,next) => {
    res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;