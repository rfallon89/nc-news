const request = require("supertest");
const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("App API", () => {
  describe("API endpoint topics", () => {
    describe("GET request", () => {
      it("returns a status of 200 when successfully reached", () => {
        return request(app).get("/api/topics").expect(200);
      });
      it("returns a json object with the relevant information", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics.length).toBe(3);
            topics.forEach((topic) => {
              expect(typeof topic.slug).toBe("string");
              expect(typeof topic.description).toBe("string");
            });
          });
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
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(12);
            articles.forEach((article) => {
              expect(typeof article.author).toBe("string");
              expect(typeof article.title).toBe("string");
              expect(typeof article.body).toBe("string");
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
              expect(typeof article.comment_count).toBe("number");
            });
          });
      });
      it("returns a json object with the relevant information sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
          });
      });
    });
    describe("GET request with queries", () => {
      it("accepts a query to filter by topic value, if no query then returns all articles by default responding with a status 200", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(11);
            articles.forEach((article) => {
              expect(typeof article.author).toBe("string");
              expect(typeof article.title).toBe("string");
              expect(typeof article.body).toBe("string");
              expect(typeof article.article_id).toBe("number");
              expect(typeof article.topic).toBe("string");
              expect(typeof article.created_at).toBe("string");
              expect(typeof article.votes).toBe("number");
              expect(typeof article.article_img_url).toBe("string");
              expect(typeof article.comment_count).toBe("number");
            });
          });
      });
      it("returns a empty object if the topic exists but no articles are associated with it", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toEqual([]);
          });
      });
      it("returns a status for 404 if the topic value is of the correct data type but does not exist", () => {
        return request(app)
          .get("/api/articles?topic=rock")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ message: "topic does not exist" });
          });
      });
      it("returns the response object in date order ascending when specificed", () => {
        return request(app)
          .get("/api/articles?topic=mitch&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at");
          });
      });
      it("returns the response object sorted by a specificed table column", () => {
        return request(app)
          .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("article_id");
          });
      });
      it("returns a status of 400 if sort by value does not exist in the articles table", () => {
        return request(app)
          .get("/api/articles?topic=mitch&sort_by=article&order=asc")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Invalid Query" });
          });
      });
      it("returns a status of 400 if order value is not ascending or descending", () => {
        return request(app)
          .get("/api/articles?topic=mitch&sort_by=article&order=as")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Invalid Query" });
          });
      });
    });
    describe("GET request with article_id parametric endpoint", () => {
      it("returns a status of 200 when successfully reached", () => {
        return request(app).get("/api/articles/1").expect(200);
      });
      it("returns a json object with the relevant information", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(typeof article.author).toBe("string");
            expect(typeof article.title).toBe("string");
            expect(typeof article.body).toBe("string");
            expect(typeof article.article_id).toBe("number");
            expect(typeof article.topic).toBe("string");
            expect(typeof article.created_at).toBe("string");
            expect(typeof article.votes).toBe("number");
            expect(typeof article.article_img_url).toBe("string");
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
    describe("the addition of a comment to the response for a GET request by article id", () => {
      it("returns the request article by ID with a comment count added to the object", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).toBe(11);
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
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(11);
            comments.forEach((comment) => {
              expect(typeof comment.comment_id).toBe("number");
              expect(typeof comment.votes).toBe("number");
              expect(typeof comment.created_at).toBe("string");
              expect(typeof comment.author).toBe("string");
              expect(typeof comment.body).toBe("string");
              expect(comment.article_id).toBe(1);
            });
          });
      });
      it("returns a json object with the relevant information sorted by date in descending order", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
      it("returns 400 if article id is wrong data type", () => {
        return request(app)
          .get("/api/articles/one/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
      it("returns 404 if article id is correct data type but does not exist", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({
              message: "No comments for this article ID",
            });
          });
      });
    });
    describe("PATCH request for votes update by article id", () => {
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
      it("returns a status of 404 when article id is of correct data type but does not exist", () => {
        return request(app)
          .patch("/api/articles/999")
          .send({ inc_votes: 10 })
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ message: "article id does not exist" });
          });
      });
      it("returns a status of 400 when article id is of incorrect data type", () => {
        return request(app)
          .patch("/api/articles/votes")
          .send({ inc_votes: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
      it("returns a status of 400 when body recieved is incorrect", () => {
        return request(app)
          .patch("/api/articles/votes")
          .send({ votes: 10 })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
    });
    describe("POST request with article_id parametric endpoint to add a comment about an article", () => {
      it("returns a status of 200 with a message of confirmation", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ username: "lurker", body: "test1...2" })
          .expect(201)
          .then(({ body: { successful } }) => {
            expect(successful.article_id).toBe(2);
            expect(successful.author).toBe("lurker");
            expect(successful.body).toBe("test1...2");
            expect(successful.comment_id).toBe(19);
            expect(successful.votes).toBe(0);
            expect(typeof successful.created_at).toBe("string");
          });
      });
      it("returns a status of 400 when the posted body is of the wrong format with a message", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ body: "lurker" })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
      it("returns a status of 400 when the article id is of the wrong data type", () => {
        return request(app)
          .post("/api/articles/add/comments")
          .send({ username: "lurker", body: "test1...2" })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
      it("returns a status of 404 when the article id does not exist", () => {
        return request(app)
          .post("/api/articles/999/comments")
          .send({ username: "lurker", body: "test1...2" })
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Article ID does not exist" });
          });
      });
      it("returns a status of 404 when the username does not exist", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ username: "nox", body: "test1...2" })
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({
              message: "Username does not exist, create a user profile first",
            });
          });
      });
    });
  });
  describe("API endpoint comments", () => {
    describe("DELETE request", () => {
      it("returns a status of 204 when successfully deleted", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      it("returns a status of 404 when id not found with a message ", () => {
        return request(app)
          .delete("/api/comments/999")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Comment ID does not exist" });
          });
      });
      it("returns a status of 400 when parameter is of invalid data type with a message", () => {
        return request(app)
          .delete("/api/comments/delete")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
    });
  });
  describe("API endpoint users", () => {
    describe("GET request", () => {
      it("returns a status of 200 when successfully reached", () => {
        return request(app).get("/api/users").expect(200);
      });
      it("returns a json object with the relevant information", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body).toHaveProperty("users");
            expect(body.users.length).toBe(4);
            body.users.forEach((user) => {
              expect(typeof user.username).toBe("string");
              expect(typeof user.name).toBe("string");
              expect(typeof user.avatar_url).toBe("string");
            });
          });
      });
    });
  });
  describe("API endpoint", () => {
    it("should response to a get request with a status of 200 and a JSON of the available endpoints of this API", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).toEqual({
            "GET /api": {
              description:
                "serves up a json representation of all the available endpoints of the api",
            },
            "GET /api/topics": {
              description: "serves an array of all topics",
              queries: [],
              exampleResponse: {
                topics: [{ slug: "football", description: "Footie!" }],
              },
            },
            "GET /api/articles": {
              description:
                "serves an array of all articles sorted by newest first",
              queries: ["topic", "sort_by", "order"],
              exampleResponse: {
                articles: [
                  {
                    title: "Seafood substitutions are increasing",
                    "article id": 1,
                    topic: "cooking",
                    author: "weegembump",
                    body: "Text from the article..",
                    created_at: 1527695953341,
                    votes: 10,
                    "article img url": "url",
                    "comment count": 50,
                  },
                ],
              },
            },
            "GET /api/articles:articles_id": {
              description:
                "serves an object of the article associated with the id",
              queries: [],
              exampleResponse: {
                article: {
                  title: "Seafood substitutions are increasing",
                  "article id": 1,
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341,
                  votes: 10,
                  "article img url": "url",
                  "comment count": 50,
                },
              },
            },
            "GET /api/articles:articles_id/comments": {
              description:
                "serves an array of all the comments associated with the article id",
              queries: [],
              exampleResponse: {
                comments: [
                  {
                    "comment id": 1,
                    "article id": 1,
                    votes: 10,
                    author: "weegembump",
                    body: "Text from the article..",
                    created_at: 1527695953341,
                  },
                ],
              },
            },
            "PATCH /api/articles:articles_id": {
              description: "Updates the votes of a article",
              body: { inc_votes: 100 },
              queries: [],
              exampleResponse: {
                update: {
                  title: "Seafood substitutions are increasing",
                  "article id": 1,
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341,
                  votes: 110,
                  "article img url": "url",
                },
              },
            },
            "POST /api/articles:articles_id": {
              description: "Adds a comment to a article",
              body: { username: "lurker", body: "Add comment here" },
              queries: [],
              exampleResponse: {
                succesful: {
                  author: "lurker",
                  "article id": 1,
                  body: "Added comment",
                  created_at: 1527695953341,
                  votes: 0,
                  "comment id": "url",
                },
              },
            },
            "DELETE /api/comments:comment_id": {
              description: "deletes a comment",
              queries: [],
              exampleResponse: {
                status: 204,
              },
            },
            "GET /api/users": {
              description: "serves an array of all users",
              queries: [],
              exampleResponse: {
                userss: [
                  { username: "Mitch89", name: "Mitch", "avatar url": "url" },
                ],
              },
            },
          });
        });
    });
  });
  describe("API responds with a path not found if the endpoint does not exist yet", () => {
    it("returns a status of 404 and a message of path not found", () => {
      return request(app)
        .get("/api/headlines")
        .expect(404)
        .then(({ body: { message } }) =>
          expect(message).toBe("Path Not Found")
        );
    });
  });
});
