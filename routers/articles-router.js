const { getAllArticles, getArticlesById, patchArticleVotes, getAllCommentsOnArticle, postCommentToArticle } = require("../controllers/endpoints.controller");

const articlesRouter = require("express").Router();

articlesRouter.route("/")
.get(getAllArticles)

articlesRouter.route("/:article_id")
.get(getArticlesById)
.patch(patchArticleVotes)

articlesRouter.route("/:article_id/comments")
.get(getAllCommentsOnArticle)
.post(postCommentToArticle)

module.exports = articlesRouter;