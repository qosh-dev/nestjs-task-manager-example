import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
import { RequestContext, SystemHeaders } from './app-context.type';

@Injectable()
export class AppContextIterceptor implements NestInterceptor {
  constructor(readonly als: AsyncLocalStorage<RequestContext>) {}
  intercept(execContext: ExecutionContext, next: CallHandler): Observable<any> {
    const existStore = this.als?.getStore();

    const context = execContext.getArgs()[1];
    const contextType = execContext.getType() as string;

    let requestId = existStore?.[SystemHeaders.xRequestId] ?? '';

    if (contextType === 'http') {
      const reply = context;
      const headers = reply.getHeaders();
      requestId = headers[SystemHeaders.xRequestId] as string;
    }

    if (!requestId || requestId! === '') {
      requestId = randomUUID();
    }

    const store = {
      [SystemHeaders.xRequestId]: requestId,
    };

    return this.als.run(store, () => next.handle());
  }
}
