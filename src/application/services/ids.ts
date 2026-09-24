import type { Models } from '../../prisma/contract.d';
import { NotFoundError, ReferenceNotFoundError } from '../errors.js';

/** Branded `Char<36>` type used for every uuid column in the contract. */
export type Uuid = Models.public_User['id'];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** The id of the row being read or written; a malformed id cannot match a row. */
export function rowId(id: string): Uuid {
  if (!UUID_RE.test(id)) throw new NotFoundError();
  return id as Uuid;
}

/** A reference field's value; a malformed id cannot reference a row. */
export function refId(id: string): Uuid {
  if (!UUID_RE.test(id)) throw new ReferenceNotFoundError(undefined);
  return id as Uuid;
}

