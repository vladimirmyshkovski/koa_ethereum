const web3Service = require('services/web3.service');

const handler = async (ctx) => {
  ctx.body = await web3Service.getBlockByNumber(ctx.params.id);
  ctx.status = 200;
};

module.exports.register = (router) => {
  router.get('/:id', handler);
};
