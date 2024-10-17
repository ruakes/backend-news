const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')
const endpointsObject = require("../endpoints.json")


beforeEach(() => {
    return seed(data)
})
afterAll(() => {
    return db.end()
 })

 describe("'/api/topics' endpoint", () => {
    describe("GET all data from '/api/topics' endpoint", () => {
        test("GET /api/topics returns 200", () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                body.topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string')
                    expect(typeof topic.slug).toBe('string')
                })
                expect(body.topics.length).toBe(3)
            })
        })
    })
})

describe("test for invalid paths", () => {
    test("* returns 404 not found for invalid url", () => {
        return request(app)
        .get('/api/topicssss')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('path not found')
        })
    })
})

describe("GET '/api' ", () => {
    test("GET /api returns information to the user about all available endpoints", () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const endpointsKeys = Object.keys(endpointsObject)
            
            expect(body.endpoints["GET /api"]).toMatchObject({
                description: expect.any(String)
            })
            expect(body.endpoints["GET /api/topics"]).toMatchObject({
                description: expect.any(String),
                queries:  expect.any(Array),
                exampleResponse: expect.any(Object)
            })
            expect(Object.keys(body.endpoints)).toEqual(endpointsKeys)
        })
    })
})

describe("'/api/articles' endpoint", () => {
    describe("GET all data from '/api/articles' endpoint", () => {
        test("GET /api/articles returns 200 and an array of objects", () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(13);
                body.articles.forEach(article => {
                    expect(Object.keys(article)).not.toContain('body');
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    });
                });
            })
        })
        test("GET /api/articles returns 200 and array of objects in descending date order i.e. most recent first", () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles[0].article_id).toBe(3)
                expect(body.articles[12].article_id).toBe(7)
            })
        })
    })
    describe("GET articles with sort_by query passed", () => {
        test("GET /api/articles?sort_by=author returns 200, sorted articles in descending order", () => {
            return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({body}) => { 
                expect(body.articles).toBeSortedBy("author", { descending: true });
            })
        })
        test("GET /api/articles?order=asc returns 200, articles in ascending order", () => {
            return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({body}) => { 
                expect(body.articles).toBeSortedBy("created_at");
            })
        })
        test("GET /api/article?sort_by=not_a_column returns 404", () => {
            return request(app)
            .get('/api/articles?sort_by=not_a_column')
            .expect(404)
            .then(({body}) => { 
                expect(body.msg).toBe("Query option not found");
            })
        })
        test("GET /api/article?order=not_an_option returns 404", () => {
            return request(app)
            .get('/api/articles?order=not_an_option')
            .expect(404)
            .then(({body}) => { 
                expect(body.msg).toBe("Query option not found");
            })
        })
    })
    describe("GET relevant articles with filtered query on topic", () => {
        test("GET /api/articles takes a topic query and returns articles on that topic, on single match topic", () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.articles)).toBe(true)
                expect(body.articles).toHaveLength(1)
                body.articles.forEach(article => {
                    expect(article.topic).toBe('cats')
                })
            })
        })
        test("GET /api/articles takes a topic query and returns articles on that topic, on multi-match topic", () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.articles)).toBe(true)
                expect(body.articles).toHaveLength(12)
                body.articles.forEach(article => {
                    expect(article.topic).toBe('mitch')
                })
            })
        })
        test("GET /api/articles takes a topic query and returns 200, on zero-match topic", () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(0)
                expect(body.articles).toEqual([])
            })
        })
        test("GET /api/article takes an invalid topic query and returns 404", () => {
            return request(app)
            .get('/api/articles?topic=not_a_topic')
            .expect(404)
            .then(({body}) => { 
                expect(body.msg).toBe("Topic not found");
            })
        })
        test("GET /api/articles takes a multiple queries and returns matching articles", () => {
            return request(app)
            .get('/api/articles?topic=mitch&sort_by=votes&order=asc')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.articles)).toBe(true);
                expect(body.articles).toHaveLength(12);
                expect(body.articles).toBeSortedBy("votes");
                body.articles.forEach(article => {
                    expect(article.topic).toBe('mitch')
                });
            })
        })
    })
})

describe("GET all data from '/api/articles/:article_id' endpoint", () => {
    test("GET /api/articles/:article_id returns 200", () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toMatchObject({
                article_id: expect.any(Number),
                title:  expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
        })
    })
    test("GET /api/articles/:article_id returns 404 if not found", () => {
        return request(app)
        .get('/api/articles/101')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
    test("GET /api/articles/:article_id returns 400 if invalid datatype passed as an ID", () => {
        return request(app)
        .get('/api/articles/ruairi')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test("GET /api/articles/:article_id returns 200, response body includes count of comments on article", () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            expect(body.article).toHaveProperty('comment_count')
            expect(body.article.comment_count).toBe(11)
        })
    })
})

