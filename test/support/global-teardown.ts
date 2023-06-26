import path from 'path';
import { down } from 'docker-compose';
import isCI from 'is-ci';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getMigrations, truncateTable } from '../test-helpers';

export default async function tearDown() {
  if (process.env.noInfrastructure) {
    return;
  }

  // ⛔️ Erase all DB data
  await truncateTable('books');

  // ✋🏻 Run migrations revert only on CI env
  if (isCI) {
    // ⏮ DB migrations revert
    const customExec = promisify(exec);
    const migrations = await getMigrations();

    const migrationsToRun = [];
    for (let migration = 0; migration < migrations.rowCount; migration += 1) {
      await customExec('npm run typeorm:revert');
    }

    // ✋🏻 Stop docker container
    down({
      cwd: path.join(path.dirname(__filename), './docker'),
      log: true,
    })
      // eslint-disable-next-line promise/always-return
      .then((res) => {
        console.log('DOCKER COMPOSE DOWN SUCCESFULLY: ', res);
      })
      .catch((err) => {
        console.log('DOCKER COMPOSE DOWN ERROR: ', err);
      });
  }
}
