import express from 'express';
import { usersService } from '../../application/services/index.js';
import { parseCreateUserRequest, parseUpdateUserRequest, toUserResponse } from '../dtos/users_dto.js';

export const usersRouter: express.Router = express.Router();

usersRouter.get('/', async (_req, res) => {
  res.json((await usersService.list()).map(toUserResponse));
});

usersRouter.get('/:id', async (req, res) => {
  res.json(toUserResponse(await usersService.get(req.params.id)));
});

usersRouter.post('/', async (req, res) => {
  res.status(201).json(toUserResponse(await usersService.create(parseCreateUserRequest(req.body))));
});

usersRouter.patch('/:id', async (req, res) => {
  res.json(toUserResponse(await usersService.update(req.params.id, parseUpdateUserRequest(req.body))));
});

usersRouter.delete('/:id', async (req, res) => {
  await usersService.delete(req.params.id);
  res.sendStatus(204);
});
