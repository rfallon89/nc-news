# Northcoders News API

https://nc-news-api-v1ty.onrender.com

This project is an API for a database storing information on articles, the users and comments and the associations between them. For JSON of available endpoints request https://nc-news-api-v1ty.onrender.com/api

This project is set up to utilise a test and a development database with the environment variables set up with the use of .env files titled, .env.test and .env.development. These files determine which database the API establishes a connection to, you must create these with the following variables inside:
- PGDATABASE=nc_news_test (.env.test)
- PGDATABASE=nc_news (.env.development)


To run this project locally you must first clone the repository using the appropriate link in the code dropdown menu for the desired method. Once cloned, run `npm install` command in Node.js, this will install all the packages required to run the project. You will see inside the package.json scripts that have been created to handle the set up and seeding of the database. To run these use `npm run <name of script>` command in Node.js.
  
When running the tests for the API, use command `npm test app.test.js`. The seeding of the database is handled by the test file, however you must ensure that the database has first been created with the setup-db script `npm run setup-dbs`.

PostgresSQL v15.1 

Node v18.12.1
  
