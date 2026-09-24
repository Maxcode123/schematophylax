import express from 'express';
import { userGroupsService } from '../../application/services/index.js';
import { parseCreateUserGroupRequest, parseUpdateUserGroupRequest, toUserGroupResponse } from '../dtos/user-groups-dto.js';

export const userGroupsRouter: express.Router = express.Router();

userGroupsRouter.get('/', async (_req, res) => {
  res.json((await userGroupsService.list()).map(toUserGroupResponse));
});

userGroupsRouter.get('/:id', async (req, res) => {
  res.json(toUserGroupResponse(await userGroupsService.get(req.params.id)));
});

userGroupsRouter.post('/', async (req, res) => {
  res.status(201).json(toUserGroupResponse(await userGroupsService.create(parseCreateUserGroupRequest(req.body))));
});

userGroupsRouter.patch('/:id', async (req, res) => {
  res.json(toUserGroupResponse(await userGroupsService.update(req.params.id, parseUpdateUserGroupRequest(req.body))));
});

userGroupsRouter.delete('/:id', async (req, res) => {
  await userGroupsService.delete(req.params.id);
  res.sendStatus(204);
});
