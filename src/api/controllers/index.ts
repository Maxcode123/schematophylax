import express from 'express';
import { BadRequest, foreignKeyErrorStatus } from './http.js';
import { migrationLogsRouter } from './migrationLogs.js';
import { migrationsRouter } from './migrations.js';
import { postgresConnectionsRouter } from './postgresConnections.js';
import { userGroupsRouter } from './userGroups.js';
import { usersRouter } from './users.js';

export const apiRouter: express.Router = express.Router();

apiRouter.use('/user-groups', userGroupsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/postgres-connections', postgresConnectionsRouter);
apiRouter.use('/migrations', migrationsRouter);
apiRouter.use('/migration-logs', migrationLogsRouter);

apiRouter.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof BadRequest) return void res.status(400).json({ error: err.message });
  const fkStatus = foreignKeyErrorStatus(err);
  if (fkStatus) {
    const { constraint } = err as { constraint?: string };
    const error = fkStatus === 409 ? 'row is still referenced' : 'foreign key violation';
    return void res.status(fkStatus).json({ error, constraint });
  }
  next(err);
});
