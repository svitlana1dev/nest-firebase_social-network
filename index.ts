import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as functions from 'firebase-functions/v2';
import admin, { ServiceAccount } from 'firebase-admin';
import 'dotenv/config';
import { AppModule } from './src/app.module';

const serviceAccountKey = {
  type: process.env.FB_TYPE,
  project_id: process.env.FB_PROJECT_ID,
  private_key_id: process.env.FB_PROJECT_KEY_ID,
  private_key: process.env.FB_PRIVATE_KEY,
  client_email: process.env.FB_CLIENT_EMAIL,
  client_id: process.env.FB_CLIENT_ID,
  auth_uri: process.env.FB_AUTH_URI,
  token_uri: process.env.FB_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FB_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FB_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FB_UNIVERSE_DOMAIN,
};

const expressServer = express();

const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors({
    origin: [process.env.CLIENT_URL_CORS, process.env.CLIENT_URL_CORS_2],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
};

export const graphql = functions.https.onRequest(
  {
    minInstances: 0,
    maxInstances: 10,
    timeoutSeconds: 90,
    memory: '512MiB',
  },
  async (request, response) => {
    await createFunction(expressServer);
    expressServer(request, response);
  },
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as ServiceAccount),
  databaseURL: process.env.FB_DATABASE_URL,
});

admin.firestore().settings({ ignoreUndefinedProperties: true });
