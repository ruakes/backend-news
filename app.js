const express = require('express');
const { getAllTopics, getEndpoints, getArticlesById, getAllArticles, getAllCommentsOnArticle, postCommentToArticle } = require('./controllers/GETendpoints.controller');
const app = express();


app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getEndpoints);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getAllCommentsOnArticle)

app.post('/api/articles/:article_id/comments', postCommentToArticle)

app.all('*', (req, res, next) => {
    res.status(404).send({msg: 'path not found'})
});

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'Bad request'})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.code === '23503'){
        res.status(404).send({msg: 'Not found'})
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