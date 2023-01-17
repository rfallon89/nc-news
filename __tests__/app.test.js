const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { get } = require("../app/app");

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
            for (let i = 0; i < 3; i++) {
              let topic = body.topics[i];
              expect(typeof topic.slug).toBe("string");
              expect(typeof topic.description).toBe("string");
            }
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
              expect(typeof article.author).toBe("string");
              expect(typeof article.title).toBe("string");
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
              expect(typeof article.comment_count).toBe("number");
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
            expect(body).toHaveProperty("comments");
            expect(body.comments.length).toBe(11);
            for (let i = 0; i < 11; i++) {
              let comment = body.comments[i];
              expect(typeof comment.comment_id).toBe("number");
              expect(typeof comment.votes).toBe("number");
              expect(typeof comment.created_at).toBe("string");
              expect(typeof comment.author).toBe("string");
              expect(typeof comment.body).toBe("string");
              expect(comment.article_id).toBe(1);
            }
          });
      });
      it("returns a json object with the relevant information sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const commentDateArr = [];
            body.comments.forEach((comment) =>
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
    describe.only("PATCH request for votes update by article id", () => {
      it("returns a status of 200 and responses with the updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body).toEqual({
              update: {
                article_id: 1,
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                title: "Living in the shadow of a great man",
                topic: "mitch",
                votes: 110,
              },
            });
          });
      });
      // it("returns a status of 404 when article id is of correct data type but does not exist", () => {
      //   return request(app)
      //     .patch("/api/articles/999")
      //     .send({ inc_votes: 10 })
      //     .expect(404)
      //     .then(({ body }) => {
      //       expect(body).toEqual({ message: "article id does not exist" });
      //     });
      // });
    });
  });
});
