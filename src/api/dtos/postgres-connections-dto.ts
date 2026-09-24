import type {
  CreatePostgresConnectionInput,
  UpdatePostgresConnectionInput,
} from '../../application/services/postgres-connections-service.js';
import type { PostgresConnection } from '../../domain/entities/postgres-connection.js';
import { parseFields, requireFields } from './parse.js';

export type CreatePostgresConnectionRequest = {
  userGroupId: string;
  name: string;
  encrypted_conn_str: string;
};

export type UpdatePostgresConnectionRequest = Partial<CreatePostgresConnectionRequest>;

/** Leaves out the encrypted connection string: it is accepted on writes but never returned. */
export type PostgresConnectionResponse = {
  id: string;
  userGroupId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const fields = { userGroupId: 'uuid', name: 'text', encrypted_conn_str: 'text' } as const;

export function parseCreatePostgresConnectionRequest(body: unknown): CreatePostgresConnectionInput {
  const request = parseFields(body, fields);
  requireFields(request, ['userGroupId', 'name', 'encrypted_conn_str']);
  return { userGroupId: request.userGroupId, name: request.name, encryptedConnStr: request.encrypted_conn_str };
}

export function parseUpdatePostgresConnectionRequest(body: unknown): UpdatePostgresConnectionInput {
  const { encrypted_conn_str, ...rest } = parseFields(body, fields);
  return encrypted_conn_str === undefined ? rest : { ...rest, encryptedConnStr: encrypted_conn_str };
}

export function toPostgresConnectionResponse(connection: PostgresConnection): PostgresConnectionResponse {
  return {
    id: connection.id,
    userGroupId: connection.userGroupId,
    name: connection.name,
    createdAt: connection.createdAt,
    updatedAt: connection.updatedAt,
  };
}
