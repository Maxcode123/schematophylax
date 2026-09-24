import { db } from '../../prisma/db.js';
import { MigrationLogsService } from './migration-logs-service.js';
import { MigrationsService } from './migrations-service.js';
import { PostgresConnectionsService } from './postgres-connections-service.js';
import { UserGroupsService } from './user-groups-service.js';
import { UsersService } from './users-service.js';

export const userGroupsService = new UserGroupsService(db);
export const usersService = new UsersService(db);
export const postgresConnectionsService = new PostgresConnectionsService(db);
export const migrationsService = new MigrationsService(db);
export const migrationLogsService = new MigrationLogsService(db);
