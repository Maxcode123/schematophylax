import type { User } from '../../domain/entities/user.js';
import type { UserGroup } from '../../domain/entities/user-group.js';
import type { db as Db } from '../../prisma/db.js';
import { withDbErrors } from './db-errors.js';
import { compact } from './patch.js';
import { toUserEntity } from './users-service.js';
import { toUserGroupEntity } from './user-groups-service.js';

export type SignupInput = {
  groupName: string;
  email: string;
  username?: string;
};

export type SignupResult = {
  userGroup: UserGroup;
  user: User;
};

export class SignupService {
  constructor(private readonly db: typeof Db) {}

  /** Creates a new user group with the signing-up user as its first member, atomically. */
  async signup(input: SignupInput): Promise<SignupResult> {
    return withDbErrors(() =>
      this.db.transaction(async (tx) => {
        const userGroup = await tx.orm.public.UserGroup.create({ name: input.groupName });
        const user = await tx.orm.public.User.create({
          userGroupId: userGroup.id,
          email: input.email,
          ...compact({ username: input.username }),
        });
        return { userGroup: toUserGroupEntity(userGroup), user: toUserEntity(user) };
      }),
    );
  }
}
