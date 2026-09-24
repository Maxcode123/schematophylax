import express from 'express';
import { db } from '../../prisma/db.js';
import { parseFields, parseUuid, requireFields } from './http.js';

const fields = { userGroupId: 'uuid', migrationId: 'uuid', log: 'text' } as const;

export const migrationLogsRouter: express.Router = express.Router();

migrationLogsRouter.get('/', async (_req, res) => {
  res.json(await db.orm.public.MigrationLog.all());
});

migrationLogsRouter.get('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.MigrationLog.first({ id }));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

migrationLogsRouter.post('/', async (req, res) => {
  const input = parseFields(req.body, fields);
  requireFields(input, ['userGroupId', 'migrationId', 'log']);
  res.status(201).json(await db.orm.public.MigrationLog.create(input));
});

migrationLogsRouter.patch('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.MigrationLog.where({ id }).update(parseFields(req.body, fields)));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

migrationLogsRouter.delete('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.MigrationLog.where({ id }).delete());
  if (!row) return void res.sendStatus(404);
  res.sendStatus(204);
});
