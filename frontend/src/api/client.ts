/** Error body the backend returns for 4xx responses. */
export type ApiErrorBody = {
  error?: string;
  constraint?: string;
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
  ) {
    super(body.error ?? `request failed with status ${status}`);
  }
}

/** POSTs JSON to the backend through the `/api` proxy, throwing `ApiError` on a non-2xx response. */
export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data: unknown = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status, data as ApiErrorBody);
  return data as T;
}
