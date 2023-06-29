module.exports = {
  server: {
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 3000,
      env: 'DEVICE_PORT',
      arg: 'port',
    },
    localhostIp: {
      doc: 'The IP address to bind.',
      format: String,
      default: '0.0.0.0',
      env: 'LOCAL_HOST_IP',
    },
    allowedOrigins: {
      doc: 'Allowed CORS',
      format: String,
      default: '',
      env: 'ALLOWED_ORIGINS',
    },
    logLevel: {
      doc: 'Pino log level',
      format: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      default: 'debug',
      env: 'LOG_LEVEL',
    },
  },
  swagger: {
    apiUser: {
      doc: 'Swagger api-docs auth username.',
      format: String,
      default: 'admin',
      env: 'SWAGGER_USER',
    },
    apiPass: {
      doc: 'Swagger api-docs auth password.',
      format: String,
      default: 'admin',
      env: 'SWAGGER_PASS',
    },
  },
  typeorm: {
    host: {
      doc: 'Typeorm IP address to bind.',
      format: String,
      default: 'localhost',
      env: 'TYPEORM_HOST',
    },
    username: {
      doc: 'Typeorm username',
      format: String,
      default: 'admin',
      env: 'TYPEORM_USERNAME',
    },
    password: {
      doc: 'Typeorm password',
      format: String,
      default: 'admin',
      env: 'TYPEORM_PASSWORD',
    },
    database: {
      doc: 'Typeorm database',
      format: String,
      default: 'nestjs-practice-db',
      env: 'TYPEORM_DATABASE',
    },
    port: {
      doc: 'Typeorm port to bind.',
      format: 'port',
      default: 5432,
      env: 'TYPEORM_PORT',
    },
    logging: {
      doc: 'Typeorm logging',
      format: Array,
      default: ['error', 'schema'],
      env: 'TYPEORM_LOGGING',
    },
    sync: {
      doc: 'Typeorm sync',
      format: Boolean,
      default: false,
      env: 'TYPEORM_SYNC',
    },
    entities: {
      doc: 'Typeorm entities',
      format: String,
      default: 'src/**/*.model.ts',
      env: 'TYPEORM_ENTITIES',
    },
    migrations: {
      doc: 'Typeorm Migrations',
      format: String,
      default: 'src/data-access/migrations/**/*.ts',
      env: 'TYPEORM_MIGRATIONS',
    },
    migrationsDir: {
      doc: 'Typeorm Migrations Directory',
      format: String,
      default: 'src/data-access/migration',
      env: 'TYPEORM_MIGRATIONS_DIR',
    },
  },
  thirdParty: {
    url: {
      doc: 'Third party url for upcoming api',
      format: String,
      default: 'https://random-word-api.herokuapp.com',
      env: 'TP_URL',
    },
  }
};
