import * as Joi from 'joi';

export type Expand<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

export type SchemaType<TSchema> = Expand<{
  [key in keyof TSchema]: TSchema[key] extends Joi.StringSchema
    ? string
    : TSchema[key] extends Joi.NumberSchema
    ? number
    : TSchema[key] extends Joi.BooleanSchema
    ? boolean
    : string;
}>;

export type SchemaTypeConfs = { [n in string]: Joi.Schema };

export type RedisConnectionOptions = {
  url: string;
  host: string;
  port: number;
  passphrase: string;
};


export type DBOptionConfigType = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  typename: string;
};
