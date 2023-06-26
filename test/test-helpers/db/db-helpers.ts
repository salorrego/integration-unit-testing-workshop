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
