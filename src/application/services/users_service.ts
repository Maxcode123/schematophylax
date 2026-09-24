import type { User } from '../../domain/entities/user.js';
import type { db as Db } from '../../prisma/db.js';
import { NotFoundError } from '../errors.js';
import { withDbErrors } from './db_errors.js';
import { refId, rowId } from './ids.js';
import { compact, mapOptional } from './patch.js';

export type CreateUserInput = {
  userGroupId: string;
  email: string;
  username?: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;

type UserRow = {
  id: string;
  userGroupId: string;
  email: string;
  username: string | null;
  createdAt: string;
  updatedAt: string;
};

function toEntity(row: UserRow): User {
  return {
    id: row.id,
    userGroupId: row.userGroupId,
    email: row.email,
    username: row.username,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class UsersService {
  constructor(private readonly db: typeof Db) {}

  async list(): Promise<User[]> {
    const rows = await withDbErrors(() => this.db.orm.public.User.all());
    return rows.map(toEntity);
  }

  async get(id: string): Promise<User> {
    const row = await withDbErrors(() => this.db.orm.public.User.first({ id: rowId(id) }));
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async create(input: CreateUserInput): Promise<User> {
    const row = await withDbErrors(() =>
      this.db.orm.public.User.create({
        userGroupId: refId(input.userGroupId),
        email: input.email,
        ...compact({ username: input.username }),
      }),
    );
    return toEntity(row);
  }

  async update(id: string, patch: UpdateUserInput): Promise<User> {
    const row = await withDbErrors(() =>
      this.db.orm.public.User.where({ id: rowId(id) }).update(
        compact({
          userGroupId: mapOptional(patch.userGroupId, refId),
          email: patch.email,
          username: patch.username,
        }),
      ),
    );
    if (!row) throw new NotFoundError();
    return toEntity(row);
  }

  async delete(id: string): Promise<void> {
    const row = await withDbErrors(() => this.db.orm.public.User.where({ id: rowId(id) }).delete());
    if (!row) throw new NotFoundError();
  }
}
