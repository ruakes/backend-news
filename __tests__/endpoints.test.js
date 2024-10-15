const request = require('supertest')
const app = require('../app.js')
const db = require('../db/connection.js')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data')
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
    })
})