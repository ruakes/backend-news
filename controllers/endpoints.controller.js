const topics = require('../db/data/test-data/topics.js')

const { selectAllTopics, selectArticleById, selectAllArticles, selectAllCommentsOnArticle, insertNewComment, updateArticleVotes } = require('../models/endpoints.model.js')
const endpoints = require("../endpoints.json")

exports.getAllTopics = (req, res, next) => {
    selectAllTopics()
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch(err=>{
        next(err)
    })
}

exports.getEndpoints = (req, res, next) => {
    res.status(200).send({ endpoints})
}

exports.getArticlesById = (req, res, next) => {
    const {article_id} = req.params
    selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getAllCommentsOnArticle = (req, res, next) => {
    const {article_id} = req.params
    const promises = [selectAllCommentsOnArticle(article_id)]

    if (article_id){
        promises.push(selectArticleById(article_id))
    }
    
    Promise.all(promises)
    .then((results) => {
        const comments = results[0]
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.postCommentToArticle = (req, res, next) => {
    const commentAuthor = req.body.username
    const commentBody = req.body.body;
    const {article_id} = req.params

    const promises = [insertNewComment(commentAuthor, commentBody, article_id)]

    if (article_id){
        promises.push(selectArticleById(article_id))
    }

    Promise.all(promises)
    .then((results) => {
        const addedComment = results[0]
        res.status(201).send({addedComment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchArticleVotes = (req, res, next) => {
    const vote_inc = req.body.inc_votes;
    const {article_id} = req.params;
    const promises = [updateArticleVotes(vote_inc, article_id)];

    if (article_id){
        promises.push(selectArticleById(article_id))
    }

    Promise.all(promises)
    .then((results) => {
        const updatedArticle = results[0]
        res.status(200).send({updatedArticle})
    })
    .catch((err) => {
        next(err)
    })
}