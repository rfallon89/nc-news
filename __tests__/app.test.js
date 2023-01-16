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
});
