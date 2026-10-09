/** Server-only pg options. A supplied CA always requires valid TLS. */
/** @param {string} connectionString @param {string | undefined} ca */
export function postgresOptions(connectionString, ca) {
  if (!ca?.trim()) return { connectionString };
  const url = new URL(connectionString);
  // pg-connection-string otherwise replaces the explicit SSL configuration.
  for (const key of ['ssl', 'sslmode', 'sslcert', 'sslkey', 'sslrootcert']) url.searchParams.delete(key);
  return { connectionString: url.toString(), ssl: { ca, rejectUnauthorized: true } };
}
