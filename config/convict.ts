import * as dotenv from 'dotenv';
dotenv.config();

import { join } from 'path';
const convict  = require('convict');

convict.addFormat(require('convict-format-with-validator').ipaddress);

const CONFIG_DIR = join(process.cwd(), 'config');
const CONFIG_FILE = join(CONFIG_DIR, 'config.js');

const configFileAsJs = {
  env: {
      doc: 'The application environment.',
      format: ['dev', 'test', 'prod' ],
      default: 'dev',
      env: 'NODE_ENV'
    },
  ...require(CONFIG_FILE)
}

const config = convict(configFileAsJs);

config.validate({ allowed: 'strict' });

const get = (val: string) => config.get(val);

export { get };
