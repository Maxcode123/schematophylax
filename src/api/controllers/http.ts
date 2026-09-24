import type { Models } from '../../prisma/contract.d';

/** Branded `Char<36>` type used for every uuid column in the contract. */
export type Uuid = Models.public_User['id'];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseUuid(value: unknown): Uuid | undefined {
  return typeof value === 'string' && UUID_RE.test(value) ? (value as Uuid) : undefined;
}

type FieldKind = 'text' | 'uuid';
type Fields<S extends Record<string, FieldKind>> = {
  [K in keyof S]?: S[K] extends 'uuid' ? Uuid : string;
};

export class BadRequest extends Error {}

/**
 * Picks the writable fields in `spec` from an untrusted request body.
 * Absent keys are skipped; present keys of the wrong type throw `BadRequest`.
 */
export function parseFields<S extends Record<string, FieldKind>>(body: unknown, spec: S): Fields<S> {
  const out: Record<string, string> = {};
  const src = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
  for (const [key, kind] of Object.entries(spec)) {
    const value = src[key];
    if (value === undefined) continue;
    const parsed = kind === 'uuid' ? parseUuid(value) : typeof value === 'string' ? value : undefined;
    if (parsed === undefined) throw new BadRequest(`${key} must be a ${kind === 'uuid' ? 'uuid' : 'string'}`);
    out[key] = parsed;
  }
  return out as Fields<S>;
}

/** Narrows parsed fields so `keys` are present, throwing `BadRequest` otherwise. */
export function requireFields<T extends object, K extends keyof T>(
  input: T,
  keys: readonly K[],
): asserts input is T & Required<Pick<T, K>> {
  const missing = keys.filter((key) => input[key] === undefined);
  if (missing.length) throw new BadRequest(`missing required fields: ${missing.join(', ')}`);
}
