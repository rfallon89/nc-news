const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { forEach } = require("../db/data/test-data/articles");

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
            expect(body).toHaveProperty("articles");
            expect(body.articles.length).toBe(12);
            for (let i = 0; i < 12; i++) {
              let article = body.articles[i];
              expect(article).toHaveProperty("author");
              expect(article).toHaveProperty("title");
              expect(article).toHaveProperty("article_id");
              expect(article).toHaveProperty("topic");
              expect(article).toHaveProperty("created_at");
              expect(article).toHaveProperty("votes");
              expect(article).toHaveProperty("article_img_url");
              expect(article).toHaveProperty("comment_count");
            }
          });
      });
      it("returns a json object with the relevant information sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            const articleDateArr = [];
            articles.forEach((article) =>
              articleDateArr.push(article.created_at)
            );
            const sortedDateArr = [...articleDateArr].sort((a, b) => b - a);
            expect(articleDateArr).toEqual(sortedDateArr);
          });
      });
    });
    describe.only("GET request with article_id parametric endpoint", () => {
      it("returns a status of 200 when successfully reached", () => {
        return request(app).get("/api/articles/1").expect(200);
      });
      it("returns a json object with the relevant information", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body).toEqual({
              article: {
                article_id: 1,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                title: "Living in the shadow of a great man",
                topic: "mitch",
                votes: 100,
              },
            });
          });
      });
      it("returns a status of 404 when article id is not found with a message", () => {
        return request(app)
          .get("/api/articles/999")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Article ID does not exist" });
          });
      });
      it("returns a status of 400 when id is of wrong data type with a message", () => {
        return request(app)
          .get("/api/articles/news")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
    });
  });
});
