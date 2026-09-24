import type { OpenAPIV3_1 } from 'openapi-types';

// Hand-written to mirror the request/response DTOs in ./dtos — update both together.

type Schema = OpenAPIV3_1.SchemaObject;

const uuid: Schema = { type: 'string', format: 'uuid' };
const text: Schema = { type: 'string' };
const timestamp: Schema = {
  type: 'string',
  description: 'Postgres timestamptz text, e.g. `2026-09-24 09:51:52.546245+00`',
};

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

/** Builds the Create/Update request and Response schemas for one resource. */
function resourceSchemas(
  name: string,
  writable: Record<string, Schema>,
  required: string[],
  response: Record<string, Schema>,
): Record<string, Schema> {
  return {
    [`Create${name}Request`]: { type: 'object', properties: writable, required, additionalProperties: false },
    [`Update${name}Request`]: { type: 'object', properties: writable, additionalProperties: false },
    [`${name}Response`]: {
      type: 'object',
      properties: { id: uuid, ...response, createdAt: timestamp, updatedAt: timestamp },
      required: ['id', ...Object.keys(response), 'createdAt', 'updatedAt'],
    },
  };
}

const json = (schema: object) => ({ 'application/json': { schema } });
const errorResponse = (description: string) => ({ description, content: json(ref('Error')) });
const notFound = { description: 'No row with this id' };

/** Builds the list/create and get/patch/delete paths for one resource. */
function crudPaths(
  path: string,
  tag: string,
  name: string,
  { restrictedDelete = false }: { restrictedDelete?: boolean } = {},
): OpenAPIV3_1.PathsObject {
  // Untyped literal: openapi-types' 3.1 ParameterObject reuses 3.0 schema types.
  const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } } as const;
  const invalid = errorResponse('Invalid body, or a referenced row does not exist');
  return {
    [`/${path}`]: {
      get: {
        tags: [tag],
        operationId: `list${name}s`,
        summary: `List ${tag.toLowerCase()}`,
        responses: { '200': { description: 'OK', content: json({ type: 'array', items: ref(`${name}Response`) }) } },
      },
      post: {
        tags: [tag],
        operationId: `create${name}`,
        summary: `Create a ${name}`,
        requestBody: { required: true, content: json(ref(`Create${name}Request`)) },
        responses: { '201': { description: 'Created', content: json(ref(`${name}Response`)) }, '400': invalid },
      },
    },
    [`/${path}/{id}`]: {
      parameters: [idParam],
      get: {
        tags: [tag],
        operationId: `get${name}`,
        summary: `Get a ${name}`,
        responses: { '200': { description: 'OK', content: json(ref(`${name}Response`)) }, '404': notFound },
      },
      patch: {
        tags: [tag],
        operationId: `update${name}`,
        summary: `Update a ${name}`,
        requestBody: { required: true, content: json(ref(`Update${name}Request`)) },
        responses: {
          '200': { description: 'OK', content: json(ref(`${name}Response`)) },
          '400': invalid,
          '404': notFound,
        },
      },
      delete: {
        tags: [tag],
        operationId: `delete${name}`,
        summary: `Delete a ${name}`,
        responses: {
          '204': { description: 'Deleted' },
          '404': notFound,
          ...(restrictedDelete && { '409': errorResponse('Other rows still reference this row') }),
        },
      },
    },
  };
}

export const openApiDocument: OpenAPIV3_1.Document = {
  openapi: '3.1.0',
  info: { title: 'Schematophylax API', version: '1.0.0' },
  servers: [{ url: '/' }],
  tags: [
    { name: 'User groups' },
    { name: 'Users' },
    { name: 'Postgres connections' },
    { name: 'Migrations' },
    { name: 'Migration logs' },
  ],
  paths: {
    ...crudPaths('user-groups', 'User groups', 'UserGroup'),
    ...crudPaths('users', 'Users', 'User', { restrictedDelete: true }),
    ...crudPaths('postgres-connections', 'Postgres connections', 'PostgresConnection', { restrictedDelete: true }),
    ...crudPaths('migrations', 'Migrations', 'Migration'),
    ...crudPaths('migration-logs', 'Migration logs', 'MigrationLog'),
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: text,
          constraint: { type: 'string', description: 'Foreign key constraint that was violated' },
        },
        required: ['error'],
      },
      ...resourceSchemas('UserGroup', { name: text }, ['name'], { name: text }),
      ...resourceSchemas(
        'User',
        { userGroupId: uuid, email: text, username: text },
        ['userGroupId', 'email'],
        { userGroupId: uuid, email: text, username: { type: ['string', 'null'] } },
      ),
      ...resourceSchemas(
        'PostgresConnection',
        { userGroupId: uuid, name: text, encrypted_conn_str: { ...text, writeOnly: true } },
        ['userGroupId', 'name', 'encrypted_conn_str'],
        { userGroupId: uuid, name: text },
      ),
      ...resourceSchemas(
        'Migration',
        { userGroupId: uuid, postgresConnectionId: uuid, createByUserId: uuid, status: text },
        ['userGroupId', 'postgresConnectionId', 'createByUserId', 'status'],
        { userGroupId: uuid, postgresConnectionId: uuid, createByUserId: uuid, status: text },
      ),
      ...resourceSchemas(
        'MigrationLog',
        { userGroupId: uuid, migrationId: uuid, log: text },
        ['userGroupId', 'migrationId', 'log'],
        { userGroupId: uuid, migrationId: uuid, log: text },
      ),
    },
  },
};
