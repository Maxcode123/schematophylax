import type { UserGroup } from '../../domain/entities/user-group.js';
import type { db as Db } from '../../prisma/db.js';
import { NotFoundError } from '../errors.js';
import { withDbErrors } from './db-errors.js';
import { rowId } from './ids.js';
import { compact } from './patch.js';

export type CreateUserGroupInput = {
  name: string;
};

export type UpdateUserGroupInput = Partial<CreateUserGroupInput>;

type UserGroupRow = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

function toEntity(row: UserGroupRow): UserGroup {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class UserGroupsService {
  constructor(private readonly db: typeof Db) {}

  async list(): Promise<UserGroup[]> {
    const rows = await withDbErrors(() => this.db.orm.public.UserGroup.all());
    return rows.map(toEntity);
  }

  async get(id: string): Promise<UserGroup> {
    const row = await withDbErrors(() => this.db.orm.public.UserGroup.first({ id: rowId(id) }));
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async create(input: CreateUserGroupInput): Promise<UserGroup> {
    const row = await withDbErrors(() => this.db.orm.public.UserGroup.create({ name: input.name }));
    return toEntity(row);
  }

  async update(id: string, patch: UpdateUserGroupInput): Promise<UserGroup> {
    const row = await withDbErrors(() =>
      this.db.orm.public.UserGroup.where({ id: rowId(id) }).update(compact({ name: patch.name })),
    );
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async delete(id: string): Promise<void> {
    const row = await withDbErrors(() => this.db.orm.public.UserGroup.where({ id: rowId(id) }).delete());
    if (!row) throw new NotFoundError();
  }
}
