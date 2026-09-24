import { ReferenceNotFoundError, ReferencedRowConflictError } from '../errors.js';

/**
 * Translates the ORM's `SqlQueryError` for a Postgres foreign-key violation into an
 * application error; other errors pass through unchanged. The class is not exported by
 * the façade, so match on its documented `kind`/`sqlState`/`constraint` fields.
 */
function translateDbError(err: unknown): unknown {
  if (typeof err !== 'object' || err === null) return err;
  const { kind, sqlState, constraint } = err as { kind?: unknown; sqlState?: unknown; constraint?: unknown };
  if (kind !== 'sql_query') return err;
  const name = typeof constraint === 'string' ? constraint : undefined;
  if (sqlState === '23503') return new ReferenceNotFoundError(name);
  if (sqlState === '23001') return new ReferencedRowConflictError(name);
  return err;
}

/** Runs a database operation, rethrowing driver errors as application errors. */
export async function withDbErrors<T>(operation: () => PromiseLike<T>): Promise<T> {
  try {
    return await operation();
  } catch (err) {
    throw translateDbError(err);
  }
}
