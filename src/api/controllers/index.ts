import express from 'express';
import { NotFoundError, ReferenceNotFoundError, ReferencedRowConflictError } from '../../application/errors.js';
import { BadRequest } from '../dtos/parse.js';
import { migrationLogsRouter } from './migration-logs.js';
import { migrationsRouter } from './migrations.js';
import { postgresConnectionsRouter } from './postgres-connections.js';
import { userGroupsRouter } from './user-groups.js';
import { usersRouter } from './users.js';

export const apiRouter: express.Router = express.Router();

apiRouter.use('/user-groups', userGroupsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/postgres-connections', postgresConnectionsRouter);
apiRouter.use('/migrations', migrationsRouter);
apiRouter.use('/migration-logs', migrationLogsRouter);

apiRouter.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof BadRequest) return void res.status(400).json({ error: err.message });
  if (err instanceof NotFoundError) return void res.sendStatus(404);
  if (err instanceof ReferenceNotFoundError) {
    return void res.status(400).json({ error: 'foreign key violation', constraint: err.constraint });
  }
  if (err instanceof ReferencedRowConflictError) {
    return void res.status(409).json({ error: 'row is still referenced', constraint: err.constraint });
  }
  next(err);
});
