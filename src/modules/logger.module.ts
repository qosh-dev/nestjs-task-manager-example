import { Global, Module, RequestMethod } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Params, LoggerModule as PinoLogger } from 'nestjs-pino';
import * as path from 'path';
import * as pino from 'pino';
import { AppContextModule } from './als/app-context.module';
import { SystemHeaders } from './als/app-context.type';

@Global()
@Module({
  imports: [
    AppContextModule,
    PinoLogger.forRootAsync({
      imports: [AppContextModule],
      inject: [AsyncLocalStorage],
      useFactory: async (als: AsyncLocalStorage<any>): Promise<Params> => {
        const transport: pino.TransportMultiOptions = {
          targets: [
            {
              target: 'pino/file',
              options: {
                singleLine: true,
                destination: path.join(__dirname, '..', '..', 'app.log'),
              },
              level: 'debug',
            },
            {
              target: 'pino-pretty',
              options: { colorize: true, singleLine: true },
              level: 'debug',
            },
          ],
        };
        return {
          exclude: [
            { path: '/graphiql', method: RequestMethod.GET },
            { path: '/graphiql/config.js', method: RequestMethod.GET },
            { path: '/graphiql/main.js', method: RequestMethod.GET },
            { path: '/favicon.ico', method: RequestMethod.GET },
          ],
          pinoHttp: {
            transport,
            mixin() {
              const store = als.getStore();
              return {
                [SystemHeaders.xRequestId]: store?.[SystemHeaders.xRequestId],
              };
            },
            customProps: function (req, res) {
              const store = als.getStore();
              return {
                [SystemHeaders.xRequestId]: store?.[SystemHeaders.xRequestId],
              };
            },
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
