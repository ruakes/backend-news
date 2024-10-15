const topics = require('../db/data/test-data/topics.js')

const { selectAllTopics, selectArticleById, selectAllArticles } = require('../models/endpoints.model.js')
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
        if(err.code === '22P02'){
            res.status(400).send({msg: 'Article ID submitted is Not-a-Number (NaN)'})
        }
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