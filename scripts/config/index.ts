import dotenv from 'dotenv';

export const NODE_ENV = process.env.NODE_ENV;

export const env = (() => {
  const config = dotenv.config({
    path: `.env.${NODE_ENV}`,
  }).parsed;
  const env = Object.create({});
  Object.keys(config).forEach((key) => {
    env[`process.env.${key}`] =
      typeof config[key] === 'string' ? `'${config[key]}'` : config[key];
  });
  return env;
})();

export const isProd = process.env.NODE_ENV === 'prod';
