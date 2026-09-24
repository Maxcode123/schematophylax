import express from 'express';
import { db } from '../../prisma/db.js';
import { parseFields, parseUuid, requireFields } from './http.js';

const fields = { userGroupId: 'uuid', postgresConnectionId: 'uuid', createByUserId: 'uuid', status: 'text' } as const;

export const migrationsRouter: express.Router = express.Router();

migrationsRouter.get('/', async (_req, res) => {
  res.json(await db.orm.public.Migration.all());
});

migrationsRouter.get('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.Migration.first({ id }));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

migrationsRouter.post('/', async (req, res) => {
  const input = parseFields(req.body, fields);
  requireFields(input, ['userGroupId', 'postgresConnectionId', 'createByUserId', 'status']);
  res.status(201).json(await db.orm.public.Migration.create(input));
});

migrationsRouter.patch('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.Migration.where({ id }).update(parseFields(req.body, fields)));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

migrationsRouter.delete('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.Migration.where({ id }).delete());
  if (!row) return void res.sendStatus(404);
  res.sendStatus(204);
});
