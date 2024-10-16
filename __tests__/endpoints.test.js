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
                expect(body.msg).toBe('Article not found')
            })
        })
        test("GET /api/articles/:article_id returns 400 if invalid datatype passed as an ID", () => {
            return request(app)
            .get('/api/articles/ruairi')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Article ID submitted is invalid datatype')
                expect(body.msg).toBe('Article ID submitted is invalid datatype')
            })
        })
    })
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
        test("GET request to non-valid article_id returns 400 and message string detailing the error", () => {
            return request(app)
            .get('/api/articles/ruairi/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Article ID submitted is invalid datatype')
            })
        })
        test("GET /api/articles/:article_id/comments returns 404 if not found", () => {
            return request(app)
            .get('/api/articles/101/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Article not found')
            })
        })
    })
})