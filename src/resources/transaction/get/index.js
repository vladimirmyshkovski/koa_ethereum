const web3Service = require('services/web3.service');

async function validator(ctx, next) {
  const hash = ctx.params.hash;
  const regex = RegExp(/^0x([A-Fa-f0-9]{64})$/);
  if (typeof hash !== 'string') {
    ctx.body = {
      errors: {
        hash: ['Ethereum transaction hash must be a string'],
      },
    };
    ctx.throw(400);
  };
  if (hash.lemgth <= 20) {
    ctx.body = {
      errors: {
        hash: ['Ethereum transaction hash length must be equals or more than 20'],
      },
    };
    ctx.throw(400);
  };
  if (!regex.test(hash)) {
    ctx.body = {
      errors: {
        hash: ['Ethereum transaction hash must be a hex string'],
      },
    };
    ctx.throw(400);
  };
  await next();
}

const handler = async (ctx) => {
  ctx.body = await web3Service.getTransactionByNumber(ctx.params.hash);
  ctx.status = 200;
};

module.exports.register = (router) => {
  router.get('/:hash', validator, handler);
};
