const topics = require('../db/data/test-data/topics.js')

const { selectAllTopics } = require('../models/endpoints.model.js')
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