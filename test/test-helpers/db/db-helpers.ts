import { get } from '../../../config/convict';
import { Client, QueryResult } from 'pg';

/**
 * Creates a PG Client
 * @return {Client} PG Client
 */
function createClient(): Client {
  return new Client({
    host: get('typeorm.host'),
    port: get('typeorm.port'),
    user: get('typeorm.username'),
    password: get('typeorm.password'),
    database: get('typeorm.database'),
  });
}

/**
 * @return {Promise<QueryResult<any>>} Return all migrations
 */
export async function getMigrations(): Promise<QueryResult<any>> {
  const client = createClient();
  await client.connect();
  const res = await client.query('SELECT * FROM "migrations";');
  client.end();

  return res;
}

/**
 * @return {Promise<void>} Truncate a table
 */
export async function truncateTable(table: string): Promise<void> {
  const client = createClient();
  await client.connect();
  client.query(`TRUNCATE "${table}" CASCADE;`, async (err) => {
    if (err) {
      console.log(err);
    }
    await client.end();
  });
}

/**
 * Timeout helper function
 */
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @return {Promise<void>} Wait for postgres to be ready to accept connections
 */
export async function waitForPostgres(
  DEFAULT_MAX_ATTEMPTS = 20,
  DEFAULT_DELAY = 150,
): Promise<void> {
  let didConnect = false;
  let retries = 0;
  while (!didConnect) {
    try {
      const client = createClient();
      await client.connect();
      console.log('✅ Postgres is ready to accept connections');
      client.end();
      didConnect = true;
    } catch (error) {
      retries += 1;
      if (retries > DEFAULT_MAX_ATTEMPTS) {
        throw error;
      }
      console.log('😴 Postgres is unavailable - sleeping');
      await timeout(DEFAULT_DELAY);
    }
  }
}

export async function saveBook({
  name,
  author,
  genre,
  quantity,
  totalAvailable,
}): Promise<QueryResult<any>> {
  let client;
  try {
    const query = `INSERT INTO "books" ("name", "author", "genre", "quantity", "totalAvailable")
    VALUES ($1, $2, $3, $4, $5)`;
    client = createClient();
    await client.connect();
    const res = await client.query(query, [
      name,
      author,
      genre,
      quantity,
      totalAvailable,
    ]);
    return res.rows[0];
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
}
