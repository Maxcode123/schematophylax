import type { SignupInput, SignupResult } from '../../application/services/signup-service.js';
import { parseFields, requireFields } from './parse.js';
import { type UserGroupResponse, toUserGroupResponse } from './user-groups-dto.js';
import { type UserResponse, toUserResponse } from './users-dto.js';

export type SignupRequest = {
  groupName: string;
  email: string;
  username?: string;
};

export type SignupResponse = {
  userGroup: UserGroupResponse;
  user: UserResponse;
};

const fields = { groupName: 'text', email: 'text', username: 'text' } as const;

export function parseSignupRequest(body: unknown): SignupInput {
  const request = parseFields(body, fields);
  requireFields(request, ['groupName', 'email']);
  return request;
}

export function toSignupResponse(result: SignupResult): SignupResponse {
  return {
    userGroup: toUserGroupResponse(result.userGroup),
    user: toUserResponse(result.user),
  };
}
