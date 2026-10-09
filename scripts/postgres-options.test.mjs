import { test } from 'node:test';
import assert from 'node:assert/strict';
import { postgresOptions } from './postgres-options.mjs';
import pg from 'pg';

test('custom CA enforces certificate verification despite URL SSL overrides', () => {
  const options = postgresOptions('postgres://user:secret@host/db?sslmode=no-verify&application_name=cards', 'certificate');
  assert.deepEqual(options.ssl, { ca: 'certificate', rejectUnauthorized: true });
  assert.equal(new URL(options.connectionString).searchParams.has('sslmode'), false);
  assert.equal(new URL(options.connectionString).searchParams.get('application_name'), 'cards');
});

test('existing providers keep their connection options without a custom CA', () => {
  assert.deepEqual(postgresOptions('postgres://host/db?sslmode=require', undefined), { connectionString: 'postgres://host/db?sslmode=require' });
});

test('pg cannot disable or replace the supplied CA through the URL', () => {
  for (const ssl of ['0', 'true']) {
    const options = postgresOptions(`postgres://user:secret@host/db?ssl=${ssl}&sslmode=no-verify`, 'certificate');
    assert.deepEqual(new pg.Client(options).connectionParameters.ssl, { ca: 'certificate', rejectUnauthorized: true });
  }
});
