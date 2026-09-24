import type { MigrationLog } from '../../domain/entities/migration-log.js';
import type { db as Db } from '../../prisma/db.js';
import { NotFoundError } from '../errors.js';
import { withDbErrors } from './db-errors.js';
import { refId, rowId } from './ids.js';
import { compact, mapOptional } from './patch.js';

export type CreateMigrationLogInput = {
  userGroupId: string;
  migrationId: string;
  log: string;
};

export type UpdateMigrationLogInput = Partial<CreateMigrationLogInput>;

type MigrationLogRow = {
  id: string;
  userGroupId: string;
  migrationId: string;
  log: string;
  createdAt: string;
  updatedAt: string;
};

function toEntity(row: MigrationLogRow): MigrationLog {
  return {
    id: row.id,
    userGroupId: row.userGroupId,
    migrationId: row.migrationId,
    log: row.log,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class MigrationLogsService {
  constructor(private readonly db: typeof Db) {}

  async list(): Promise<MigrationLog[]> {
    const rows = await withDbErrors(() => this.db.orm.public.MigrationLog.all());
    return rows.map(toEntity);
  }

  async get(id: string): Promise<MigrationLog> {
    const row = await withDbErrors(() => this.db.orm.public.MigrationLog.first({ id: rowId(id) }));
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async create(input: CreateMigrationLogInput): Promise<MigrationLog> {
    const row = await withDbErrors(() =>
      this.db.orm.public.MigrationLog.create({
        userGroupId: refId(input.userGroupId),
        migrationId: refId(input.migrationId),
        log: input.log,
      }),
    );
    return toEntity(row);
  }

  async update(id: string, patch: UpdateMigrationLogInput): Promise<MigrationLog> {
    const row = await withDbErrors(() =>
      this.db.orm.public.MigrationLog.where({ id: rowId(id) }).update(
        compact({
          userGroupId: mapOptional(patch.userGroupId, refId),
          migrationId: mapOptional(patch.migrationId, refId),
          log: patch.log,
        }),
      ),
    );
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async delete(id: string): Promise<void> {
    const row = await withDbErrors(() => this.db.orm.public.MigrationLog.where({ id: rowId(id) }).delete());
    if (!row) throw new NotFoundError();
  }
}
