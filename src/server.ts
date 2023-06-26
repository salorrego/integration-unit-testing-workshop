import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { get } from '../config/convict';
import { CustomLogger } from './utils/logger';
const basicAuth = require('express-basic-auth');

let app: INestApplication;

/**
 * Starts and waits for a Nest Application on a certain port
 * @return {Promise<void>}
 */
export async function startServer(): Promise<INestApplication> {
  try {
    app = await NestFactory.create(AppModule, {
      logger: CustomLogger,
    });

    app.enableCors({
      origin:
        get('server.allowedOrigins').length === 0
          ? '*'
          : get('server.allowedOrigins'),
    });

    configureOpenAPIDocumentation(app);
    setValidationPipe(app);

    await app.listen(get('server.port'));
  } catch (error) {
    console.error(
      `Something went wrong while starting the app ${error.message}, ${error.stack}`,
    );
  }
  return app;
}

/**
 * Closes a Nest Application
 * @return {Promise<void>}
 */
export async function closeServer(): Promise<void> {
  await app.close();
}

function configureOpenAPIDocumentation(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Service API')
    .setDescription('Service API Docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const apiUser = get('swagger.apiUser');
  const apiPass = get('swagger.apiPass');

  app.use(
    '/api-docs',
    basicAuth({
      challenge: true,
      users: { [apiUser]: apiPass },
    }),
  );
  SwaggerModule.setup('api-docs', app, document);
}

function setValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}
