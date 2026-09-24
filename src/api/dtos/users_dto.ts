import type { CreateUserInput, UpdateUserInput } from '../../application/services/users_service.js';
import type { User } from '../../domain/entities/user.js';
import { parseFields, requireFields } from './parse.js';

export type CreateUserRequest = {
  userGroupId: string;
  email: string;
  username?: string;
};

export type UpdateUserRequest = Partial<CreateUserRequest>;

export type UserResponse = {
  id: string;
  userGroupId: string;
  email: string;
  username: string | null;
  createdAt: string;
  updatedAt: string;
};

const fields = { userGroupId: 'uuid', email: 'text', username: 'text' } as const;

export function parseCreateUserRequest(body: unknown): CreateUserInput {
  const request = parseFields(body, fields);
  requireFields(request, ['userGroupId', 'email']);
  return request;
}

export function parseUpdateUserRequest(body: unknown): UpdateUserInput {
  return parseFields(body, fields);
}

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    userGroupId: user.userGroupId,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
