import express from 'express';
import { db } from '../../prisma/db.js';
import { parseFields, parseUuid, requireFields } from './http.js';

const fields = { userGroupId: 'uuid', name: 'text', encrypted_conn_str: 'text' } as const;

export const postgresConnectionsRouter: express.Router = express.Router();

postgresConnectionsRouter.get('/', async (_req, res) => {
  res.json(await db.orm.public.PostgresConnection.all());
});

postgresConnectionsRouter.get('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.PostgresConnection.first({ id }));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

postgresConnectionsRouter.post('/', async (req, res) => {
  const input = parseFields(req.body, fields);
  requireFields(input, ['userGroupId', 'name', 'encrypted_conn_str']);
  res.status(201).json(await db.orm.public.PostgresConnection.create(input));
});

postgresConnectionsRouter.patch('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.PostgresConnection.where({ id }).update(parseFields(req.body, fields)));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

postgresConnectionsRouter.delete('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.PostgresConnection.where({ id }).delete());
  if (!row) return void res.sendStatus(404);
  res.sendStatus(204);
});
