const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type FieldKind = 'text' | 'uuid';
type Fields<S extends Record<string, FieldKind>> = { [K in keyof S]?: string };

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
    if (typeof value !== 'string' || (kind === 'uuid' && !UUID_RE.test(value))) {
      throw new BadRequest(`${key} must be a ${kind === 'uuid' ? 'uuid' : 'string'}`);
    }
    out[key] = value;
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
