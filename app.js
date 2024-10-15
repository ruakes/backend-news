const express = require('express');
const { getAllTopics, getEndpoints, getArticlesById, getAllArticles, getAllCommentsOnArticle } = require('./controllers/endpoints.controller');
const app = express();


app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getAllCommentsOnArticle)

app.all('*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
});

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'Article ID submitted is invalid datatype'})
    } else {
        next(err)
    }
})
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