import express from 'express';
import { migrationLogsService } from '../../application/services/index.js';
import { parseCreateMigrationLogRequest, parseUpdateMigrationLogRequest, toMigrationLogResponse } from '../dtos/migration_logs_dto.js';

export const migrationLogsRouter: express.Router = express.Router();

migrationLogsRouter.get('/', async (_req, res) => {
  res.json((await migrationLogsService.list()).map(toMigrationLogResponse));
});

migrationLogsRouter.get('/:id', async (req, res) => {
  res.json(toMigrationLogResponse(await migrationLogsService.get(req.params.id)));
});

migrationLogsRouter.post('/', async (req, res) => {
  res.status(201).json(toMigrationLogResponse(await migrationLogsService.create(parseCreateMigrationLogRequest(req.body))));
});

migrationLogsRouter.patch('/:id', async (req, res) => {
  res.json(toMigrationLogResponse(await migrationLogsService.update(req.params.id, parseUpdateMigrationLogRequest(req.body))));
});

migrationLogsRouter.delete('/:id', async (req, res) => {
  await migrationLogsService.delete(req.params.id);
  res.sendStatus(204);
});