describe("GET '/api/articles/:article_id/comments' endpoint", () => {
    test("GET returns 200 and array of comments", () => {
        return request(app)
        .get('/api/articles/9/comments')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.comments)).toBe(true)
            expect(body.comments).toHaveLength(2)
            body.comments.forEach(comment => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    author: expect.any(String),
                });
            });
            expect(body.comments[0].comment_id).toBe(1)
            expect(body.comments[1].comment_id).toBe(17)
        })
    })
    test("GET request to article with no comments returns 200 and empty array", () => {
        return request(app)
        .get('/api/articles/8/comments')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.comments)).toBe(true)
            expect(body.comments).toHaveLength(0)
        })
    })
    test("GET request to non-valid article_id returns 400", () => {
        return request(app)
        .get('/api/articles/ruairi/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test("GET /api/articles/:article_id/comments returns 404 if not found", () => {
        return request(app)
        .get('/api/articles/101/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
})

describe("POST '/api/articles/:article_id/comments' endpoint", () => {
    test("POST a new comment returns 201", () => {
        const commentBody = {username: "lurker", body: "What a fantastic insight!"};

        return request(app)
        .post('/api/articles/9/comments')
        .send(commentBody)
        .expect(201)
        .then(({body}) => {
            expect(body.addedComment).toMatchObject({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                article_id: expect.any(Number),
                body: expect.any(String),
                created_at: expect.any(String),
                author: expect.any(String),
            });
            expect(body.addedComment.author).toBe("lurker");
            expect(body.addedComment.body).toBe("What a fantastic insight!")
        })
    })
    test("POST request to non-valid article_id returns 400", () => {
        const commentBody = {username: "lurker", body: "What a fantastic insight!"};

        return request(app)
        .post('/api/articles/ruairi/comments')
        .send(commentBody)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test("POST /api/articles/:article_id/comments returns 404 for bad article id", () => {
        const commentBody = {username: "lurker", body: "What a fantastic insight!"};

        return request(app)
        .post('/api/articles/101/comments')
        .send(commentBody)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
    test("POST /api/articles/:article_id/comments returns 404 if user not found", () => {
        const commentBody = {username: "billy_goat", body: "What a fantastic insight!"};

        return request(app)
        .post('/api/articles/1/comments')
        .send(commentBody)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
    test("POST /api/articles/:article_id/comments returns 400 if no comment body", () => {
        const commentBody = {username: "lurker"};

        return request(app)
        .post('/api/articles/101/comments')
        .send(commentBody)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('No comment body provided')
        })
    })
})

describe("PATCH '/api/articles/:article_id' endpoint", () => {
    test("PATCHing an article to increase votes returns 200", () => {
        const voteInc = {inc_votes: 5};

        return request(app)
        .patch('/api/articles/13')
        .send(voteInc)
        .expect(200)
        .then(({body}) => {
            expect(body.updatedArticle).toMatchObject({
                article_id: expect.any(Number),
                title:  expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
            expect(body.updatedArticle.votes).toBe(5)
        })
    })
    test("PATCHing an article to decrease votes returns 200", () => {
        const voteInc = {inc_votes: -90};

        return request(app)
        .patch('/api/articles/1')
        .send(voteInc)
        .expect(200)
        .then(({body}) => {
            expect(body.updatedArticle).toMatchObject({
                article_id: expect.any(Number),
                title:  expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
            expect(body.updatedArticle.votes).toBe(10)
        })
    })
    test("PATCH request to non-valid article_id returns 400", () => {
        const voteInc = {inc_votes: -90};

        return request(app)
        .patch('/api/articles/ruairi')
        .send(voteInc)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test("PATCH request to non-existent article_id returns 404", () => {
        const voteInc = {inc_votes: -90};

        return request(app)
        .patch('/api/articles/999')
        .send(voteInc)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
    test("PATCH request with invalid vote increment returns 400", () => {
        const voteInc = {inc_votes: "voteUp"};

        return request(app)
        .patch('/api/articles/3')
        .send(voteInc)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
})

describe("DELETE '/api/comments/:comment_id' endpoint", () => {
    test("Deleting a comment returns 204", () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    test("DELETE request to non-valid comment_id returns 400", () => {
        return request(app)
        .delete('/api/comments/NOCOMMENT')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad request')
        })
    })
    test("PATCH request to non-existent article_id returns 404", () => {
        return request(app)
        .delete('/api/comments/101101')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not found')
        })
    })
})

describe("GET '/api/users' endpoint", () => {
    test("GET request returns 200 and array of users", () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            expect(body.users).toHaveLength(4)
            expect(Array.isArray(body.users)).toBe(true)
            body.users.forEach(user => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})