import type { CreateUserGroupInput, UpdateUserGroupInput } from '../../application/services/user-groups-service.js';
import type { UserGroup } from '../../domain/entities/user-group.js';
import { parseFields, requireFields } from './parse.js';

export type CreateUserGroupRequest = {
  name: string;
};

export type UpdateUserGroupRequest = Partial<CreateUserGroupRequest>;

export type UserGroupResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const fields = { name: 'text' } as const;

export function parseCreateUserGroupRequest(body: unknown): CreateUserGroupInput {
  const request = parseFields(body, fields);
  requireFields(request, ['name']);
  return request;
}

export function parseUpdateUserGroupRequest(body: unknown): UpdateUserGroupInput {
  return parseFields(body, fields);
}

export function toUserGroupResponse(userGroup: UserGroup): UserGroupResponse {
  return {
    id: userGroup.id,
    name: userGroup.name,
    createdAt: userGroup.createdAt,
    updatedAt: userGroup.updatedAt,
  };
}
