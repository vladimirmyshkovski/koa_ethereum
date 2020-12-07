const Joi = require('joi');
const web3 = require('w3');
const client = require('cache');
const validate = require('middlewares/validate');

async function getBlockByNumber(numberOfBLock) {
  const key = `block_number_${numberOfBLock}`;
  let value = null;
  client.get(key, function(err, reply) {
    if (reply) {
      value = JSON.parse(reply)
    }
  });
  if (!value) {
    value = await web3.eth.getBlock(numberOfBLock);
    client.setex(key, 60*60, JSON.stringify(value));
  }
  return value
}

const handler = async (ctx) => {
  ctx.body = await getBlockByNumber(ctx.params.id);
  ctx.status = 200;
};

module.exports.register = (router) => {
  router.get('/:id', handler);
};
