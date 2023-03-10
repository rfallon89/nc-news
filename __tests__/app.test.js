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
    describe("POST request", () => {
      it("returns a status of 201 with a message of confirmation", () => {
        return request(app)
          .post("/api/topics")
          .send({ slug: "topic name here", description: "description here" })
          .expect(201)
          .then(({ body: { topic } }) => {
            expect(topic.slug).toBe("topic name here");
            expect(topic.description).toBe("description here");
          });
      });
      it("returns a status of 201 with a message of confirmation when no description given", () => {
        return request(app)
          .post("/api/topics")
          .send({ slug: "topic name here" })
          .expect(201)
          .then(({ body: { topic } }) => {
            expect(topic.slug).toBe("topic name here");
            expect(topic.description).toBe(null);
          });
      });
      it("returns a status of 400 when the posted body is of the wrong format with a message", () => {
        return request(app)
          .post("/api/topics")
          .send({ body: "lurker" })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toEqual("Bad Request");
          });
      });
      it("returns a status of 400 when the slug already exists", () => {
        return request(app)
          .post("/api/topics")
          .send({ slug: "mitch" })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("already exists");
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
      it("accepts a query to filter by topic value", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            console.log(articles);
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
      it("applies a limit to the displayed articles of 10 per page if not specified", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(10);
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
      it("accepts a limit query which returns the number of articles specified per page", () => {
        return request(app)
          .get("/api/articles?limit=5")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(5);
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
      it("returns a 400 bad request of the limit value is of the wrong data type", () => {
        return request(app)
          .get("/api/articles?limit=all")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad Request");
          });
      });
      it("accepts a p (page) query which returns the page number requested respective of the default 10 limit", () => {
        return request(app)
          .get("/api/articles?p=2")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(2);
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
      it("accepts a p (page) query which returns the page number requested respective of the limit specified", () => {
        return request(app)
          .get("/api/articles?p=2&limit=5")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(5);
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
      it("returns the articles now with each article having a total_count key for all articles that match the given criteria regarless of any limits set for pagination", () => {
        return request(app)
          .get("/api/articles?p=2&limit=5")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBe(5);
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
              expect(article.total_count).toBe(12);
            });
          });
      });
      it("returns a status of 400 if page number is of invalid data type", () => {
        return request(app)
          .get("/api/articles?p=two")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Bad Request");
          });
      });
      it("returns a 404 not found if page does not exist", () => {
        return request(app)
          .get("/api/articles?p=99")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Page Not Found");
          });
      });
    });
    describe("POST request to add a article", () => {
      it("returns a status of 201 with a message of confirmation", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "lurker",
            body: "test1...2",
            title: "post test",
            topic: "cats",
            article_img_url: "....",
          })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(typeof article.article_id).toBe("number");
            expect(article.title).toBe("post test");
            expect(article.topic).toBe("cats");
            expect(article.author).toBe("lurker");
            expect(article.body).toBe("test1...2");
            expect(article.comment_count).toBe(0);
            expect(article.votes).toBe(0);
            expect(typeof article.created_at).toBe("string");
            expect(article.article_img_url).toBe("....");
          });
      });
      it("returns a status of 201 with a message of confirmation if no article_img_url is provided and returns the default", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "lurker",
            body: "test1...2",
            title: "post test",
            topic: "cats",
          })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article.article_img_url).toBe(
              "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
            );
          });
      });
      it("returns a status of 400 when the posted body is of the wrong format with a message", () => {
        return request(app)
          .post("/api/articles")
          .send({ body: "lurker" })
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
      it("returns a status of 404 when the username id is not found", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: "Nox",
            body: "test1...2",
            title: "post test",
            topic: "cats",
          })
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Username does not exist");
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
      it("returns an empty array if no comments made about the article", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
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
      it("returns 404 if the article ID does not exist", () => {
        return request(app)
          .get("/api/articles/999/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({
              message: "Article ID does not exist",
            });
          });
      });
    });
    describe("GET request with QUERIES for comment by article id", () => {
      it("returns a json object with the relevant information", () => {
        return request(app)
          .get("/api/articles/1/comments?author=butter_bridge")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(2);
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
      it("returns 404 if the article ID does not exist", () => {
        return request(app)
          .get("/api/articles/999/comments?author=butter_bridge")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Article ID does not exist");
          });
      });
      it("returns 404 if author does not exist", () => {
        return request(app)
          .get("/api/articles/1/comments?author=butter")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Username does not exist" });
          });
      });
      it("returns an empty array if no comments made by the author about the article", () => {
        return request(app)
          .get("/api/articles/6/comments?author=icellusedkars")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toEqual([]);
          });
      });

      it("returns a status of 200 and a default limit of 10 to the return when successfully reached", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(10);
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
      it("returns with a limit of specified length to the return when successfully reached", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=5")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(5);
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
      it("returns 400 if limit value is wrong data type", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=five")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
          });
      });
      it("accepts a p (page) query which returns the page number requested respective of the default 10 limit", () => {
        return request(app)
          .get("/api/articles/1/comments?p=2")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(1);
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
      it("accepts a p (page) query which returns the page number requested respective of the limit specified", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=5&p=3")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(1);
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
      it("returns an empty if page number is of invalid data type", () => {
        return request(app)
          .get("/api/articles/1/comments?p=two")
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Bad Request");
          });
      });
      it("returns a 404 not found if page number does not exist", () => {
        return request(app)
          .get("/api/articles/1/comments?p=9999")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Page Not Found");
          });
      });
    });
    describe("PATCH request for votes update by article id", () => {
      it("returns a status of 200 and responses with the updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body: { update } }) => {
            expect(update.article_id).toBe(1);
            expect(update.title).toBe("Living in the shadow of a great man");
            expect(update.topic).toBe("mitch");
            expect(update.author).toBe("butter_bridge");
            expect(update.body).toBe("I find this existence challenging");
            expect(update.votes).toBe(110);
            expect(typeof update.created_at).toBe("string");
            expect(update.article_img_url).toBe(
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            );
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
      it("returns a status of 201 with a message of confirmation", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ username: "lurker", body: "test1...2" })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment.article_id).toBe(2);
            expect(comment.author).toBe("lurker");
            expect(comment.body).toBe("test1...2");
            expect(comment.comment_id).toBe(19);
            expect(comment.votes).toBe(0);
            expect(typeof comment.created_at).toBe("string");
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
              message: "Username does not exist",
            });
          });
      });
    });
    describe("DELETE request for article by id", () => {
      it("returns a status of 204 when successfully deleted", () => {
        return request(app).delete("/api/articles/1").expect(204);
      });
      it("returns a status of 404 when id not found with a message ", () => {
        return request(app)
          .delete("/api/articles/999")
          .expect(404)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Article ID does not exist" });
          });
      });
      it("returns a status of 400 when parameter is of invalid data type with a message", () => {
        return request(app)
          .delete("/api/articles/delete")
          .expect(400)
          .then(({ body }) => {
            expect(body).toEqual({ message: "Bad Request" });
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
    describe("PATCH request for comment by comment id", () => {
      it("returns a status of 200 when successfully updated the comment's votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body: { updated_comment } }) => {
            expect(updated_comment.comment_id).toBe(1);
            expect(updated_comment.votes).toBe(26);
            expect(typeof updated_comment.created_at).toBe("string");
            expect(typeof updated_comment.author).toBe("string");
            expect(typeof updated_comment.body).toBe("string");
            expect(typeof updated_comment.article_id).toBe("number");
          });
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
          .delete("/api/comments/update")
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
          .then(({ body: { users } }) => {
            users.forEach((user) => {
              expect(typeof user.username).toBe("string");
              expect(typeof user.name).toBe("string");
              expect(typeof user.avatar_url).toBe("string");
            });
          });
      });
      it("returns the users sorted by username in ascending alphabetical order by default", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeSortedBy("username");
          });
      });
      it("returns the users sorted by username in descending alphabetical order if specified", () => {
        return request(app)
          .get("/api/users?order=desc")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeSortedBy("username", { descending: true });
          });
      });
    });
    describe("Pagnation to the users GET request", () => {
      it("applies a limit to the displayed articles of 10 per page if not specified", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users.length).toBe(10);
          });
      });
      it("applies a limit to the displayed articles of 2 per page if not specified", () => {
        return request(app)
          .get("/api/users?limit=5")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users.length).toBe(5);
          });
      });
      it("returns a 400 bad request of the limit value is of the wrong data type", () => {
        return request(app)
          .get("/api/users?limit=five")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad Request");
          });
      });
      it("accepts a p (page) query which returns the page number requested respective of the default 10 limit", () => {
        return request(app)
          .get("/api/users?p=2")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users.length).toBe(4);
          });
      });
      it("accepts a p (page) query which returns the page number requested respective of the limit specified", () => {
        return request(app)
          .get("/api/users?limit=5&p=2")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users.length).toBe(5);
          });
      });
      it("returns a status of 400 if page number is of invalid data type", () => {
        return request(app)
          .get("/api/users?p=two")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Bad Request");
          });
      });
      it("returns a 404 not found if page does not exist", () => {
        return request(app)
          .get("/api/users?p=9999")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Page Not Found");
          });
      });
    });
    describe("GET request with :username parametric endpoint", () => {
      it("returns a status of 200 when successfully reached", () => {
        return request(app).get("/api/users").expect(200);
      });
      it("returns a json object with the relevant information", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
      });
      it("returns a status of 404 if username is not found", () => {
        return request(app)
          .get("/api/users/butter")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Username does not exist");
          });
      });
    });
    describe("POST request", () => {
      it("returns a status of 201 with a message of confirmation", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "RF308",
            name: "Rory",
            avatar_url:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          })
          .expect(201)
          .then(({ body: { user } }) => {
            expect(user.username).toBe("RF308");
            expect(user.name).toBe("Rory");
            expect(user.avatar_url).toBe(
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            );
          });
      });
      it("returns a status of 400 when the username already exists", () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "butter_bridge",
            name: "Rory",
            avatar_url:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          })
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("already exists");
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
          for (let endpoint in endpoints) {
            expect(typeof endpoints[endpoint].description).toBe("string");
            if (endpoints[endpoint].queries) {
              expect(typeof endpoints[endpoint].queries).toBe("object");
            }
            if (endpoints[endpoint].exampleResponse) {
              expect(typeof endpoints[endpoint].exampleResponse).toBe("object");
            }
            if (endpoints[endpoint].body) {
              expect(typeof endpoints[endpoint].body).toBe("object");
            }
          }
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
