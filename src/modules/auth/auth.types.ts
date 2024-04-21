export type JWTPayload = {
  id: string;
};

export type JWTStrategyValidatePayload = JWTPayload & {
  iat: number;
  exp: number;
};

export type TokenPair = { accessToken: string; refreshToken: string };
