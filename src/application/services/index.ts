import { db } from '../../prisma/db.js';
import { MigrationLogsService } from './migration_logs_service.js';
import { MigrationsService } from './migrations_service.js';
import { PostgresConnectionsService } from './postgres_connections_service.js';
import { UserGroupsService } from './user_groups_service.js';
import { UsersService } from './users_service.js';

export const userGroupsService = new UserGroupsService(db);
export const usersService = new UsersService(db);
export const postgresConnectionsService = new PostgresConnectionsService(db);
export const migrationsService = new MigrationsService(db);
export const migrationLogsService = new MigrationLogsService(db);
