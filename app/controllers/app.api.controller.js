exports.getEndpoints = (req, res, next) => {
  res.status(200).send({
    endpoints: {
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
        description: "serves an array of all articles sorted by newest first",
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
        description: "serves an object of the article associated with the id",
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
          userss: [{ username: "Mitch89", name: "Mitch", "avatar url": "url" }],
        },
      },
    },
  });
};
