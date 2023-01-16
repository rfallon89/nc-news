const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("App API, /api", () => {
  describe("API endpoint topics", () => {
    describe("GET request", () => {
      it("returns a status of 200 when successfully reached", () => {
        return request(app).get("/api/topics").expect(200);
      });
      it("returns a json object with the relevant information", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty("topics");
            expect(body.topics.length).toBe(3);
            expect(body.topics[0]).toHaveProperty("slug");
            expect(body.topics[0]).toHaveProperty("description");
          });
      });
      it("returns a status of 404 when path incorrect", () => {
        return request(app).get("/api/traa").expect(404);
      });
    });
  });
  describe("API endpoint articles", () => {
    describe("GET request", () => {
      it("returns a status of 200 when successfully reached", () => {
        return request(app).get("/api/articles").expect(200);
      });
      it("returns a json object with the relevant information", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body).toHaveProperty("articles");
            expect(body.articles.length).toBe(12);
            expect(body.articles[0]).toHaveProperty("author");
            expect(body.articles[0]).toHaveProperty("title");
            expect(body.articles[0]).toHaveProperty("article_id");
            expect(body.articles[0]).toHaveProperty("topic");
            expect(body.articles[0]).toHaveProperty("created_at");
            expect(body.articles[0]).toHaveProperty("votes");
            expect(body.articles[0]).toHaveProperty("article_img_url");
            expect(body.articles[0]).toHaveProperty("comment_count");
          });
      });
    });
  });
});
