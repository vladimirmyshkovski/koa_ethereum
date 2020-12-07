const mount = require('koa-mount');

const accountResource = require('resources/account/public');
const healthResource = require('resources/health/public');
const blockResource = require('resources/block/public');

module.exports = (app) => {
  app.use(mount('/account', accountResource));
  app.use(mount('/health', healthResource));
  app.use(mount('/block', blockResource));
};
