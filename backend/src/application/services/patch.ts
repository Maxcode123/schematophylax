type Compact<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

/** Drops `undefined` values so a partial update only sets the fields it was given. */
export function compact<T extends Record<string, unknown>>(values: T): Compact<T> {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined)) as Compact<T>;
}

/** Applies `fn` to an optional patch value, keeping it absent when absent. */
export function mapOptional<A, B>(value: A | undefined, fn: (value: A) => B): B | undefined {
  return value === undefined ? undefined : fn(value);
}
