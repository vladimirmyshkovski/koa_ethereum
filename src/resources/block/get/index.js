const Joi = require('joi');
const web3 = require('w3');
const validate = require('middlewares/validate');

const ethereumBlocksData = {};

async function getBlockByNumber(numberOfBLock) {
  if (typeof(ethereumBlocksData[numberOfBLock]) !== 'undefined') {
    return ethereumBlocksData[numberOfBLock];
  }
  ethereumBlocksData[numberOfBLock] = await web3.eth.getBlock(numberOfBLock);
  return ethereumBlocksData[numberOfBLock];
}

const handler = async (ctx) => {
  ctx.body = await getBlockByNumber(ctx.params.id);
  ctx.status = 200;
};

module.exports.register = (router) => {
  router.get('/:id', handler);
};
