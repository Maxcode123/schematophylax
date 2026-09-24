import type { CreateMigrationInput, UpdateMigrationInput } from '../../application/services/migrations_service.js';
import type { Migration } from '../../domain/entities/migration.js';
import { parseFields, requireFields } from './parse.js';

export type CreateMigrationRequest = {
  userGroupId: string;
  postgresConnectionId: string;
  createByUserId: string;
  status: string;
};

export type UpdateMigrationRequest = Partial<CreateMigrationRequest>;

export type MigrationResponse = {
  id: string;
  userGroupId: string;
  postgresConnectionId: string;
  createByUserId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const fields = { userGroupId: 'uuid', postgresConnectionId: 'uuid', createByUserId: 'uuid', status: 'text' } as const;

export function parseCreateMigrationRequest(body: unknown): CreateMigrationInput {
  const request = parseFields(body, fields);
  requireFields(request, ['userGroupId', 'postgresConnectionId', 'createByUserId', 'status']);
  return request;
}

export function parseUpdateMigrationRequest(body: unknown): UpdateMigrationInput {
  return parseFields(body, fields);
}

export function toMigrationResponse(migration: Migration): MigrationResponse {
  return {
    id: migration.id,
    userGroupId: migration.userGroupId,
    postgresConnectionId: migration.postgresConnectionId,
    createByUserId: migration.createByUserId,
    status: migration.status,
    createdAt: migration.createdAt,
    updatedAt: migration.updatedAt,
  };
}
