import type { CreateMigrationLogInput, UpdateMigrationLogInput } from '../../application/services/migration-logs-service.js';
import type { MigrationLog } from '../../domain/entities/migration-log.js';
import { parseFields, requireFields } from './parse.js';

export type CreateMigrationLogRequest = {
  userGroupId: string;
  migrationId: string;
  log: string;
};

export type UpdateMigrationLogRequest = Partial<CreateMigrationLogRequest>;

export type MigrationLogResponse = {
  id: string;
  userGroupId: string;
  migrationId: string;
  log: string;
  createdAt: string;
  updatedAt: string;
};

const fields = { userGroupId: 'uuid', migrationId: 'uuid', log: 'text' } as const;

export function parseCreateMigrationLogRequest(body: unknown): CreateMigrationLogInput {
  const request = parseFields(body, fields);
  requireFields(request, ['userGroupId', 'migrationId', 'log']);
  return request;
}

export function parseUpdateMigrationLogRequest(body: unknown): UpdateMigrationLogInput {
  return parseFields(body, fields);
}

export function toMigrationLogResponse(migrationLog: MigrationLog): MigrationLogResponse {
  return {
    id: migrationLog.id,
    userGroupId: migrationLog.userGroupId,
    migrationId: migrationLog.migrationId,
    log: migrationLog.log,
    createdAt: migrationLog.createdAt,
    updatedAt: migrationLog.updatedAt,
  };
}
