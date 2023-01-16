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
            expect(articleDateArr).toEqual([
              "2020-11-03T09:12:00.000Z",
              "2020-10-18T01:00:00.000Z",
              "2020-10-16T05:03:00.000Z",
              "2020-10-11T11:24:00.000Z",
              "2020-08-03T13:14:00.000Z",
              "2020-07-09T20:11:00.000Z",
              "2020-06-06T09:10:00.000Z",
              "2020-05-14T04:15:00.000Z",
              "2020-05-06T01:14:00.000Z",
              "2020-04-17T01:08:00.000Z",
              "2020-01-15T22:21:00.000Z",
              "2020-01-07T14:08:00.000Z",
            ]);
          });
      });
    });
    describe("GET request for comment by article id", () => {
      it("returns a status of 200 when successfully reached", () => {
        return request(app).get("/api/articles/1/comments").expect(200);
      });
      it("returns a json object with the relevant information", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty("article_id1 comments");
            expect(body["article_id1 comments"].length).toBe(11);
            for (let i = 0; i < 11; i++) {
              let comment = body["article_id1 comments"][i];
              expect(comment).toHaveProperty("comment_id");
              expect(comment).toHaveProperty("votes");
              expect(comment).toHaveProperty("created_at");
              expect(comment).toHaveProperty("author");
              expect(comment).toHaveProperty("body");
              expect(comment).toHaveProperty("article_id");
            }
          });
      });
      it("returns a json object with the relevant information sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const commentDateArr = [];
            body["article_id1 comments"].forEach((comment) =>
              commentDateArr.push(comment.created_at)
            );
            expect(commentDateArr).toEqual([
              "2020-11-03T21:00:00.000Z",
              "2020-10-31T03:03:00.000Z",
              "2020-07-21T00:20:00.000Z",
              "2020-06-15T10:25:00.000Z",
              "2020-05-15T20:19:00.000Z",
              "2020-04-14T20:19:00.000Z",
              "2020-04-11T21:02:00.000Z",
              "2020-03-02T07:10:00.000Z",
              "2020-03-01T01:13:00.000Z",
              "2020-02-23T12:01:00.000Z",
              "2020-01-01T03:08:00.000Z",
            ]);
          });
      });
    });
  });
});
