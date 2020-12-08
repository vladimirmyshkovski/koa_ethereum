const web3Service = require('services/web3.service');

async function validator(ctx, next) {
  const number = parseInt(ctx.params.number, 10);
  if (typeof number !== 'number') {
    ctx.body = {
      errors: {
        number: ['Ethereum number of block must be a number'],
      },
    };
    ctx.throw(400);
  }
  if (number <= 0) {
    ctx.body = {
      errors: {
        number: ['Ethereum number of block must be more than 0'],
      },
    };
    ctx.throw(400);
  }
  const block = await web3Service.getBlockByNumber(ctx.params.number);
  if (!block) {
    ctx.body = {
      errors: {
        hash: ['Ethereum number of block is incorrect'],
      },
    };
    ctx.throw(400);
  }
  await next();
}

const handler = async (ctx) => {
  ctx.body = await web3Service.getBlockByNumber(ctx.params.number);
  ctx.status = 200;
};

module.exports.register = (router) => {
  router.get('/:number', validator, handler);
};
