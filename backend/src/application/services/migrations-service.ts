import type { Migration } from '../../domain/entities/migration.js';
import type { db as Db } from '../../prisma/db.js';
import { NotFoundError } from '../errors.js';
import { withDbErrors } from './db-errors.js';
import { refId, rowId } from './ids.js';
import { compact, mapOptional } from './patch.js';

export type CreateMigrationInput = {
  userGroupId: string;
  postgresConnectionId: string;
  createByUserId: string;
  status: string;
};

export type UpdateMigrationInput = Partial<CreateMigrationInput>;

type MigrationRow = {
  id: string;
  userGroupId: string;
  postgresConnectionId: string;
  createByUserId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function toEntity(row: MigrationRow): Migration {
  return {
    id: row.id,
    userGroupId: row.userGroupId,
    postgresConnectionId: row.postgresConnectionId,
    createByUserId: row.createByUserId,
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class MigrationsService {
  constructor(private readonly db: typeof Db) {}

  async list(): Promise<Migration[]> {
    const rows = await withDbErrors(() => this.db.orm.public.Migration.all());
    return rows.map(toEntity);
  }

  async get(id: string): Promise<Migration> {
    const row = await withDbErrors(() => this.db.orm.public.Migration.first({ id: rowId(id) }));
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async create(input: CreateMigrationInput): Promise<Migration> {
    const row = await withDbErrors(() =>
      this.db.orm.public.Migration.create({
        userGroupId: refId(input.userGroupId),
        postgresConnectionId: refId(input.postgresConnectionId),
        createByUserId: refId(input.createByUserId),
        status: input.status,
      }),
    );
    return toEntity(row);
  }

  async update(id: string, patch: UpdateMigrationInput): Promise<Migration> {
    const row = await withDbErrors(() =>
      this.db.orm.public.Migration.where({ id: rowId(id) }).update(
        compact({
          userGroupId: mapOptional(patch.userGroupId, refId),
          postgresConnectionId: mapOptional(patch.postgresConnectionId, refId),
          createByUserId: mapOptional(patch.createByUserId, refId),
          status: patch.status,
        }),
      ),
    );
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async delete(id: string): Promise<void> {
    const row = await withDbErrors(() => this.db.orm.public.Migration.where({ id: rowId(id) }).delete());
    if (!row) throw new NotFoundError();
  }
}
