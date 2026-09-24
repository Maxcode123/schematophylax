/** The requested row does not exist. */
export class NotFoundError extends Error {}

/** A reference field points at a row that does not exist. */
export class ReferenceNotFoundError extends Error {
  constructor(readonly constraint: string | undefined) {
    super('referenced row does not exist');
  }
}

/** The row cannot be deleted because other rows still reference it. */
export class ReferencedRowConflictError extends Error {
  constructor(readonly constraint: string | undefined) {
    super('row is still referenced');
  }
}
