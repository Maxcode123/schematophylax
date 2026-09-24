import { postJson } from './client.ts';

// Mirror backend/src/api/dtos/signup-dto.ts.

export type SignupRequest = {
  groupName: string;
  email: string;
  username?: string;
};

export type SignupResponse = {
  userGroup: { id: string; name: string; createdAt: string; updatedAt: string };
  user: {
    id: string;
    userGroupId: string;
    email: string;
    username: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

export function signup(request: SignupRequest): Promise<SignupResponse> {
  return postJson<SignupResponse>('/signup', request);
}
