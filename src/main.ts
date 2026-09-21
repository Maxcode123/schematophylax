import express from 'express'

const app: express.Express = express();

app.get('/', (req: express.Request, res: express.Response) => {
    res.send("Hello World!")
});

app.listen(8000);
