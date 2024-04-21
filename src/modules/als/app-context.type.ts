export enum SystemHeaders {
  xRequestId = 'x-request-id',
}

export interface RequestContext {
  [SystemHeaders.xRequestId]: string;
}
