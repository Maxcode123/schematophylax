import express from 'express';
import { postgresConnectionsService } from '../../application/services/index.js';
import { parseCreatePostgresConnectionRequest, parseUpdatePostgresConnectionRequest, toPostgresConnectionResponse } from '../dtos/postgres-connections-dto.js';

export const postgresConnectionsRouter: express.Router = express.Router();

postgresConnectionsRouter.get('/', async (_req, res) => {
  res.json((await postgresConnectionsService.list()).map(toPostgresConnectionResponse));
});

postgresConnectionsRouter.get('/:id', async (req, res) => {
  res.json(toPostgresConnectionResponse(await postgresConnectionsService.get(req.params.id)));
});

postgresConnectionsRouter.post('/', async (req, res) => {
  res.status(201).json(toPostgresConnectionResponse(await postgresConnectionsService.create(parseCreatePostgresConnectionRequest(req.body))));
});

postgresConnectionsRouter.patch('/:id', async (req, res) => {
  res.json(toPostgresConnectionResponse(await postgresConnectionsService.update(req.params.id, parseUpdatePostgresConnectionRequest(req.body))));
});

postgresConnectionsRouter.delete('/:id', async (req, res) => {
  await postgresConnectionsService.delete(req.params.id);
  res.sendStatus(204);
});
