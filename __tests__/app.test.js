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
});
