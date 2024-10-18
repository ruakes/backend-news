# Backend News API

- [Backend project is hosted on Render] (https://backend-news-tssw.onrender.com/api)

## Project summary
The backend service for a news website written with express, tested using jest and supertest. PSQL used to database.

The backend enables users to access a variety of API endpoints related to articles, users, topics and comments. Soon to be linked with a frontend built with React. 

## Initial setup
1. Clone the project from [GitHub](https://github.com/ruakes/backend-news):
    ```git clone https://github.com/ruakes/backend-news.git```
2. Install dependencies:
    ```npm install```
3. Create two .env files for your project: **.env.test** and **.env.development**.
4. Inside each .env file, add **PGDATABASE=<databaseName>**, for the relevant environment. These can be found under **/db/setup.sql** 
5. Double check that the created .env files are <ins>.gitignored.</ins>
6. Seed the local databases:
    ``` npm run setup-dbs
        npm run seed```

## Minimum version requirements
**Node.js :** *v22.6.0*
**Postgres:** *14.13*
--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
