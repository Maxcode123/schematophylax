import express from 'express'
import { apiRouter } from './api/controllers/index.js';

const app: express.Express = express();

app.use(express.json());

app.use(apiRouter);

app.listen(8000);
