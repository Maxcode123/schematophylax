import type { PostgresConnection } from '../../domain/entities/postgres-connection.js';
import type { db as Db } from '../../prisma/db.js';
import { NotFoundError } from '../errors.js';
import { withDbErrors } from './db-errors.js';
import { refId, rowId } from './ids.js';
import { compact, mapOptional } from './patch.js';

export type CreatePostgresConnectionInput = {
  userGroupId: string;
  name: string;
  encryptedConnStr: string;
};

export type UpdatePostgresConnectionInput = Partial<CreatePostgresConnectionInput>;

type PostgresConnectionRow = {
  id: string;
  userGroupId: string;
  name: string;
  encrypted_conn_str: string;
  createdAt: string;
  updatedAt: string;
};

function toEntity(row: PostgresConnectionRow): PostgresConnection {
  return {
    id: row.id,
    userGroupId: row.userGroupId,
    name: row.name,
    encryptedConnStr: row.encrypted_conn_str,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class PostgresConnectionsService {
  constructor(private readonly db: typeof Db) {}

  async list(): Promise<PostgresConnection[]> {
    const rows = await withDbErrors(() => this.db.orm.public.PostgresConnection.all());
    return rows.map(toEntity);
  }

  async get(id: string): Promise<PostgresConnection> {
    const row = await withDbErrors(() => this.db.orm.public.PostgresConnection.first({ id: rowId(id) }));
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async create(input: CreatePostgresConnectionInput): Promise<PostgresConnection> {
    const row = await withDbErrors(() =>
      this.db.orm.public.PostgresConnection.create({
        userGroupId: refId(input.userGroupId),
        name: input.name,
        encrypted_conn_str: input.encryptedConnStr,
      }),
    );
    return toEntity(row);
  }

  async update(id: string, patch: UpdatePostgresConnectionInput): Promise<PostgresConnection> {
    const row = await withDbErrors(() =>
      this.db.orm.public.PostgresConnection.where({ id: rowId(id) }).update(
        compact({
          userGroupId: mapOptional(patch.userGroupId, refId),
          name: patch.name,
          encrypted_conn_str: patch.encryptedConnStr,
        }),
      ),
    );
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async delete(id: string): Promise<void> {
    const row = await withDbErrors(() => this.db.orm.public.PostgresConnection.where({ id: rowId(id) }).delete());
    if (!row) throw new NotFoundError();
  }
}
