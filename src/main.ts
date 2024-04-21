import {
  Logger as BaseLogger,
  NestApplicationOptions,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AsyncLocalStorage } from 'async_hooks';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { AppContextIterceptor } from './modules/als/app-context.interceptor';
import { AppContextMiddleware } from './modules/als/app-context.middleware';
import { RequestContext } from './modules/als/app-context.type';

async function start() {
  // ----------------------------------------------------------------------------------------
  // Configs
  // ----------------------------------------------------------------------------------------
  const appOptions: NestApplicationOptions = {
    cors: true,
  };

  const corsOptions: CorsOptions | CorsOptionsDelegate<any> = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Origin',
      'Accept',
    ],
  };

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const swaggerPath = 'swagger';
  const logger = new BaseLogger('Api');

  // ----------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------
  // Variables
  // ----------------------------------------------------------------------------------------
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    appOptions,
  );
  const configService = app.get(ConfigService);
  const als = app.get(AsyncLocalStorage) as AsyncLocalStorage<RequestContext>;
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  const loggerInstance = app.get(Logger);

  // ----------------------------------------------------------------------------------------

  SwaggerModule.setup(swaggerPath, app, document);

  app.use(AppContextMiddleware(als));
  app.useGlobalInterceptors(new AppContextIterceptor(als));
  app.useLogger(loggerInstance);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.enableCors(corsOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors: ValidationError[]) {
        const error = errors[0];
        const message = error.constraints[Object.keys(error.constraints)[0]];
        return new UnprocessableEntityException(message);
      },
    }),
  );

  // ----------------------------------------------------------------------------------------
  await app.listen(configService.port, () =>
    logger.log('Application started on port ' + configService.port),
  );
}

start();
