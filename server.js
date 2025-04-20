import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import handleRegister from './controllers/register.js';
import handleSignin from './controllers/signin.js';
import handleProfileGet from './controllers/profile.js';
import { handleApiCall, handleImage } from './controllers/image.js';

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST,
        port: 5432,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
    },
});

const app = express();

app.use(bodyParser.json());
// app.use(express.json());
app.use(cors());
// Default config of CORS is the equivalent of:
// {
//   "origin": "*",
//   "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
//   "preflightContinue": false,
//   "optionsSuccessStatus": 204
// }

app.get('/', (request, response) => {
    response.send('Success!')
})

app.post('/signin', (request, response) => {
    handleSignin(request, response, db, bcrypt);
})

app.post('/register', (request, response) => {
    handleRegister(request, response, db, bcrypt);
})

app.get('/profile/:id', (request, response) => {
    handleProfileGet(request, response, db);
})

app.put('/image', (request, response) => {
    handleImage(request, response, db);
})

app.post('/imageUrl', (request, response) => {
    handleApiCall(request, response);
})

app.listen(process.env.PORT || 3000, () => {
    console.log('App is running');
})