import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';
import { RequestContext, SystemHeaders } from './app-context.type';

export function AppContextMiddleware(als: AsyncLocalStorage<RequestContext>) {
  return (req, res, next) => {
    const headers = req.headers;
    const requestId = headers[SystemHeaders.xRequestId] as string;
    const store = {
      [SystemHeaders.xRequestId]: !requestId! || requestId! === '' ? randomUUID() : requestId!,
    };
    req.headers[SystemHeaders.xRequestId] = store[SystemHeaders.xRequestId];
    return als.run(store as any, () => {
      return next();
    });
  };
}
