const db = require('../db/connection.js')
const format = require('pg-format')

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows;
    })
}
