import dotenv from 'dotenv';

interface ENV {
  DEBUG: boolean;
  [k: string]: any;
}

const config = dotenv.config({
  path: process.env.DOTENV,
}).parsed;

export const isProd: boolean =
  typeof config.DEBUG === 'undefined' || JSON.parse(config.DEBUG) === false;

export const env: ENV = (() => {
  const env = Object.create(null);
  Object.keys(config).forEach((key) => {
    if ('DEBUG' === key) {
      env['process.env.DEBUG'] = !isProd;
    } else {
      env[`process.env.${key}`] =
        typeof config[key] === 'string' ? `'${config[key]}'` : config[key];
    }
  });
  return env;
})();
