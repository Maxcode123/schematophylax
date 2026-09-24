import express from 'express';
import { migrationsService } from '../../application/services/index.js';
import { parseCreateMigrationRequest, parseUpdateMigrationRequest, toMigrationResponse } from '../dtos/migrations-dto.js';

export const migrationsRouter: express.Router = express.Router();

migrationsRouter.get('/', async (_req, res) => {
  res.json((await migrationsService.list()).map(toMigrationResponse));
});

migrationsRouter.get('/:id', async (req, res) => {
  res.json(toMigrationResponse(await migrationsService.get(req.params.id)));
});

migrationsRouter.post('/', async (req, res) => {
  res.status(201).json(toMigrationResponse(await migrationsService.create(parseCreateMigrationRequest(req.body))));
});

migrationsRouter.patch('/:id', async (req, res) => {
  res.json(toMigrationResponse(await migrationsService.update(req.params.id, parseUpdateMigrationRequest(req.body))));
});

migrationsRouter.delete('/:id', async (req, res) => {
  await migrationsService.delete(req.params.id);
  res.sendStatus(204);
});
