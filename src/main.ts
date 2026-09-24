import express from 'express'
import swaggerUi from 'swagger-ui-express';
import { apiRouter } from './api/controllers/index.js';
import { openApiDocument } from './api/openapi.js';

const app: express.Express = express();

app.use(express.json());

app.get('/openapi.json', (_req: express.Request, res: express.Response) => {
    res.json(openApiDocument);
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.use(apiRouter);

app.listen(8000);
