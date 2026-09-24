import { defineContract } from '@prisma/orm-postgres/contract-builder';

export const contract = defineContract({}, ({ field, model, rel }) => {
  const UserGroup = model('UserGroup', {
      fields: {
          id: field.id.uuidv7String(),
          name: field.text(),
          createdAt: field.temporal.createdAtString(),
          updatedAt: field.temporal.updatedAtString(),
      },
  });

  const User = model('User', {
    fields: {
      id: field.id.uuidv7String(),
      userGroupId: field.uuidString(),
      email: field.text().unique(),
      username: field.text().optional(),
      createdAt: field.temporal.createdAtString(),
      updatedAt: field.temporal.updatedAtString(),
    },
  });

  const PostgresConnection = model('PostgresConnection', {
      fields: {
          id: field.id.uuidv7String(),
          userGroupId: field.uuidString(),
          name: field.text(),
          encrypted_conn_str: field.text(),
          createdAt: field.temporal.createdAtString(),
          updatedAt: field.temporal.updatedAtString(),
      }
  });

  const Migration = model('Migration', {
      fields: {
          id: field.id.uuidv7String(),
          userGroupId: field.uuidString(),
          postgresConnectionId: field.uuidString(),
          createByUserId: field.uuidString(),
          status: field.text(),
          createdAt: field.temporal.createdAtString(),
          updatedAt: field.temporal.updatedAtString(),
      }
  });

  const MigrationLog = model('MigrationLog', {
      fields: {
          id: field.id.uuidv7String(),
          userGroupId: field.uuidString(),
          migrationId: field.uuidString(),
          log: field.text(),
          createdAt: field.temporal.createdAtString(),
          updatedAt: field.temporal.updatedAtString(),
      }
  });

  return {
    models: {
      UserGroup: UserGroup.relations({
        users: rel.hasMany(User, { by: 'userGroupId' }),
      }),
      User: User.relations({
        userGroup: rel.belongsTo(UserGroup, { from: 'userGroupId', to: 'id' })
          .sql({ fk: { onDelete: 'cascade' } }),
      }),
      PostgresConnection: PostgresConnection.relations({
        userGroup: rel.belongsTo(UserGroup, { from: 'userGroupId', to: 'id' })
          .sql({ fk: { onDelete: 'cascade' } }),
      }),
      Migration: Migration.relations({
        userGroup: rel.belongsTo(UserGroup, { from: 'userGroupId', to: 'id' })
          .sql({ fk: { onDelete: 'cascade' } }),
        postgresConnection: rel.belongsTo(PostgresConnection, { from: 'postgresConnectionId', to: 'id' })
          .sql({ fk: { onDelete: 'restrict' } }),
        createdBy: rel.belongsTo(User, { from: 'createByUserId', to: 'id' })
          .sql({ fk: { onDelete: 'restrict' } }),
      }),
      MigrationLog: MigrationLog.relations({
        userGroup: rel.belongsTo(UserGroup, { from: 'userGroupId', to: 'id' })
          .sql({ fk: { onDelete: 'cascade' } }),
        migration: rel.belongsTo(Migration, { from: 'migrationId', to: 'id' })
          .sql({ fk: { onDelete: 'cascade' } }),
      }),
    },
  };
});
