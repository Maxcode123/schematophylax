import express from 'express';
import { db } from '../../prisma/db.js';
import { parseFields, parseUuid, requireFields } from './http.js';

const fields = { name: 'text' } as const;

export const userGroupsRouter: express.Router = express.Router();

userGroupsRouter.get('/', async (_req, res) => {
  res.json(await db.orm.public.UserGroup.all());
});

userGroupsRouter.get('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.UserGroup.first({ id }));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

userGroupsRouter.post('/', async (req, res) => {
  const input = parseFields(req.body, fields);
  requireFields(input, ['name']);
  res.status(201).json(await db.orm.public.UserGroup.create(input));
});

userGroupsRouter.patch('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.UserGroup.where({ id }).update(parseFields(req.body, fields)));
  if (!row) return void res.sendStatus(404);
  res.json(row);
});

userGroupsRouter.delete('/:id', async (req, res) => {
  const id = parseUuid(req.params.id);
  const row = id && (await db.orm.public.UserGroup.where({ id }).delete());
  if (!row) return void res.sendStatus(404);
  res.sendStatus(204);
});
