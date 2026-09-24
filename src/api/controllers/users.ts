import express from 'express';
import { db } from '../../prisma/db.js';
import { parseFields, parseUuid, requireFields } from './http.js';

const fields = { userGroupId: 'uuid', email: 'text', username: 'text' } as const;

export const usersRouter: express.Router = express.Router();

usersRouter.get('/', async (_req, res) => {
  res.json(await db.orm.public.User.all());
});

usersRouter.get('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.User.first({ id }));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

usersRouter.post('/', async (req, res) => {
  const input = parseFields(req.body, fields);
  requireFields(input, ['userGroupId', 'email']);
  res.status(201).json(await db.orm.public.User.create(input));
});

usersRouter.patch('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.User.where({ id }).update(parseFields(req.body, fields)));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

usersRouter.delete('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.User.where({ id }).delete());
  if (!row) return void res.sendStatus(404);
  res.sendStatus(204);
});
