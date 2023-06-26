// Set ENV variables
process.env.LOG_LEVEL = 'debug';
process.env.LOG_PRETTY_PRINT = 'true';
process.env.DEVICE_PORT = '3333';
process.env.TYPEORM_PORT = '54320';
process.env.TYPEORM_HOST = 'localhost';

import { join, dirname } from 'path';
import { upAll } from 'docker-compose';
import isPortReachable from 'is-port-reachable';
import { exec } from 'child_process';
import { promisify } from 'util';
import { waitForPostgres } from '../test-helpers';

export default async function setup() {
  // ✅ Best practice: Give to devs the possibility to avoid this steps
  if (process.argv.includes('--silent')) {
    process.env.LOG_ENABLED = 'false';
  }

  if (process.env.noInfrastructure) {
    return;
  }

  const isDBReachable = await isPortReachable(54320, { host: 'localhost' });
  if (!isDBReachable) {
    // 🏃🏻‍♂️ Run docker
    await upAll({
      cwd: join(dirname(__filename), './docker'),
      log: true,
    });
  }

  // 😴 Wait for Postgres to be ready to accept connections
  await waitForPostgres();

  // 🏁 Apply DB migrations
  const customExec = promisify(exec);
  await customExec('npm run db:migrate');
  // 🌱 Seed anything you require
  // await customExec('npm run seed');
}
