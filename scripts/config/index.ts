import dotenv from 'dotenv';

const config = dotenv.config({
  path: process.env.DOTENV,
}).parsed;

export const env = (() => {
  const env = Object.create({});
  Object.keys(config).forEach((key) => {
    env[`process.env.${key}`] =
      typeof config[key] === 'string' ? `'${config[key]}'` : config[key];
  });
  return env;
})();

export const isProd =
  typeof config.DEBUG !== 'undefined' && JSON.parse(config.DEBUG) === false;
