const db = require('../db/connection.js')
const format = require('pg-format');
const articles = require('../db/data/development-data/articles.js');

exports.selectAllTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then(({rows}) => {
        return rows;
    })
}

exports.selectAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {
    const sort_columns = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url', 'comment_count'];
    const order_options = ['asc', 'desc'];

    if(!sort_columns.includes(sort_by) || !order_options.includes(order)) {
        return Promise.reject({status: 404, msg: 'Query option not found'})
    }
    let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

    let queryVals = [];

    if(topic) {
        return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
        .then(({rows}) => {
            if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Topic not found'})
            }
            queryStr += ` WHERE topic = $1`
            queryVals.push(topic)
            queryStr += format(` GROUP BY articles.article_id ORDER BY %I %s;`, sort_by, order.toUpperCase())
            return db.query(queryStr, queryVals)
            .then(({rows}) => {
       
            return rows;
            })
        })
    }

    queryStr += format(` GROUP BY articles.article_id ORDER BY %I %s;`, sort_by, order.toUpperCase())

    return db.query(queryStr, queryVals)
    .then(({rows}) => {
        return rows;
    })
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles
        LEFT JOIN comments on articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`, [article_id])
        .then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject({status: 404, msg: 'Not found'})
            }
            return rows[0];
        })
}

exports.selectAllCommentsOnArticle = (article_id) => {
    return db.query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments
        LEFT JOIN articles ON comments.article_id = articles.article_id
        WHERE comments.article_id = $1
        ORDER BY comments.created_at DESC;`, [article_id])
        .then(({rows}) => {
            return rows;
        })
}

exports.insertNewComment = (author, body, article_id) => {
    if (body === undefined){
        return Promise.reject({status: 400, msg: 'No comment body provided'})}
    const formattedComment = format(`INSERT INTO comments 
        (author, body, article_id) 
        VALUES %L 
        RETURNING *;`, [[author, body, article_id]])

    return db.query(formattedComment)
    .then(({rows}) => {
        return rows[0]
    })


}

exports.updateArticleVotes = (vote_inc, article_id) => {
    return db.query(`UPDATE articles
        SET 
        votes = votes + $1
        WHERE 
        article_id = $2
        RETURNING *;`, [vote_inc, article_id]
    )
    .then(({rows}) => {
        return rows[0]
    })
}

exports.removeExistingComment = (comment_id) => {
    return db.query(`DELETE FROM
        comments
        WHERE comment_id = $1
        RETURNING *`, [comment_id])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return rows[0]
    })
}

exports.selectAllUsers = () => {
    return db.query(`SELECT * FROM users;`)
    .then(({rows}) => {
        return rows;
    })
}